'use client';

import BreadcrumbNav from '@/components/shared/breadcrumb-nav';
import SiteFooter from '@/components/shared/site-footer';
import RsCalculator from '@/components/rs-calculator';

export default function RsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BreadcrumbNav currentPage="Газосодержание (Rs)" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Калькулятор газосодержания (R<sub>s</sub>)</h2>
        <p className="text-muted-foreground mb-6">Расчёт растворимости газа в нефти по эмпирическим корреляциям</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 flex-1">
        <RsCalculator />
      </div>
      <SiteFooter />
    </div>
  );
}
