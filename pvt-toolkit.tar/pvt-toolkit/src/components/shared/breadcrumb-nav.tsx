'use client';

import { usePageRouter } from '@/lib/router';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbNavProps {
  currentPage: string;
}

export default function BreadcrumbNav({ currentPage }: BreadcrumbNavProps) {
  const { navigate } = usePageRouter();

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground py-4">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Главная</span>
      </button>
      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-foreground font-medium truncate">{currentPage}</span>
    </nav>
  );
}
