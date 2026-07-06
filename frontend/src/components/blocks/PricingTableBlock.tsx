import './PricingTableBlock.css';
import type { StrapiBlockMembershipPricing } from '../../types/strapi';
import { RichText } from '../RichText';

type PricingTableBlockProps = StrapiBlockMembershipPricing;

function ArrowNEIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 17L17 7M17 7H10M17 7V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GRID_COL_CLASS: Record<number, string> = {
  1: 'pricing-table__grid--1',
  2: 'pricing-table__grid--2',
  3: 'pricing-table__grid--3',
};

export function PricingTableBlock({ heading, description, tiers, footerContent }: PricingTableBlockProps) {
  const cards = tiers ?? [];
  const colClass = GRID_COL_CLASS[cards.length] ?? '';

  return (
    <section className="pricing-table">
      <div className="pricing-table__inner">
        {(heading || description) && (
          <div className="pricing-table__header">
            {heading && <h2 className="pricing-table__heading">{heading}</h2>}
            {description && <RichText content={description} className="pricing-table__description" />}
          </div>
        )}
        <div className={`pricing-table__grid ${colClass}`}>
          {cards.map((tier, i) => (
            <article key={tier.id ?? i} className="pricing-table__card">
              {/* Price block — left column on mobile, bottom on desktop via CSS order */}
              <div className="pricing-table__price-block">
                <span className="pricing-table__price">{tier.price}</span>
                <span className="pricing-table__period">{tier.period ?? 'Yearly'}</span>
              </div>

              {/* Info block — right column on mobile, top on desktop */}
              <div className="pricing-table__card-info">
                <div className="pricing-table__card-title-row">
                  {tier.linkUrl ? (
                    <a
                      href={tier.linkUrl}
                      className="pricing-table__card-title-link"
                      aria-label={`${tier.tierName}${tier.subtitle ? ` ${tier.subtitle}` : ''} membership`}
                    >
                      <span className="pricing-table__card-name">{tier.tierName}</span>
                      <span className="pricing-table__arrow" aria-hidden="true">
                        <ArrowNEIcon />
                      </span>
                    </a>
                  ) : (
                    <h3 className="pricing-table__card-title">
                      <span className="pricing-table__card-name">{tier.tierName}</span>
                      <span className="pricing-table__arrow" aria-hidden="true">
                        <ArrowNEIcon />
                      </span>
                    </h3>
                  )}
                </div>
                {tier.subtitle && (
                  <p className="pricing-table__card-subtitle">{tier.subtitle}</p>
                )}
                {tier.description && (
                  <RichText content={tier.description} className="pricing-table__card-desc" />
                )}
              </div>
            </article>
          ))}
        </div>
        {footerContent && (
          <RichText content={footerContent} className="pricing-table__footer-content" />
        )}
      </div>
    </section>
  );
}
