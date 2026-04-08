'use client';

/**
 * Dynamically loads and renders a Tailgrids component by type and variation.
 */

import { useEffect, useState } from 'react';
import { getComponent } from '../ComponentRegistry';
import type { ComponentType } from 'react';

interface DynamicBlockProps {
  type: string;
  variation?: number;
  props?: Record<string, unknown>;
}

export function DynamicBlock({
  type,
  variation = 1,
  props: blockProps = {},
}: DynamicBlockProps) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    getComponent(type, variation)
      .then((C) => {
        if (!cancelled && C) setComponent(() => C);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => { cancelled = true; };
  }, [type, variation]);

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        Failed to load {type}:{variation}: {error.message}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="animate-pulse rounded bg-gray-200 py-12 dark:bg-gray-700" aria-hidden="true" />
    );
  }

  return <Component {...blockProps} />;
}
