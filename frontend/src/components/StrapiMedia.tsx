import type { CSSProperties } from 'react';
import { getStrapiImageUrl, getFocalPointStyle } from '../lib/strapi';
import type { StrapiImage } from '../types/strapi';

interface StrapiMediaProps {
  media?: StrapiImage | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  style?: CSSProperties;
  useFocalPoint?: boolean;
}

/**
 * Renders a Strapi media file as <video> or <img> based on MIME type.
 * Videos autoplay muted/looped (background style). Images behave as before.
 */
export function StrapiMedia({
  media,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  fetchpriority,
  style,
  useFocalPoint = false,
}: StrapiMediaProps) {
  const url = getStrapiImageUrl(media);
  if (!url) return null;

  const focalStyle = useFocalPoint ? getFocalPointStyle(media) : undefined;
  const mergedStyle = focalStyle || style ? { ...focalStyle, ...style } : undefined;

  if (media?.mime?.startsWith('video/')) {
    return (
      <video
        className={className}
        width={width ?? media?.width ?? undefined}
        height={height ?? media?.height ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        style={mergedStyle}
        aria-hidden="true"
      >
        <source src={url} type={media.mime} />
      </video>
    );
  }

  return (
    <img
      src={url}
      alt={alt ?? media?.alternativeText ?? ''}
      width={width ?? media?.width ?? undefined}
      height={height ?? media?.height ?? undefined}
      className={className}
      loading={loading}
      {...(fetchpriority ? { fetchPriority: fetchpriority } : {})}
      style={mergedStyle}
    />
  );
}
