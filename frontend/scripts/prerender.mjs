#!/usr/bin/env node
/**
 * Pre-renders static HTML for specified routes.
 * Fetches content from Strapi at build time and injects it so no runtime fetches are needed.
 *
 * Usage: node scripts/prerender.mjs
 */

import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import puppeteer from 'puppeteer'
import { fetchPreloadForRoute } from './prerender-fetch.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PORT = 3456

const ROUTES = ['/', '/blog', '/press', '/events', '/contact']

/** Strapi API URL – same logic as frontend; must be reachable for prerender. */
const STRAPI_URL = (process.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

async function checkStrapiReachable() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/theme-option?status=published`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error(`[prerender] Strapi returned ${res.status}. Ensure permissions: Settings → Users & Permissions → Public → find for theme-option.`)
      process.exit(1)
    }
  } catch (err) {
    console.error(
      `[prerender] Strapi not reachable at ${STRAPI_URL}.\n` +
        '  Start Strapi: cd strapi-backend && npm run develop\n' +
        '  Or set VITE_STRAPI_URL to your API URL and run build:static with that env.'
    )
    process.exit(1)
  }
}

function createServer() {
  return http.createServer((req, res) => {
    return handler(req, res, {
      public: DIST,
      cleanUrls: false,
      rewrites: [{ source: '**', destination: '/index.html' }],
    })
  })
}

function routeToPath(route) {
  if (route === '/') return 'index.html'
  const segments = route.replace(/^\//, '').split('/').filter(Boolean)
  return path.join(...segments, 'index.html')
}

const PRERENDER_ORIGIN = `http://127.0.0.1:${PORT}`

/**
 * Rewrite asset paths for static output. With base: './', Vite emits ./assets/...
 * For nested pages (blog/index.html), we need ../assets/ so paths resolve correctly
 * when served from subpaths or file://.
 */
function rewriteAssetPaths(html, depth) {
  const escaped = PRERENDER_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const prefix = depth <= 0 ? './' : '../'.repeat(depth)

  let out = html
    .replace(new RegExp(escaped + '/assets/', 'g'), prefix + 'assets/')
    .replace(new RegExp(escaped + '/vite\\.svg', 'g'), prefix + 'vite.svg')
    .replace(/(href|src)=["']\.\/(assets\/[^"']+)"/g, (_, attr, rest) => `${attr}="${prefix}${rest}"`)
    .replace(/(href|src)=["']\/(assets\/[^"']+)"/g, (_, attr, rest) => `${attr}="${prefix}${rest}"`)
    .replace(/(href)=["']\.\/vite\.svg["']/g, `$1="${prefix}vite.svg"`)
    .replace(/(href)=["']\/vite\.svg["']/g, `$1="${prefix}vite.svg"`)

  return out
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `npm run build` first.')
    process.exit(1)
  }

  console.log(`[prerender] Checking Strapi at ${STRAPI_URL}...`)
  await checkStrapiReachable()

  const server = createServer()
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  console.log(`[prerender] Serving dist/ at http://127.0.0.1:${PORT}`)

  const browser = await puppeteer.launch({ headless: true })

  try {
    for (const route of ROUTES) {
      const url = `http://127.0.0.1:${PORT}${route}`
      console.log(`[prerender] Fetching data for ${route}...`)
      const preload = await fetchPreloadForRoute(route)

      console.log(`[prerender] Rendering ${route}...`)
      const page = await browser.newPage()
      await page.evaluateOnNewDocument((data) => {
        window.__PRELOADED__ = data
      }, preload)
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

      // Wait for content (article h1 indicates data loaded) or max 2s
      await Promise.race([
        page.waitForSelector('article h1', { timeout: 2000 }).catch(() => null),
        new Promise((r) => setTimeout(r, 1500)),
      ])

      const html = await page.content()
      await page.close()

      const relPath = routeToPath(route)
      const outPath = path.join(DIST, relPath)
      const depth = route === '/' ? 0 : route.split('/').filter(Boolean).length
      const rewrittenHtml = rewriteAssetPaths(html, depth)

      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, rewrittenHtml, 'utf8')
      console.log(`[prerender] Wrote ${routeToPath(route)}`)
    }

    console.log('[prerender] Done. Content was loaded at build time — no runtime fetches needed for prerendered routes.')
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('[prerender]', err)
  process.exit(1)
})
