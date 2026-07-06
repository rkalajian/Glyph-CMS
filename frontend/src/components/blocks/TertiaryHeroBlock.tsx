import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import './TertiaryHeroBlock.css';
import type { StrapiBlockTertiaryHero } from '../../types/strapi';

export function TertiaryHeroBlock({ title, subtitle, image }: StrapiBlockTertiaryHero) {
  const imgUrl = getStrapiImageUrl(image);

  return (
    <section className="tertiary-hero" aria-label={title}>
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          aria-hidden
          width={1440}
          height={400}
          className="tertiary-hero__image"
          fetchPriority="high"
          loading="eager"
          style={getFocalPointStyle(image)}
        />
      )}
      <div className="tertiary-hero__overlay" aria-hidden />
      <div className="tertiary-hero__content">
        <div className="tertiary-hero__content-inner">
          <h1 className="tertiary-hero__title">{title}</h1>
          {subtitle && <p className="tertiary-hero__subtitle">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
