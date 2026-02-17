import { useEffect, useState } from 'react';
import { getPage } from '../lib/strapi';
import { DocumentTitle } from '../components/DocumentTitle';
import { RichText } from '../components/RichText';
import { Breadcrumb } from '../components/Breadcrumb';
import type { StrapiPage } from '../types/strapi';

export function ContactPage() {
  const [page, setPage] = useState<StrapiPage | null>(null);

  useEffect(() => {
    getPage('contact')
      .then((p) => setPage(p ?? null))
      .catch(() => setPage(null));
  }, []);

  const title = page?.seoTitle ?? page?.title ?? 'Contact';
  const displayTitle = page?.title ?? 'Contact';
  const subtitle = page?.subtitle ?? 'Have a question? Send us a message using the form below.';

  return (
    <article>
      <DocumentTitle title={title} />
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: displayTitle }]} />
      <h1 className="text-3xl font-bold mb-4">{displayTitle}</h1>
      <p className="text-muted mb-8">{subtitle}</p>
      {page?.content && (
        <div className="mb-8">
          <RichText content={page.content} />
        </div>
      )}
    </article>
  );
}
