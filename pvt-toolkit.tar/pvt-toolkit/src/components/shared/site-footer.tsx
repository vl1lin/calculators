'use client';

import { Beaker } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <Beaker className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">PVT Toolkit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Набор инструментов для расчёта PVT-свойств нефти по эмпирическим корреляциям.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Калькуляторы</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Газосодержание (R<sub>s</sub>)</li>
              <li>Объёмный коэффициент (B<sub>o</sub>)</li>
              <li>Давление насыщения (P<sub>b</sub>)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Источники</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Standing (1947)</li>
              <li>Lasater (1958)</li>
              <li>Vasquez &amp; Beggs (1980)</li>
              <li>Glasø (1980)</li>
              <li>Al-Marhoun (1985, 1988)</li>
              <li>Petrosky &amp; Farshad (1993)</li>
              <li>Elam (1957), Labedi (1982), Owolabi (1984)</li>
            </ul>
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PVT Toolkit. Образовательный проект.</p>
          <p>Все расчёты носят оценочный характер.</p>
        </div>
      </div>
    </footer>
  );
}
