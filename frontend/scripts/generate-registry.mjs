#!/usr/bin/env node

/**
 * Generate component registry for Next.js from Tailgrids components.
 * Replaces Vite's import.meta.glob since Next.js requires static imports.
 * Run this script before every build: npm run prebuild
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.join(__dirname, '../../components');
const OUTPUT_FILE = path.join(__dirname, '../src/components/component-registry.generated.ts');

function parseComponentKey(name) {
  const numMatch = name.match(/^([A-Za-z]+)(\d*)$/);
  const base = numMatch ? numMatch[1] : name;
  const variationStr = numMatch ? numMatch[2] : '';
  const variation = variationStr ? parseInt(variationStr, 10) : 1;
  return { type: base, variation };
}

function generateRegistry() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`[generate-registry] Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const dirs = fs.readdirSync(COMPONENTS_DIR).filter(name => {
    const fullPath = path.join(COMPONENTS_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  });

  const entries = dirs
    .map(name => {
      const { type, variation } = parseComponentKey(name);
      const key = `${type}:${variation}`;
      const relativePath = `${path.relative(path.dirname(OUTPUT_FILE), path.join(COMPONENTS_DIR, name, 'index.jsx'))}`.replace(/\\/g, '/');
      return { key, path: relativePath };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  const paths = entries
    .map(({ key, path }) => `  '${key}': '${path}',`)
    .join('\n');

  const content = `/**
 * AUTO-GENERATED component registry.
 * Run: node scripts/generate-registry.mjs
 * Do NOT edit manually.
 */

import type { ComponentType } from 'react';

export const componentPaths: Record<string, string> = {
${paths}
};

export const componentModules: Record<string, () => Promise<{ default: ComponentType }>> = {};

export async function getComponentModule(key: string): Promise<{ default: ComponentType } | null> {
  const path = componentPaths[key];
  if (!path) return null;
  try {
    return await import(path);
  } catch (e) {
    console.error(\`Failed to load component \${key}\`, e);
    return null;
  }
}
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

  console.log(`[generate-registry] Generated ${entries.length} component imports to ${OUTPUT_FILE}`);
}

generateRegistry();
