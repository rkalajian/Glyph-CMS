import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './OverlayPairBlock.css';
import type { StrapiBlockOverlayPair, StrapiImage } from '../../types/strapi';

function ArrowIcon() {
  return (
    <svg
      className="overlay-pair__arrow"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 27L27 9M27 9H13M27 9V23"
        stroke="#D36119"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PanelProps {
  heading?: string | null;
  body?: string | null;
  linkUrl?: string | null;
  imgUrl?: string | null;
  image?: StrapiImage | null;
  headingLevel?: 'h2' | 'h3' | null;
}

function PromoPanel({ heading, body, linkUrl, imgUrl, image, headingLevel }: PanelProps) {
  const HeadingTag = headingLevel === 'h2' ? 'h2' : 'h3';
  const content = (
    <div className="overlay-pair__panel">
      <div className="overlay-pair__image-wrap">
        {imgUrl && (
          <img
            src={imgUrl}
            alt=""
            width={610}
            height={592}
            className="overlay-pair__img"
            loading="lazy"
            style={getFocalPointStyle(image)}
          />
        )}
      </div>
      <div className="overlay-pair__text">
        <div className="overlay-pair__heading-row">
          {heading && <HeadingTag className="overlay-pair__heading">{heading}</HeadingTag>}
          {linkUrl && <ArrowIcon />}
        </div>
        {body && <RichText content={body} className="overlay-pair__body" />}
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} className="overlay-pair__link" aria-label={heading ?? undefined}>
        {content}
      </a>
    );
  }
  return content;
}

export function OverlayPairBlock({
  leftHeading, leftBody, leftLinkUrl, leftImage,
  rightHeading, rightBody, rightLinkUrl, rightImage,
  headingLevel,
}: StrapiBlockOverlayPair) {
  const leftImgUrl = getStrapiImageUrl(leftImage);
  const rightImgUrl = getStrapiImageUrl(rightImage);

  return (
    <section className="overlay-pair">
      <div className="overlay-pair__inner">
        <PromoPanel
          heading={leftHeading}
          body={leftBody}
          linkUrl={leftLinkUrl}
          imgUrl={leftImgUrl}
          image={leftImage}
          headingLevel={headingLevel}
        />
        <PromoPanel
          heading={rightHeading}
          body={rightBody}
          linkUrl={rightLinkUrl}
          imgUrl={rightImgUrl}
          image={rightImage}
          headingLevel={headingLevel}
        />
      </div>
    </section>
  );
}
