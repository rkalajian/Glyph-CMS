import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { StrapiPage } from '../../types/strapi';

interface ContactPageProps {
  page: StrapiPage | null;
}

export function ContactPage({ page }: ContactPageProps) {
  const displayTitle = page?.title ?? 'Contact';
  const subtitle = page?.subtitle ?? 'Have a question? Send us a message using the form below.';

  return (
    <article>
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
