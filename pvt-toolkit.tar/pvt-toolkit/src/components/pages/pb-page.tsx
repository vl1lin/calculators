'use client';

import BreadcrumbNav from '@/components/shared/breadcrumb-nav';
import SiteFooter from '@/components/shared/site-footer';
import PbCalculator from '@/components/pb-calculator';

export default function PbPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BreadcrumbNav currentPage="Давление насыщения (Pb)" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Давление насыщения (P<sub>b</sub>)</h2>
        <p className="text-muted-foreground mb-6">Корреляции давления насыщения с интерактивными графиками сравнения</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 flex-1">
        <PbCalculator />
      </div>
      <SiteFooter />
    </div>
  );
}
