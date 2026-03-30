'use client';

import { usePageRouter } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Droplets,
  Gauge,
  Waves,
  Beaker,
  BookOpen,
  AlertTriangle,
  Code2,
  Info,
  ArrowRight,
} from 'lucide-react';
import SiteFooter from '@/components/shared/site-footer';

interface NavCard {
  id: 'rs' | 'bo' | 'pb' | 'python' | 'about';
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  badge?: string;
}

const CARDS: NavCard[] = [
  {
    id: 'rs',
    icon: <Droplets className="w-6 h-6" />,
    title: 'Газосодержание (Rs)',
    subtitle: 'Solution Gas-Oil Ratio',
    description: 'Расчёт растворимости газа в нефти при заданных давлении и температуре. 6 корреляций: Standing, Lasater, Vasquez & Beggs, Glasø, Al-Marhoun, Petrosky & Farshad.',
    color: 'text-primary',
    bgColor: 'bg-primary/10 hover:bg-primary/15',
  },
  {
    id: 'bo',
    icon: <Gauge className="w-6 h-6" />,
    title: 'Объёмный коэффициент (Bo)',
    subtitle: 'Oil Formation Volume Factor',
    description: 'Отношение объёма нефти в пластовых условиях к объёму на поверхности. Параметрический анализ и экспорт в CSV. 5 корреляций.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/15',
  },
  {
    id: 'pb',
    icon: <Waves className="w-6 h-6" />,
    title: 'Давление насыщения (Pb)',
    subtitle: 'Saturation Pressure',
    description: 'Давление насыщения с интерактивными графиками и сравнением 9 корреляций. Ползунки для настройки параметров.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/15',
  },
  {
    id: 'python',
    icon: <Code2 className="w-6 h-6" />,
    title: 'Калькулятор на Python',
    subtitle: 'Исходный код',
    description: 'Исходный код и инструкция к калькулятору.',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 hover:bg-violet-500/15',
    badge: 'Находится в разработке',
  },
  {
    id: 'about',
    icon: <Info className="w-6 h-6" />,
    title: 'О проекте',
    subtitle: 'Информация',
    description: 'Подробная информация о проекте, используемых корреляциях и технологиях.',
    color: 'text-foreground',
    bgColor: 'bg-muted hover:bg-muted/80',
  },
];

export default function HomePage() {
  const { navigate } = usePageRouter();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4">20+ эмпирических корреляций</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl mx-auto">
            Калькуляторы PVT-свойств нефти
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Инструменты для расчёта растворимости газа, объёмного коэффициента нефти и давления насыщения по известным корреляциям
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Droplets className="w-4 h-4" /> Газосодержание R<sub>s</sub>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <Gauge className="w-4 h-4" /> Объёмный коэфф. B<sub>o</sub>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
              <Waves className="w-4 h-4" /> Давление насыщ. P<sub>b</sub>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h3 className="text-2xl font-bold mb-2">Разделы</h3>
        <p className="text-muted-foreground mb-8">Выберите калькулятор для работы</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(card => (
            <button
              key={card.id}
              onClick={() => navigate(card.id)}
              className="group text-left"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${card.color}`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-base leading-snug">{card.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground font-medium">{card.subtitle}</p>
                    {card.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white animate-pulse">{card.badge}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.description}</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${card.color} group-hover:gap-2 transition-all`}>
                    Открыть <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* About */}
      <Separator className="max-w-7xl mx-auto" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold mb-6">О проекте</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              Данный набор инструментов предназначен для расчёта основных PVT-свойств нефтяных систем по широко известным эмпирическим корреляциям. Корреляции охватывают период с 1947 по 1993 год и основаны на данных из различных нефтегазовых провинций мира.
            </p>
            <p>
              <strong className="text-foreground">Газосодержание (R<sub>s</sub>)</strong> — количество растворённого газа в нефти, выраженное в стандартных кубических футах на stock tank barrel (scf/STB). Зависит от давления, температуры, плотности газа и плотности нефти по шкале API.
            </p>
            <p>
              <strong className="text-foreground">Объёмный коэффициент (B<sub>o</sub>)</strong> — отношение объёма нефти при пластовых условиях к объёму при стандартных условиях, rb/STB. Учёт этого параметра критически важен для материального баланса запасов.
            </p>
            <p>
              <strong className="text-foreground">Давление насыщения (P<sub>b</sub>)</strong> — давление, при котором начинается выделение газа из раствора в нефти. Это ключевое давление для определения режима работы залежи.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Поддерживаемые корреляции</h4>
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
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                <p className="font-semibold">Важное примечание</p>
                <p>Данный калькулятор предназначен для <strong>образовательных и оценочных целей</strong>. Для проектных расчётов рекомендуется использовать специализированное ПО (Eclipse, PVTsim, CMG WinProp) и проверять данные по первоисточникам.</p>
                <div className="flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Все формулы основаны на опубликованных научных работах (1947–1993)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer spacer + Footer */}
      <div className="flex-1" />
      <SiteFooter />
    </div>
  );
}
