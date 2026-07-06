import { getRecentBlogPosts, getRecentPressReleases, getHeaderOptions, getStrapiImageUrl } from '../../lib/strapi';
import type { StrapiBlockRecentBlogPosts } from '../../types/strapi';
import { RecentBlogPostsClient } from './RecentBlogPostsClient';

export async function RecentBlogPostsBlock({
  heading,
  description,
  postsPerPage,
  contentType,
}: StrapiBlockRecentBlogPosts) {
  const isPress = contentType === 'press-release';
  const [items, headerOptions] = await Promise.all([
    isPress ? getRecentPressReleases() : getRecentBlogPosts(),
    getHeaderOptions(),
  ]);
  const logoUrl = getStrapiImageUrl(headerOptions?.logo) ?? undefined;
  return (
    <RecentBlogPostsClient
      items={items}
      heading={heading}
      description={description}
      postsPerPage={postsPerPage ?? 9}
      logoUrl={logoUrl}
      basePath={isPress ? '/press' : '/blog'}
    />
  );
}
