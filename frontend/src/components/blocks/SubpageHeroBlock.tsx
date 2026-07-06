import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './SubpageHeroBlock.css';
import type { StrapiBlockSubpageHero } from '../../types/strapi';

interface SubpageHeroBlockProps extends StrapiBlockSubpageHero {
  __component: 'blocks.subpage-hero';
}

export function SubpageHeroBlock({ title, subtitle, image, ctaText, ctaUrl }: SubpageHeroBlockProps) {
  const imgUrl = getStrapiImageUrl(image);

  return (
    <section className="subpage-hero" aria-label={title}>
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          aria-hidden
          width={1440}
          height={756}
          className="subpage-hero__image"
          fetchPriority="high"
          loading="eager"
          style={getFocalPointStyle(image)}
        />
      )}
      <div className="subpage-hero__overlay" aria-hidden />
      <div className="subpage-hero__content">
        <div className="subpage-hero__content-inner">
          <h1 className="subpage-hero__title">{title}</h1>
          {(subtitle || (ctaText && ctaUrl)) && (
            <div className="subpage-hero__bottom">
              {subtitle && <RichText content={subtitle} className="subpage-hero__subtitle" />}
              {ctaText && ctaUrl && (
                <a href={ctaUrl} className="subpage-hero__cta">{ctaText}</a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
