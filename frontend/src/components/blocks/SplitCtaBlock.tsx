import './SplitCtaBlock.css';
import type { StrapiBlockSplitCta } from '../../types/strapi';
import { RichText } from '../RichText';

type SplitCtaBlockProps = StrapiBlockSplitCta;

const BG_CLASS: Record<string, string> = {
  primary: 'split-cta__card--primary',
  surface:   'split-cta__card--surface',
  ink:  'split-cta__card--ink',
  highlight:   'split-cta__card--highlight',
};

export function SplitCtaBlock({ backgroundColor, heading, description, panels }: SplitCtaBlockProps) {
  const items = panels ?? [];
  const bgClass = BG_CLASS[backgroundColor ?? 'primary'] ?? BG_CLASS.primary;

  return (
    <section className="split-cta">
      <div className="split-cta__container">
        <div className={`split-cta__card ${bgClass}`}>
          {heading && <h2 className="split-cta__heading">{heading}</h2>}
          {description && (
            <RichText content={description} className="split-cta__description" />
          )}
          <div className="split-cta__panels" role="list">
            {items.map((panel, i) => (
              <div key={panel.id ?? i} className="split-cta__panel" role="listitem">
                {i > 0 && <div className="split-cta__divider" aria-hidden="true" />}
                <div className="split-cta__panel-inner">
                  <h3 className="split-cta__panel-title">{panel.title}</h3>
                  {panel.body && (
                    <RichText content={panel.body} className="split-cta__panel-body" />
                  )}
                  {panel.buttonText && panel.buttonUrl && (
                    <a href={panel.buttonUrl} className="split-cta__panel-btn">
                      {panel.buttonText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
