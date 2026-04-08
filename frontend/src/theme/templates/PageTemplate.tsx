import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';
import type { StrapiPage } from '../../types/strapi';

interface PageTemplateProps {
  page: StrapiPage;
}

export function PageTemplate({ page }: PageTemplateProps) {
  const breadcrumbItems = page.parent
    ? [
        { label: 'Home', url: '/' },
        { label: page.parent.title, url: `/pages/${page.parent.slug}` },
        { label: page.title },
      ]
    : [{ label: 'Home', url: '/' }, { label: page.title }];

  const hasBlocks = page.blocks && page.blocks.length > 0;

  return (
    <article>
      <header className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        {!hasBlocks && <h1 className="text-3xl font-bold">{page.title}</h1>}
      </header>
      {hasBlocks ? <BlockRenderer blocks={page.blocks} /> : <RichText content={page.content} />}
    </article>
  );
}
