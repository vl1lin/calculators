'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { pbCorrelations, isInLimits, CHART_COLORS } from '@/lib/correlations';
import type { PbCorrelation } from '@/lib/correlations';
import KatexFormula from './katex-formula';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RS_POINTS = Array.from({ length: 61 }, (_, i) => i * 50); // 0 to 3000

export default function PbCalculator() {
  const [selectedId, setSelectedId] = useState('standing');
  const [gg, setGg] = useState(0.75);
  const [api, setApi] = useState(35);
  const [temp, setTemp] = useState(180);

  // All-chart params
  const [allGG, setAllGG] = useState(0.75);
  const [allAPI, setAllAPI] = useState(35);
  const [allTemp, setAllTemp] = useState(180);

  const corr: PbCorrelation | undefined = pbCorrelations.find(c => c.id === selectedId);

  const buildSingleDatasets = useCallback((corr: PbCorrelation, ggV: number, apiV: number, tV: number) => {
    const inRangeData = RS_POINTS.map(rs => {
      if (!isInLimits(rs, corr.limits.Rs) || !isInLimits(ggV, corr.limits.gasGravity) || !isInLimits(apiV, corr.limits.oilAPI) || !isInLimits(tV, corr.limits.temperature)) return null;
      return Math.max(0, corr.calculate(rs, ggV, apiV, tV));
    });
    const outRangeData = RS_POINTS.map(rs => {
      if (isInLimits(rs, corr.limits.Rs) && isInLimits(ggV, corr.limits.gasGravity) && isInLimits(apiV, corr.limits.oilAPI) && isInLimits(tV, corr.limits.temperature)) return null;
      return Math.max(0, corr.calculate(rs, ggV, apiV, tV));
    });
    return [
      { label: 'В пределах применимости', data: inRangeData, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 0 },
      { label: 'Вне границ применимости', data: outRangeData, borderColor: '#2563EB', backgroundColor: 'transparent', borderWidth: 2, borderDash: [8, 4], fill: false, tension: 0.4, pointRadius: 0 },
    ];
  }, []);

  const buildAllDatasets = useCallback((ggV: number, apiV: number, tV: number) => {
    const datasets: { label: string; data: (number | null)[]; borderColor: string; borderWidth: number; borderDash?: number[]; tension: number; pointRadius: number; fill: boolean; hidden?: boolean }[] = [];
    pbCorrelations.forEach((corr, i) => {
      const solid = RS_POINTS.map(rs => {
        const inR = isInLimits(rs, corr.limits.Rs) && isInLimits(ggV, corr.limits.gasGravity) && isInLimits(apiV, corr.limits.oilAPI) && isInLimits(tV, corr.limits.temperature);
        return inR ? Math.max(0, corr.calculate(rs, ggV, apiV, tV)) : null;
      });
      const dashed = RS_POINTS.map(rs => {
        const inR = isInLimits(rs, corr.limits.Rs) && isInLimits(ggV, corr.limits.gasGravity) && isInLimits(apiV, corr.limits.oilAPI) && isInLimits(tV, corr.limits.temperature);
        return !inR ? Math.max(0, corr.calculate(rs, ggV, apiV, tV)) : null;
      });
      datasets.push({ label: corr.name, data: solid, borderColor: CHART_COLORS[i], borderWidth: 2, tension: 0.4, pointRadius: 0, fill: false });
      datasets.push({ label: `${corr.name} (вне)`, data: dashed, borderColor: CHART_COLORS[i], borderWidth: 1.5, borderDash: [5, 4], tension: 0.4, pointRadius: 0, fill: false, hidden: true });
    });
    return datasets;
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleFont: { size: 13 },
        bodyFont: { family: 'monospace', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { title: { display: true, text: 'Rs (scf/STB)', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(0,0,0,0.06)' } },
      y: { title: { display: true, text: 'Pb (psi)', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(0,0,0,0.06)' } },
    },
  };

  // Table data
  const tableRows = [0, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000].map(rs => ({
    rs,
    pb: corr ? Math.max(0, corr.calculate(rs, gg, api, temp)) : 0,
    inRange: corr ? isInLimits(rs, corr.limits.Rs) && isInLimits(gg, corr.limits.gasGravity) && isInLimits(api, corr.limits.oilAPI) && isInLimits(temp, corr.limits.temperature) : false,
  }));

  return (
    <div className="space-y-6">
      {/* Selector */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-sm font-semibold mb-2 block">Выберите корреляцию для детального просмотра</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full sm:w-[400px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pbCorrelations.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} — {c.origin}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Detail Panel: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Formula + Limits + Table */}
        <div className="space-y-6">
          {corr && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-lg">{corr.name}</CardTitle>
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">{corr.origin}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formula */}
                <div className="p-4 bg-muted rounded-lg">
                  <KatexFormula formula={corr.formulaLatex} />
                </div>

                {/* Limits */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Границы применимости</p>
                  <div className="grid grid-cols-2 gap-1.5 text-sm">
                    {corr.limits.Rs && <><span className="text-muted-foreground">R<sub>s</sub>:</span><span className="font-mono font-semibold">{corr.limits.Rs.min}–{corr.limits.Rs.max} scf/STB</span></>}
                    {corr.limits.gasGravity && <><span className="text-muted-foreground">γ<sub>g</sub>:</span><span className="font-mono font-semibold">{corr.limits.gasGravity.min}–{corr.limits.gasGravity.max}</span></>}
                    {corr.limits.oilAPI && <><span className="text-muted-foreground">API:</span><span className="font-mono font-semibold">{corr.limits.oilAPI.min}–{corr.limits.oilAPI.max} °API</span></>}
                    {corr.limits.temperature && <><span className="text-muted-foreground">T:</span><span className="font-mono font-semibold">{corr.limits.temperature.min}–{corr.limits.temperature.max} °F</span></>}
                  </div>
                </div>

                {/* Data Table */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>R<sub>s</sub> (scf/STB)</TableHead>
                        <TableHead>P<sub>b</sub> (psi)</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableRows.map(r => (
                        <TableRow key={r.rs}>
                          <TableCell className="font-mono">{r.rs}</TableCell>
                          <TableCell className="font-mono font-semibold">{r.pb.toFixed(1)}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.inRange ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
                              {r.inRange ? 'OK' : 'Вне'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Chart + Sliders */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Зависимость P<sub>b</sub> от R<sub>s</sub></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[340px]">
                <Line data={{ labels: RS_POINTS, datasets: corr ? buildSingleDatasets(corr, gg, api, temp) : [] }} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Sliders */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <p className="text-sm font-semibold">Параметры для выбранной корреляции</p>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <Label>γ<sub>g</sub></Label>
                  <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{gg.toFixed(2)}</span>
                </div>
                <Slider value={[gg]} min={0.5} max={1.5} step={0.01} onValueChange={v => setGg(v[0])} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <Label>API</Label>
                  <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{api.toFixed(1)}</span>
                </div>
                <Slider value={[api]} min={10} max={60} step={0.5} onValueChange={v => setApi(v[0])} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <Label>T (°F)</Label>
                  <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{temp}</span>
                </div>
                <Slider value={[temp]} min={50} max={350} step={5} onValueChange={v => setTemp(v[0])} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All correlations comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Сравнение всех корреляций</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="h-[420px]">
            <Line data={{ labels: RS_POINTS, datasets: buildAllDatasets(allGG, allAPI, allTemp) }} options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins!, legend: { ...(chartOptions.plugins?.legend ?? {}), position: 'bottom' as const } },
            }} />
          </div>
          <p className="text-xs text-center text-muted-foreground bg-muted p-2 rounded-md">
            Сплошные линии — в пределах границ применимости, пунктирные — за пределами (скрыты, можно включить в легенде)
          </p>

          <p className="text-sm font-semibold pt-2">Общие параметры для сравнения</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <Label>γ<sub>g</sub></Label>
                <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{allGG.toFixed(2)}</span>
              </div>
              <Slider value={[allGG]} min={0.5} max={1.5} step={0.01} onValueChange={v => setAllGG(v[0])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <Label>API</Label>
                <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{allAPI.toFixed(1)}</span>
              </div>
              <Slider value={[allAPI]} min={10} max={60} step={0.5} onValueChange={v => setAllAPI(v[0])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <Label>T (°F)</Label>
                <span className="font-mono font-semibold text-primary bg-primary/10 px-2 rounded">{allTemp}</span>
              </div>
              <Slider value={[allTemp]} min={50} max={350} step={5} onValueChange={v => setAllTemp(v[0])} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limits reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4" /> Сводная таблица границ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Корреляция</TableHead>
                  <TableHead>R<sub>s</sub></TableHead>
                  <TableHead>γ<sub>g</sub></TableHead>
                  <TableHead>API</TableHead>
                  <TableHead>T</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pbCorrelations.map(c => (
                  <TableRow key={c.id} className={c.id === selectedId ? 'bg-primary/5' : ''}>
                    <TableCell className="font-medium text-sm">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.limits.Rs?.min}–{c.limits.Rs?.max}</TableCell>
                    <TableCell className="font-mono text-xs">{c.limits.gasGravity?.min}–{c.limits.gasGravity?.max}</TableCell>
                    <TableCell className="font-mono text-xs">{c.limits.oilAPI?.min}–{c.limits.oilAPI?.max}</TableCell>
                    <TableCell className="font-mono text-xs">{c.limits.temperature?.min}–{c.limits.temperature?.max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
