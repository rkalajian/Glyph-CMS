/**
 * Registry of Tailgrids components.
 * Component registry is generated at build time by scripts/generate-registry.mjs
 */

import type { ComponentType } from 'react';
import { componentPaths, getComponentModule } from './component-registry.generated';

const registry = new Map<string, () => Promise<{ default: ComponentType }>>();

// Populate registry with lazy loaders
for (const [key] of Object.entries(componentPaths)) {
  registry.set(key, async () => {
    const mod = await getComponentModule(key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mod ?? { default: null as any };
  });
}

/** Get component by type and variation. Variation defaults to 1. */
export async function getComponent(
  type: string,
  variation: number = 1
): Promise<ComponentType | null> {
  const key = `${type}:${variation}`;
  const importFn = registry.get(key);
  if (!importFn) return null;
  const mod = await importFn();
  return mod?.default ?? null;
}

export function hasComponent(type: string, variation: number = 1): boolean {
  return registry.has(`${type}:${variation}`);
}

/** List all available { type, variation } pairs. */
export function getComponentTypes(): Array<{ type: string; variation: number }> {
  const seen = new Set<string>();
  return Array.from(registry.keys())
    .map((k) => {
      const [type, v] = k.split(':');
      return { type, variation: parseInt(v, 10) };
    })
    .filter(({ type, variation }) => {
      const key = `${type}:${variation}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) =>
      a.type === b.type ? a.variation - b.variation : a.type.localeCompare(b.type)
    );
}
