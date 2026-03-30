'use client';

import BreadcrumbNav from '@/components/shared/breadcrumb-nav';
import SiteFooter from '@/components/shared/site-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Beaker } from 'lucide-react';

const TECH_STACK = ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Chart.js', 'KaTeX', 'Framer Motion'];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BreadcrumbNav currentPage="О проекте" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">О проекте</h2>
        <p className="text-muted-foreground mb-6">Информация о веб-приложении и его возможностях</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 flex-1 space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Beaker className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">PVT Toolkit</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Веб-приложение для расчёта PVT-свойств нефти</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              PVT Toolkit — образовательный веб-проект, реализующий набор калькуляторов для расчёта основных PVT-свойств нефтяных систем. Все корреляции взяты из открытых научных публикаций и реализованы на TypeScript.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold font-mono">20+</p>
                <p className="text-xs text-muted-foreground">Корреляций</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold font-mono">3</p>
                <p className="text-xs text-muted-foreground">Калькулятора</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold font-mono">1947–93</p>
                <p className="text-xs text-muted-foreground">Годы</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capabilities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Возможности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm text-muted-foreground">
              <li>Расчёт газосодержания (Rs) — 6 корреляций</li>
              <li>Расчёт объёмного коэффициента (Bo) — 5 корреляций с параметрическим анализом</li>
              <li>Расчёт давления насыщения (Pb) — 9 корреляций с интерактивными графиками</li>
              <li>Проверка входных параметров на границы применимости</li>
              <li>Отображение формул с помощью KaTeX</li>
              <li>Экспорт результатов в CSV</li>
              <li>Адаптивный дизайн для мобильных устройств</li>
            </ul>
          </CardContent>
        </Card>

        {/* Correlations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Используемые корреляции</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { name: 'Standing', year: 1947 },
                { name: 'Elam', year: 1957 },
                { name: 'Lasater', year: 1958 },
                { name: 'Vasquez & Beggs', year: 1980 },
                { name: 'Glasø', year: 1980 },
                { name: 'Labedi', year: 1982 },
                { name: 'Owolabi', year: 1984 },
                { name: 'Al-Marhoun', year: 1985 },
                { name: 'Al-Marhoun', year: 1988 },
                { name: 'Petrosky & Farshad', year: 1993 },
              ].map(c => (
                <div key={c.name + c.year} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                  <span className="text-xs font-medium">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">{c.year}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech stack */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Технологии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map(tech => (
                <Badge key={tech} variant="secondary">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
