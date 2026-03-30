'use client';

import { useState, useCallback } from 'react';
import { boCorrelations, isInLimits } from '@/lib/correlations';
import type { BoCorrelation } from '@/lib/correlations';
import KatexFormula from './katex-formula';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, AlertTriangle, BookOpen, Shuffle, Download } from 'lucide-react';

interface Point { Rs: number; T: number; gammaG: number; API: number; Bo: number }

export default function BoCalculator() {
  const [selectedId, setSelectedId] = useState('standing');
  const [randomMode, setRandomMode] = useState(false);
  const [Rs, setRs] = useState('600');
  const [T, setT] = useState('180');
  const [gammaG, setGammaG] = useState('0.75');
  const [oilAPI, setOilAPI] = useState('35');

  // Range mode per parameter
  const [rangeMode, setRangeMode] = useState<Record<string, boolean>>({});
  const [RsRange, setRsRange] = useState({ min: '200', max: '1400', step: '200' });
  const [TRange, setTRange] = useState({ min: '100', max: '250', step: '20' });

  const [results, setResults] = useState<Point[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');

  const corr: BoCorrelation | undefined = boCorrelations.find(c => c.id === selectedId);

  const generateRandom = useCallback(() => {
    const r = (min: number, max: number, dec: number) => (min + Math.random() * (max - min)).toFixed(dec);
    setRs(r(200, 1500, 0));
    setT(r(100, 250, 0));
    setGammaG(r(0.55, 0.95, 2));
    setOilAPI(r(15, 65, 1));
  }, []);

  const generateRange = (min: number, max: number, step: number): number[] => {
    const vals: number[] = [];
    for (let v = min; v <= max + step * 0.001; v += step) vals.push(parseFloat(v.toFixed(6)));
    return vals;
  };

  const calculate = useCallback(() => {
    setError('');
    setResults([]);
    setWarnings([]);

    if (!corr) return;

    const variedParam = Object.entries(rangeMode).find(([, v]) => v)?.[0];

    if (variedParam) {
      let range: { min: number; max: number; step: number };
      let fixedRs: number, fixedT: number, fixedGG: number, fixedAPI: number;

      if (variedParam === 'Rs') {
        range = { min: parseFloat(RsRange.min), max: parseFloat(RsRange.max), step: parseFloat(RsRange.step) };
        fixedT = parseFloat(T); fixedGG = parseFloat(gammaG); fixedAPI = parseFloat(oilAPI);
        if (isNaN(fixedT) || isNaN(fixedGG) || isNaN(fixedAPI)) { setError('Заполните все фиксированные параметры'); return; }
        const vals = generateRange(range.min, range.max, range.step);
        const pts: Point[] = vals.map(v => ({ Rs: v, T: fixedT, gammaG: fixedGG, API: fixedAPI, Bo: corr.calculate(v, fixedT, fixedGG, fixedAPI) }));
        setResults(pts);
      } else if (variedParam === 'T') {
        range = { min: parseFloat(TRange.min), max: parseFloat(TRange.max), step: parseFloat(TRange.step) };
        fixedRs = parseFloat(Rs); fixedGG = parseFloat(gammaG); fixedAPI = parseFloat(oilAPI);
        if (isNaN(fixedRs) || isNaN(fixedGG) || isNaN(fixedAPI)) { setError('Заполните все фиксированные параметры'); return; }
        const vals = generateRange(range.min, range.max, range.step);
        const pts: Point[] = vals.map(v => ({ Rs: fixedRs, T: v, gammaG: fixedGG, API: fixedAPI, Bo: corr.calculate(fixedRs, v, fixedGG, fixedAPI) }));
        setResults(pts);
      }
    } else {
      // Single point
      const rs = parseFloat(Rs), t = parseFloat(T), gg = parseFloat(gammaG), api = parseFloat(oilAPI);
      if (isNaN(rs)) { setError('Газосодержание должно быть числом'); return; }
      if (isNaN(t)) { setError('Температура должна быть числом'); return; }
      if (isNaN(gg) || gg <= 0) { setError('Плотность газа должна быть положительным числом'); return; }
      if (isNaN(api)) { setError('Плотность нефти (API) должна быть числом'); return; }
      const bo = corr.calculate(rs, t, gg, api);
      setResults([{ Rs: rs, T: t, gammaG: gg, API: api, Bo: bo }]);

      const lim = corr.limits;
      const w: string[] = [];
      if (lim.Rs && !isInLimits(rs, lim.Rs)) w.push(`R_s ${rs} вне диапазона (${lim.Rs.min}–${lim.Rs.max})`);
      if (lim.temperature && !isInLimits(t, lim.temperature)) w.push(`T ${t}°F вне диапазона (${lim.temperature.min}–${lim.temperature.max})`);
      if (lim.gasGravity && !isInLimits(gg, lim.gasGravity)) w.push(`γ_g ${gg} вне диапазона (${lim.gasGravity.min}–${lim.gasGravity.max})`);
      if (lim.oilAPI && !isInLimits(api, lim.oilAPI)) w.push(`API ${api} вне диапазона (${lim.oilAPI.min}–${lim.oilAPI.max})`);
      setWarnings(w);
    }
  }, [Rs, T, gammaG, oilAPI, RsRange, TRange, rangeMode, corr]);

  const exportCSV = () => {
    if (results.length === 0) return;
    const header = 'Rs (scf/STB),T (°F),γg,API,Bo (rb/STB)\n';
    const rows = results.map(r => `${r.Rs},${r.T},${r.gammaG},${r.API},${r.Bo.toFixed(6)}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Bo_${corr?.id || 'results'}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleRange = (param: string) => {
    setRangeMode(prev => ({ ...prev, [param]: !prev[param] }));
  };

  return (
    <div className="space-y-6">
      {/* Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex-1 min-w-[260px]">
              <Label className="text-sm font-semibold mb-2 block">Выберите корреляцию</Label>
              <Select value={selectedId} onValueChange={(v) => { setSelectedId(v); setResults([]); setWarnings([]); setError(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {boCorrelations.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} — {c.origin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <Switch checked={randomMode} onCheckedChange={(v) => { setRandomMode(v); if (v) { Object.keys(rangeMode).forEach(k => toggleRange(k)); generateRandom(); } }} />
              <Label className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => { setRandomMode(!randomMode); if (!randomMode) { Object.keys(rangeMode).forEach(k => toggleRange(k)); generateRandom(); } }}>
                <Shuffle className="w-4 h-4" /> Случайные параметры
              </Label>
            </div>
          </div>
          {corr && <p className="mt-3 text-sm text-muted-foreground"><strong>Происхождение:</strong> {corr.origin}</p>}
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Rs */}
            <div>
              <Label className="text-sm font-medium">Газосодержание (R<sub>s</sub>), <span className="text-muted-foreground">scf/STB</span></Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="number" value={Rs} onChange={e => setRs(e.target.value)} disabled={randomMode || !!rangeMode.Rs} className="font-mono flex-1" />
                <Button variant={rangeMode.Rs ? 'default' : 'outline'} size="sm" onClick={() => toggleRange('Rs')} disabled={randomMode} className="whitespace-nowrap">
                  {rangeMode.Rs ? '✓ Диапазон' : '📊 Диапазон'}
                </Button>
              </div>
              {rangeMode.Rs && (
                <div className="mt-2 grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg animate-in slide-in-from-top-2 duration-200">
                  {(['min', 'max', 'step'] as const).map(f => (
                    <div key={f}>
                      <Label className="text-xs text-muted-foreground capitalize">{f}</Label>
                      <Input type="number" value={RsRange[f]} onChange={e => setRsRange(p => ({ ...p, [f]: e.target.value }))} className="mt-0.5 font-mono text-sm h-8" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* T */}
            <div>
              <Label className="text-sm font-medium">Температура (T), <span className="text-muted-foreground">°F</span></Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="number" value={T} onChange={e => setT(e.target.value)} disabled={randomMode || !!rangeMode.T} className="font-mono flex-1" />
                <Button variant={rangeMode.T ? 'default' : 'outline'} size="sm" onClick={() => toggleRange('T')} disabled={randomMode} className="whitespace-nowrap">
                  {rangeMode.T ? '✓ Диапазон' : '📊 Диапазон'}
                </Button>
              </div>
              {rangeMode.T && (
                <div className="mt-2 grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg animate-in slide-in-from-top-2 duration-200">
                  {(['min', 'max', 'step'] as const).map(f => (
                    <div key={f}>
                      <Label className="text-xs text-muted-foreground capitalize">{f}</Label>
                      <Input type="number" value={TRange[f]} onChange={e => setTRange(p => ({ ...p, [f]: e.target.value }))} className="mt-0.5 font-mono text-sm h-8" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* gamma_g */}
            <div>
              <Label className="text-sm font-medium">Плотность газа (γ<sub>g</sub>), <span className="text-muted-foreground">отн. ед.</span></Label>
              <Input type="number" value={gammaG} onChange={e => setGammaG(e.target.value)} step="0.01" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>

            {/* API */}
            <div>
              <Label className="text-sm font-medium">Плотность нефти (API), <span className="text-muted-foreground">°API</span></Label>
              <Input type="number" value={oilAPI} onChange={e => setOilAPI(e.target.value)} step="0.1" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <p className="text-sm text-muted-foreground">
            Количество точек: <strong className="font-mono text-foreground">
              {rangeMode.Rs ? Math.floor((parseFloat(RsRange.max) - parseFloat(RsRange.min)) / Math.max(parseFloat(RsRange.step), 0.001)) + 1 : 1} ×{' '}
              {rangeMode.T ? Math.floor((parseFloat(TRange.max) - parseFloat(TRange.min)) / Math.max(parseFloat(TRange.step), 0.001)) + 1 : 1}
            </strong>
          </p>

          <Button onClick={() => { if (randomMode) generateRandom(); calculate(); }} className="w-full h-12 text-base font-semibold gap-2">
            <Calculator className="w-5 h-5" /> Рассчитать B<sub>o</sub>
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && corr && (
        <>
          {/* Single result */}
          {results.length === 1 && (
            <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
              <CardContent className="pt-6 text-center">
                <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Результат расчета</p>
                <p className="text-5xl md:text-6xl font-bold text-emerald-600 dark:text-emerald-400 font-mono my-3">
                  {results[0].Bo.toFixed(4)}
                </p>
                <p className="text-lg text-muted-foreground">rb/STB</p>
              </CardContent>
            </Card>
          )}

          {/* Table for multiple results */}
          {results.length > 1 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Результаты параметрического анализа</CardTitle>
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5"><Download className="w-4 h-4" /> CSV</Button>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">№</TableHead>
                        <TableHead>R<sub>s</sub></TableHead>
                        <TableHead>T (°F)</TableHead>
                        <TableHead>γ<sub>g</sub></TableHead>
                        <TableHead>API</TableHead>
                        <TableHead className="font-bold text-emerald-600">B<sub>o</sub></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-mono">{r.Rs}</TableCell>
                          <TableCell className="font-mono">{r.T}</TableCell>
                          <TableCell className="font-mono">{r.gammaG}</TableCell>
                          <TableCell className="font-mono">{r.API}</TableCell>
                          <TableCell className="font-mono font-semibold text-emerald-600">{r.Bo.toFixed(4)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formula */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground mb-3">Формула корреляции:</p>
              <div className="p-4 bg-muted rounded-lg">
                <KatexFormula formula={corr.formulaLatex} />
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {warnings.length > 0 && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700 dark:text-amber-400">Внимание: параметры вне границ применимости</AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-300">
                {warnings.map((w, i) => <span key={i}>{w}<br /></span>)}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Limits info */}
      {corr && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4" /> Границы применимости</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {corr.limits.Rs && <div><span className="text-muted-foreground">R<sub>s</sub>:</span><br /><span className="font-mono font-semibold">{corr.limits.Rs.min}–{corr.limits.Rs.max}</span></div>}
              {corr.limits.temperature && <div><span className="text-muted-foreground">T:</span><br /><span className="font-mono font-semibold">{corr.limits.temperature.min}–{corr.limits.temperature.max} °F</span></div>}
              {corr.limits.gasGravity && <div><span className="text-muted-foreground">γ<sub>g</sub>:</span><br /><span className="font-mono font-semibold">{corr.limits.gasGravity.min}–{corr.limits.gasGravity.max}</span></div>}
              {corr.limits.oilAPI && <div><span className="text-muted-foreground">API:</span><br /><span className="font-mono font-semibold">{corr.limits.oilAPI.min}–{corr.limits.oilAPI.max} °API</span></div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
