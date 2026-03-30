'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface KatexFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function KatexFormula({ formula, displayMode = true, className = '' }: KatexFormulaProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(formula, ref.current, {
          displayMode,
          throwOnError: false,
          strict: false,
          trust: true,
        });
      } catch {
        ref.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return (
    <span
      ref={ref}
      className={`katex-container ${className}`}
      style={{ display: displayMode ? 'block' : 'inline', textAlign: 'center', overflowX: 'auto' }}
    />
  );
}
