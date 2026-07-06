import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './TwoColumnContentBlock.css';
import type { StrapiBlockTwoColumnContent, StrapiBlock } from '../../types/strapi';

function ArrowNE() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ColProps {
  heading?: string | null;
  body?: StrapiBlock[] | null;
  bodyLarge?: boolean;
  linkText?: string | null;
  linkUrl?: string | null;
  buttonPrimaryText?: string | null;
  buttonPrimaryUrl?: string | null;
  buttonSecondaryText?: string | null;
  buttonSecondaryUrl?: string | null;
}

function Col({ heading, body, bodyLarge, linkText, linkUrl, buttonPrimaryText, buttonPrimaryUrl, buttonSecondaryText, buttonSecondaryUrl }: ColProps) {
  return (
    <div className="two-col-content__col">
      {heading && <h2 className="two-col-content__heading">{heading}</h2>}
      {body && (
        <RichText
          content={body}
          className={bodyLarge ? 'two-col-content__rich-body--large' : 'two-col-content__rich-body'}
        />
      )}
      {linkText && linkUrl && (
        <div className="two-col-content__text-link-wrap">
          <a href={linkUrl} className="two-col-content__text-link">
            {linkText}
            <ArrowNE />
          </a>
        </div>
      )}
      {buttonPrimaryText && buttonPrimaryUrl && (
        <div className="two-col-content__buttons">
          <a href={buttonPrimaryUrl} className="two-col-content__btn-primary">
            {buttonPrimaryText}
          </a>
          {buttonSecondaryText && buttonSecondaryUrl && (
            <a href={buttonSecondaryUrl} className="two-col-content__btn-secondary">
              {buttonSecondaryText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function TwoColumnContentBlock({
  variant,
  leftHeading,
  leftBody,
  leftButtonPrimaryText,
  leftButtonPrimaryUrl,
  leftButtonSecondaryText,
  leftButtonSecondaryUrl,
  rightHeading,
  rightBody,
  rightButtonPrimaryText,
  rightButtonPrimaryUrl,
  rightButtonSecondaryText,
  rightButtonSecondaryUrl,
  image,
}: StrapiBlockTwoColumnContent) {
  const imgUrl = getStrapiImageUrl(image);
  const isTextLinks = variant === 'text-links';

  return (
    <section className={`two-col-content${isTextLinks ? ' two-col-content--text-links' : ''}`}>
      <div className="two-col-content__inner">
        <div className="two-col-content__columns">
          <Col
            heading={leftHeading}
            body={leftBody}
            bodyLarge={!isTextLinks}
            linkText={isTextLinks ? leftButtonPrimaryText : undefined}
            linkUrl={isTextLinks ? leftButtonPrimaryUrl : undefined}
            buttonPrimaryText={!isTextLinks ? leftButtonPrimaryText : undefined}
            buttonPrimaryUrl={!isTextLinks ? leftButtonPrimaryUrl : undefined}
            buttonSecondaryText={!isTextLinks ? leftButtonSecondaryText : undefined}
            buttonSecondaryUrl={!isTextLinks ? leftButtonSecondaryUrl : undefined}
          />
          <Col
            heading={rightHeading}
            body={rightBody}
            linkText={isTextLinks ? rightButtonPrimaryText : undefined}
            linkUrl={isTextLinks ? rightButtonPrimaryUrl : undefined}
            buttonPrimaryText={!isTextLinks ? rightButtonPrimaryText : undefined}
            buttonPrimaryUrl={!isTextLinks ? rightButtonPrimaryUrl : undefined}
            buttonSecondaryText={!isTextLinks ? rightButtonSecondaryText : undefined}
            buttonSecondaryUrl={!isTextLinks ? rightButtonSecondaryUrl : undefined}
          />
        </div>
        {imgUrl && (
          <div className={`two-col-content__image-wrap${isTextLinks ? ' two-col-content__image-wrap--rounded' : ''}`}>
            <img
              src={imgUrl}
              alt={image?.alternativeText ?? ''}
              width={image?.width ?? 1200}
              height={image?.height ?? 474}
              className="two-col-content__image"
              loading="lazy"
              style={getFocalPointStyle(image)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
