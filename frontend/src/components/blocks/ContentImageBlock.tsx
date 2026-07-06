import { RichText } from '../RichText';
import { StrapiMedia } from '../StrapiMedia';
import './ContentImageBlock.css';
import type { StrapiBlockContentImage } from '../../types/strapi';

interface ContentImageBlockProps extends StrapiBlockContentImage {
  __component: 'blocks.content-image';
}

export function ContentImageBlock({ heading, body, buttonText, buttonUrl, secondaryButtonText, secondaryButtonUrl, image, imagePosition, imageObjectFit }: ContentImageBlockProps) {
  const leftImage = imagePosition === 'left';
  const fitClass = imageObjectFit === 'contain' ? 'content-image__image--contain' : 'content-image__image--cover';

  return (
    <section className="content-image">
      <div className={`content-image__inner${leftImage ? ' content-image__inner--image-left' : ''}`}>
        <div className="content-image__text">
          {heading && <h2 className="content-image__heading">{heading}</h2>}
          {body && <RichText content={body} className="content-image__body" />}
          {(buttonText && buttonUrl) || (secondaryButtonText && secondaryButtonUrl) ? (
            <div className="content-image__cta-group">
              {buttonText && buttonUrl && (
                <a href={buttonUrl} className="content-image__cta">{buttonText}</a>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <a href={secondaryButtonUrl} className="content-image__cta content-image__cta--secondary">{secondaryButtonText}</a>
              )}
            </div>
          ) : null}
        </div>
        {image && (
          <div className="content-image__image-wrap">
            <StrapiMedia
              media={image}
              alt={image?.alternativeText ?? heading ?? ''}
              width={image?.width ?? 600}
              height={image?.height ?? 474}
              className={`content-image__image ${fitClass}`}
              loading="lazy"
              useFocalPoint={imageObjectFit !== 'contain'}
            />
          </div>
        )}
      </div>
    </section>
  );
}
