/**
 * App root – routing and layout shell.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PageTemplate } from './pages/PageTemplate';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { PressList } from './pages/PressList';
import { PressPost } from './pages/PressPost';
import { EventCalendar } from './pages/EventCalendar';
import { ContactPage } from './pages/ContactPage';
import { FormEmbedPage } from './pages/FormEmbedPage';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="embed/form/:slug" element={<FormEmbedPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="press" element={<PressList />} />
          <Route path="press/:slug" element={<PressPost />} />
          <Route path="events" element={<EventCalendar />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="pages/:slug" element={<PageTemplate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
