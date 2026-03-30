'use client';

import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type PageId = 'home' | 'rs' | 'bo' | 'pb' | 'python' | 'about';

const PAGE_LABELS: Record<PageId, string> = {
  home: 'Главная',
  rs: 'Газосодержание (Rs)',
  bo: 'Объёмный коэффициент (Bo)',
  pb: 'Давление насыщения (Pb)',
  python: 'Калькулятор на Python',
  about: 'О проекте',
};

const HASH_MAP: Record<string, PageId> = {
  '': 'home',
  '/': 'home',
  '#': 'home',
  '#rs': 'rs',
  '#bo': 'bo',
  '#pb': 'pb',
  '#python': 'python',
  '#about': 'about',
};

export function getPageLabel(id: PageId) {
  return PAGE_LABELS[id];
}

export function usePageRouter() {
  const [page, setPage] = useState<PageId>('home');

  useEffect(() => {
    const hash = window.location.hash || '';
    const initial = HASH_MAP[hash] || 'home';
    if (initial !== 'home') {
      void Promise.resolve().then(() => setPage(initial));
    }

    const onHashChange = () => {
      const h = window.location.hash || '';
      setPage(HASH_MAP[h] || 'home');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((target: PageId) => {
    if (target === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = target;
    }
  }, []);

  return { page, navigate };
}

export function PageTransition({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
