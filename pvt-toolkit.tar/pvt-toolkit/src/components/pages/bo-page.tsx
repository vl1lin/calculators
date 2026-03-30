'use client';

import BreadcrumbNav from '@/components/shared/breadcrumb-nav';
import SiteFooter from '@/components/shared/site-footer';
import BoCalculator from '@/components/bo-calculator';

export default function BoPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BreadcrumbNav currentPage="Объёмный коэффициент (Bo)" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Калькулятор объёмного коэффициента нефти (B<sub>o</sub>)</h2>
        <p className="text-muted-foreground mb-6">Расчёт B<sub>o</sub> по различным корреляциям с поддержкой параметрического анализа</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 flex-1">
        <BoCalculator />
      </div>
      <SiteFooter />
    </div>
  );
}
