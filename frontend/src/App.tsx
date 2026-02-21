/**
 * App root – routing and layout shell.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

const HomePage = lazy(() => import('./theme/templates/HomePage').then((m) => ({ default: m.HomePage })));
const PageTemplate = lazy(() => import('./theme/templates/PageTemplate').then((m) => ({ default: m.PageTemplate })));
const BlogList = lazy(() => import('./theme/templates/BlogList').then((m) => ({ default: m.BlogList })));
const BlogPost = lazy(() => import('./theme/templates/BlogPost').then((m) => ({ default: m.BlogPost })));
const PressList = lazy(() => import('./theme/templates/PressList').then((m) => ({ default: m.PressList })));
const PressPost = lazy(() => import('./theme/templates/PressPost').then((m) => ({ default: m.PressPost })));
const EventCalendar = lazy(() => import('./theme/templates/EventCalendar').then((m) => ({ default: m.EventCalendar })));
const ContactPage = lazy(() => import('./theme/templates/ContactPage').then((m) => ({ default: m.ContactPage })));
const FormEmbedPage = lazy(() => import('./theme/templates/FormEmbedPage').then((m) => ({ default: m.FormEmbedPage })));
const NotFound = lazy(() => import('./theme/templates/NotFound').then((m) => ({ default: m.NotFound })));

function PageFallback() {
  return (
    <article aria-busy="true" aria-live="polite">
      <p>Loading…</p>
    </article>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="embed/form/:slug" element={<Suspense fallback={<div className="min-h-[200px] flex items-center justify-center p-6">Loading…</div>}><FormEmbedPage /></Suspense>} />
        <Route element={<Layout />}>
          <Route index element={<Suspense fallback={<PageFallback />}><HomePage /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<PageFallback />}><BlogList /></Suspense>} />
          <Route path="blog/:slug" element={<Suspense fallback={<PageFallback />}><BlogPost /></Suspense>} />
          <Route path="press" element={<Suspense fallback={<PageFallback />}><PressList /></Suspense>} />
          <Route path="press/:slug" element={<Suspense fallback={<PageFallback />}><PressPost /></Suspense>} />
          <Route path="events" element={<Suspense fallback={<PageFallback />}><EventCalendar /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={<PageFallback />}><ContactPage /></Suspense>} />
          <Route path="pages/:slug" element={<Suspense fallback={<PageFallback />}><PageTemplate /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
