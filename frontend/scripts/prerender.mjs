#!/usr/bin/env node
/**
 * Pre-renders static HTML for specified routes.
 * Run after `vite build`. Requires Strapi (or VITE_STRAPI_URL) to be reachable.
 *
 * Usage: node scripts/prerender.mjs
 */

import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PORT = 3456

const ROUTES = ['/', '/blog', '/press', '/events', '/contact']

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
  const segments = route.replace(/^\//, '').split('/')
  return path.join(...segments, 'index.html')
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run `npm run build` first.')
    process.exit(1)
  }

  const server = createServer()
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  console.log(`[prerender] Serving dist/ at http://127.0.0.1:${PORT}`)

  const browser = await puppeteer.launch({ headless: true })

  try {
    for (const route of ROUTES) {
      const url = `http://127.0.0.1:${PORT}${route}`
      console.log(`[prerender] Rendering ${route}...`)

      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

      // Wait for content (article h1 indicates data loaded) or max 3s
      await Promise.race([
        page.waitForSelector('article h1', { timeout: 3000 }).catch(() => null),
        new Promise((r) => setTimeout(r, 2000)),
      ])

      const html = await page.content()
      await page.close()

      const outPath = path.join(DIST, routeToPath(route))
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, html, 'utf8')
      console.log(`[prerender] Wrote ${routeToPath(route)}`)
    }

    console.log('[prerender] Done.')
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('[prerender]', err)
  process.exit(1)
})
