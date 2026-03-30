'use client';

import { usePageRouter, type PageId } from '@/lib/router';
import { Beaker, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS: { id: PageId; label: string; sub?: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'rs', label: 'Rs', sub: 'Газосодержание' },
  { id: 'bo', label: 'Bo', sub: 'Объёмный коэфф.' },
  { id: 'pb', label: 'Pb', sub: 'Давление насыщ.' },
  { id: 'python', label: 'Python' },
  { id: 'about', label: 'О проекте' },
];

export default function SiteHeader() {
  const { page, navigate } = usePageRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: PageId) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Beaker className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight leading-none">PVT Toolkit</h1>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Petroleum Engineering</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
                {item.sub && <span className="hidden lg:inline ml-1.5 text-xs opacity-60">{item.sub}</span>}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span>{item.label}</span>
                {item.sub && <span className="text-xs opacity-60">{item.sub}</span>}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
