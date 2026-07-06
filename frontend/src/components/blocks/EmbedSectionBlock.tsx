import './EmbedSectionBlock.css';
import { RichText } from '../RichText';
import type { StrapiBlockEmbedSection } from '../../types/strapi';

export function EmbedSectionBlock({ heading, embedCode, description }: StrapiBlockEmbedSection) {
  return (
    <section className="embed-section">
      <div className="embed-section__inner">
        {heading && <h2 className="embed-section__heading">{heading}</h2>}
        {embedCode && (
          <div
            className="embed-section__media"
            dangerouslySetInnerHTML={{ __html: embedCode }}
          />
        )}
        {description && (
          <RichText content={description} className="embed-section__description" />
        )}
      </div>
    </section>
  );
}
