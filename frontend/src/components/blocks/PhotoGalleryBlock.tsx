import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './PhotoGalleryBlock.css';
import type { StrapiBlockPhotoGallery, StrapiGalleryImage } from '../../types/strapi';

interface PhotoGalleryBlockProps extends StrapiBlockPhotoGallery {
  __component: 'blocks.photo-gallery';
}

function GalleryImage({
  item,
  className,
  width,
  height,
}: {
  item: StrapiGalleryImage;
  className: string;
  width: number;
  height: number;
}) {
  const img = item.image;
  if (!img) return null;

  const imgEl = (
    <img
      src={getStrapiImageUrl(img) ?? ''}
      alt={img.alternativeText ?? ''}
      width={img.width ?? width}
      height={img.height ?? height}
      className={className}
      loading="lazy"
      style={getFocalPointStyle(img)}
    />
  );

  if (item.linkUrl) {
    return (
      <a
        href={item.linkUrl}
        className="photo-gallery__link"
        aria-label={item.linkLabel ?? img.alternativeText ?? undefined}
      >
        {imgEl}
        {item.linkLabel && (
          <span className="photo-gallery__link-label">{item.linkLabel}</span>
        )}
      </a>
    );
  }

  return imgEl;
}

export function PhotoGalleryBlock({ heading, description, galleryImages, variant }: PhotoGalleryBlockProps) {
  const items = galleryImages ?? [];
  if (items.length === 0) return null;

  const isGrid = variant === 'grid';
  const [first, second, third, ...rest] = items;

  return (
    <section className="photo-gallery">
      <div className="photo-gallery__inner">
        {(heading || description) && (
          <div className="photo-gallery__header">
            {heading && <h2 className="photo-gallery__heading">{heading}</h2>}
            {description && (
              <div className="photo-gallery__description">
                <RichText content={description} />
              </div>
            )}
          </div>
        )}
        {isGrid ? (
          <div className="photo-gallery__grid">
            {items.map((item, i) => (
              <GalleryImage
                key={item.id ?? i}
                item={item}
                className="photo-gallery__grid-img"
                width={500}
                height={500}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="photo-gallery__layout">
              {first && (
                <div className="photo-gallery__left">
                  <GalleryImage item={first} className="photo-gallery__left-img" width={700} height={900} />
                </div>
              )}
              {(second || third) && (
                <div className="photo-gallery__right">
                  {second && (
                    <GalleryImage item={second} className="photo-gallery__right-img" width={700} height={440} />
                  )}
                  {third && (
                    <GalleryImage item={third} className="photo-gallery__right-img" width={700} height={440} />
                  )}
                </div>
              )}
            </div>
            {rest.length > 0 && (
              <div className="photo-gallery__extra">
                {rest.map((item, i) => (
                  <GalleryImage
                    key={item.id ?? i}
                    item={item}
                    className="photo-gallery__extra-img"
                    width={300}
                    height={300}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
