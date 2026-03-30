'use client';

import { useState, useCallback } from 'react';
import { rsCorrelations, isInLimits } from '@/lib/correlations';
import type { RsCorrelation } from '@/lib/correlations';
import KatexFormula from './katex-formula';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, AlertTriangle, BookOpen, Shuffle } from 'lucide-react';

export default function RsCalculator() {
  const [selectedId, setSelectedId] = useState('standing');
  const [randomMode, setRandomMode] = useState(false);
  const [P, setP] = useState('');
  const [T, setT] = useState('');
  const [gammaG, setGammaG] = useState('');
  const [oilAPI, setOilAPI] = useState('');
  const [Psp, setPsp] = useState('');
  const [Tsp, setTsp] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');

  const corr: RsCorrelation | undefined = rsCorrelations.find(c => c.id === selectedId);

  const generateRandom = useCallback(() => {
    const ranges: Record<string, [number, number, number]> = {
      P: [100, 5000, 0],
      T: [100, 250, 0],
      gammaG: [0.55, 0.95, 2],
      oilAPI: [15, 65, 1],
      Psp: [50, 200, 0],
      Tsp: [60, 120, 0],
    };
    const rand = (key: string) => {
      const [min, max, dec] = ranges[key];
      return (min + Math.random() * (max - min)).toFixed(dec);
    };
    setP(rand('P'));
    setT(rand('T'));
    setGammaG(rand('gammaG'));
    setOilAPI(rand('oilAPI'));
    setPsp(rand('Psp'));
    setTsp(rand('Tsp'));
  }, []);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);
    setWarnings([]);

    const pVal = parseFloat(P);
    const tVal = parseFloat(T);
    const ggVal = parseFloat(gammaG);
    const apiVal = parseFloat(oilAPI);

    if (isNaN(pVal) || pVal <= 0) { setError('Давление должно быть положительным числом'); return; }
    if (isNaN(tVal) || tVal <= 0) { setError('Температура должна быть положительным числом'); return; }
    if (isNaN(ggVal) || ggVal <= 0) { setError('Плотность газа должна быть положительным числом'); return; }
    if (isNaN(apiVal) || apiVal <= 0) { setError('Плотность нефти (API) должна быть положительным числом'); return; }

    if (!corr) return;

    if (corr.needsSeparatorParams) {
      const pspVal = parseFloat(Psp);
      const tspVal = parseFloat(Tsp);
      if (isNaN(pspVal) || pspVal <= 0) { setError('Давление сепарации должно быть положительным числом'); return; }
      if (isNaN(tspVal) || tspVal <= 0) { setError('Температура сепарации должна быть положительным числом'); return; }
      setResult(corr.calculate(pVal, tVal, ggVal, apiVal, pspVal, tspVal));
    } else {
      setResult(corr.calculate(pVal, tVal, ggVal, apiVal));
    }

    // Check limits
    const lim = corr.limits;
    const w: string[] = [];
    if (lim.pressure && !isInLimits(pVal, lim.pressure)) w.push(`Давление ${pVal} psi вне диапазона (${lim.pressure.min}–${lim.pressure.max})`);
    if (lim.temperature && !isInLimits(tVal, lim.temperature)) w.push(`Температура ${tVal}°F вне диапазона (${lim.temperature.min}–${lim.temperature.max})`);
    if (lim.gasGravity && !isInLimits(ggVal, lim.gasGravity)) w.push(`Плотность газа ${ggVal} вне диапазона (${lim.gasGravity.min}–${lim.gasGravity.max})`);
    if (lim.oilAPI && !isInLimits(apiVal, lim.oilAPI)) w.push(`Плотность нефти ${apiVal}°API вне диапазона (${lim.oilAPI.min}–${lim.oilAPI.max})`);
    setWarnings(w);
  }, [P, T, gammaG, oilAPI, Psp, Tsp, corr]);

  return (
    <div className="space-y-6">
      {/* Selector & Random Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex-1 min-w-[260px]">
              <Label className="text-sm font-semibold mb-2 block">Выберите корреляцию</Label>
              <Select value={selectedId} onValueChange={(v) => { setSelectedId(v); setResult(null); setWarnings([]); setError(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rsCorrelations.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} — {c.origin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <Switch checked={randomMode} onCheckedChange={(v) => { setRandomMode(v); if (v) generateRandom(); }} />
              <Label className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => { setRandomMode(!randomMode); if (!randomMode) generateRandom(); }}>
                <Shuffle className="w-4 h-4" /> Случайные параметры
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-medium">Давление (P), <span className="text-muted-foreground">psi</span></Label>
              <Input type="number" value={P} onChange={e => setP(e.target.value)} placeholder="Например, 2500" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>
            <div>
              <Label className="text-sm font-medium">Температура (T), <span className="text-muted-foreground">°F</span></Label>
              <Input type="number" value={T} onChange={e => setT(e.target.value)} placeholder="Например, 180" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>
            <div>
              <Label className="text-sm font-medium">Плотность газа (γ<sub>g</sub>), <span className="text-muted-foreground">отн. ед.</span></Label>
              <Input type="number" value={gammaG} onChange={e => setGammaG(e.target.value)} placeholder="Например, 0.75" step="0.01" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>
            <div>
              <Label className="text-sm font-medium">Плотность нефти (API), <span className="text-muted-foreground">°API</span></Label>
              <Input type="number" value={oilAPI} onChange={e => setOilAPI(e.target.value)} placeholder="Например, 35" step="0.1" disabled={randomMode} className="mt-1.5 font-mono" />
            </div>
          </div>

          {/* Separator params for Vasquez */}
          {corr?.needsSeparatorParams && (
            <div className="mt-5 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <p className="text-sm font-semibold text-primary mb-3">Дополнительные параметры для Vasquez & Beggs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium">Давление сепарации (P<sub>sp</sub>), <span className="text-muted-foreground">psi</span></Label>
                  <Input type="number" value={Psp} onChange={e => setPsp(e.target.value)} placeholder="Например, 100" disabled={randomMode} className="mt-1.5 font-mono" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Температура сепарации (T<sub>sp</sub>), <span className="text-muted-foreground">°F</span></Label>
                  <Input type="number" value={Tsp} onChange={e => setTsp(e.target.value)} placeholder="Например, 80" disabled={randomMode} className="mt-1.5 font-mono" />
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-destructive font-medium">{error}</p>}

          <Button onClick={() => { if (randomMode) generateRandom(); calculate(); }} className="w-full mt-5 h-12 text-base font-semibold gap-2">
            <Calculator className="w-5 h-5" /> Рассчитать R<sub>s</sub>
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result !== null && corr && (
        <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Результат расчета</p>
            <p className="text-5xl md:text-6xl font-bold text-emerald-600 dark:text-emerald-400 font-mono my-3">
              {result.toFixed(2)}
            </p>
            <p className="text-lg text-muted-foreground">scf/STB</p>

            {/* Formula */}
            <div className="mt-6 p-4 bg-background rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Используемая формула:</p>
              <KatexFormula formula={corr.formulaLatex} />
            </div>

            {/* Reference */}
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-left">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Источник</p>
              <p className="text-sm text-amber-800 dark:text-amber-300 italic">{corr.reference}</p>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700 dark:text-red-400">Предупреждение</AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-300">
                  {warnings.map((w, i) => <span key={i}>{w}<br /></span>)}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applicability limits info */}
      {corr && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4" /> Границы применимости</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {corr.limits.pressure && <div><span className="text-muted-foreground">Давление:</span><br /><span className="font-mono font-semibold">{corr.limits.pressure.min}–{corr.limits.pressure.max} psi</span></div>}
              {corr.limits.temperature && <div><span className="text-muted-foreground">Температура:</span><br /><span className="font-mono font-semibold">{corr.limits.temperature.min}–{corr.limits.temperature.max} °F</span></div>}
              {corr.limits.gasGravity && <div><span className="text-muted-foreground">γ<sub>g</sub>:</span><br /><span className="font-mono font-semibold">{corr.limits.gasGravity.min}–{corr.limits.gasGravity.max}</span></div>}
              {corr.limits.oilAPI && <div><span className="text-muted-foreground">API:</span><br /><span className="font-mono font-semibold">{corr.limits.oilAPI.min}–{corr.limits.oilAPI.max} °API</span></div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
