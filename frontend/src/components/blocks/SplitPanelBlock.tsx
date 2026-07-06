import { RichText } from '../RichText';
import { StrapiMedia } from '../StrapiMedia';
import { getStrapiImageUrl } from '../../lib/strapi';
import './SplitPanelBlock.css';
import type { StrapiBlockSplitPanel } from '../../types/strapi';

const BG_CLASSES: Record<string, string> = {
  primary: 'split-panel--primary',
  secondary:  'split-panel--secondary',
  accent:  'split-panel--accent',
  ink:  'split-panel--ink',
};

export function SplitPanelBlock({ heading, body, ctaText, ctaUrl, image, videoAutoplay, bgColor, imagePosition }: StrapiBlockSplitPanel) {
  const colorClass = BG_CLASSES[bgColor ?? 'primary'] ?? BG_CLASSES.primary;
  const imgRight = imagePosition === 'right';
  const isVideo = image?.mime?.startsWith('video/') ?? false;
  const videoSrc = isVideo ? getStrapiImageUrl(image) : null;

  return (
    <section className={`split-panel ${colorClass}${imgRight ? ' split-panel--img-right' : ''}`}>
      <div className="split-panel__image" aria-hidden={!image}>
        {image && isVideo && videoSrc ? (
          <video
            src={videoSrc}
            className="split-panel__video"
            {...(videoAutoplay !== false
              ? { autoPlay: true, muted: true, loop: true, playsInline: true }
              : { controls: true })}
          />
        ) : image ? (
          <StrapiMedia
            media={image}
            alt=""
            width={960}
            height={550}
            className="split-panel__img"
            loading="lazy"
            useFocalPoint
          />
        ) : null}
      </div>

      <div className="split-panel__content">
        <h2 className="split-panel__heading">{heading}</h2>
        {body && <RichText content={body} className="split-panel__body" />}
        {ctaUrl && ctaText && (
          <div className="split-panel__cta-wrap">
            <a href={ctaUrl} className="split-panel__cta">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
