'use client';

import { Code2, ExternalLink, BookOpen, FileJson, FileSpreadsheet, Terminal, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BreadcrumbNav from '@/components/shared/breadcrumb-nav';
import SiteFooter from '@/components/shared/site-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const FEATURES = [
  { icon: <FileJson className="w-5 h-5" />, title: 'Импорт JSON', desc: 'Загрузка конфигурационных файлов в формате JSON' },
  { icon: <FileSpreadsheet className="w-5 h-5" />, title: 'Импорт CSV', desc: 'Работа с табличными данными из CSV-файлов' },
  { icon: <Terminal className="w-5 h-5" />, title: 'Множество данных', desc: 'Массовая обработка массивов PVT-данных' },
  { icon: <Download className="w-5 h-5" />, title: 'Экспорт результатов', desc: 'Выгрузка расчётов в удобных форматах' },
];

export default function PythonPage() {
  return (
    <TooltipProvider delayDuration={0}>
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BreadcrumbNav currentPage="Калькулятор на Python" />
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Калькулятор на Python</h2>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white animate-pulse">Находится в разработке</span>
        </div>
        <p className="text-muted-foreground mb-6">Исходный код и инструкция к калькулятору</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 flex-1 space-y-8">
        {/* Description */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">PVT Correlation Calculator</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Python</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Данный калькулятор предназначен для работы с множеством данных. Поддерживается возможность импорта конфигурационных файлов и файлов формата JSON, CSV для массовой обработки PVT-расчётов.
            </p>
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild className="gap-2" variant="outline">
                    <a href="https://github.com/vl1lin/Correlation" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" /> Открыть репозиторий
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm font-medium">Данный раздел находится в разработке, просьба не переходить в репозиторий</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Возможности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(f => (
                <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-primary flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Технологии
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Python', 'JSON', 'CSV', 'Pandas', 'NumPy', 'Matplotlib', 'SciPy'].map(tech => (
                <Badge key={tech} variant="secondary">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
    </TooltipProvider>
  );
}
