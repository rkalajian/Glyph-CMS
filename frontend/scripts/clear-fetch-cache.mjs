#!/usr/bin/env node

/**
 * Deletes Next.js's persisted Data Cache (.next/cache/fetch-cache) before every
 * build. Next caches build-time fetch responses there ACROSS builds, so without
 * this a local rebuild can serve stale Strapi content even after publishing
 * changes. Compiler caches (swc/webpack) are left alone — builds stay fast.
 */

import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.next', 'cache', 'fetch-cache');
rmSync(dir, { recursive: true, force: true });
