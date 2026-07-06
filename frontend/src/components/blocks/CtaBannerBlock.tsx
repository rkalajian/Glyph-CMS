import './CtaBannerBlock.css';
import type { StrapiBlockCtaBanner } from '../../types/strapi';
import { RichText } from '../RichText';

interface CtaBannerBlockProps extends StrapiBlockCtaBanner {
  __component: 'blocks.cta-banner';
}

const cardClass: Record<string, string> = {
  primary: 'cta-banner__card--primary',
  accent: 'cta-banner__card--accent',
  secondary: 'cta-banner__card--secondary',
  ink: 'cta-banner__card--ink',
  highlight:  'cta-banner__card--highlight',
};

export function CtaBannerBlock({ heading, body, buttonText, buttonUrl, backgroundColor }: CtaBannerBlockProps) {
  const colorClass = cardClass[backgroundColor ?? 'primary'] ?? cardClass.primary;
  return (
    <section className="cta-banner">
      <div className={`cta-banner__card ${colorClass}`}>
        <div className="cta-banner__row">
          <div className="cta-banner__text">
            {heading && <h2 className="cta-banner__heading">{heading}</h2>}
            {body && <RichText content={body} className="cta-banner__body" />}
          </div>
          {buttonText && buttonUrl && (
            <a href={buttonUrl} className="cta-banner__button">
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
