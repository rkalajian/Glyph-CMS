/**
 * Renders page blocks from Strapi dynamic zone.
 */

import type { ReactElement } from 'react';
import { DynamicBlock } from './DynamicBlock';
import { AboutBlock } from './AboutBlock';
import { RichText } from '../RichText';
import { getStrapiImageUrl } from '../../lib/strapi';
import { AccordionBlock } from './AccordionBlock';
import { SubpageHeroBlock } from './SubpageHeroBlock';
import { TertiaryHeroBlock } from './TertiaryHeroBlock';
import { SplitCtaBlock } from './SplitCtaBlock';
import { PhotoGalleryBlock } from './PhotoGalleryBlock';
import { ContentImageBlock } from './ContentImageBlock';
import { HomepageHeroBlock } from './HomepageHeroBlock';
import { InfoBarBlock } from './InfoBarBlock';
import { QuickLinksGridBlock } from './QuickLinksGridBlock';
import { FeaturedCarouselBlock } from './FeaturedCarouselBlock';
import { SplitPanelBlock } from './SplitPanelBlock';
import { UpcomingEventsBlock } from './UpcomingEventsBlock';
import { TwoColumnContentBlock } from './TwoColumnContentBlock';
import { ProfileCarouselBlock } from './ProfileCarouselBlock';
import { NameListBlock } from './NameListBlock';
import { OverlayPairBlock } from './OverlayPairBlock';
import { StatementBlock } from './StatementBlock';
import { CtaBannerBlock } from './CtaBannerBlock';
import { ContentCardGridBlock } from './ContentCardGridBlock';
import { CarouselSectionBlock } from './CarouselSectionBlock';
import { ContactPanelsBlock } from './ContactPanelsBlock';
import { PricingTableBlock } from './PricingTableBlock';
import { EventCalendarBlock } from './EventCalendarBlock';
import { FeaturedEventsBlock } from './FeaturedEventsBlock';
import { MediaCardsBlock } from './MediaCardsBlock';
import { FeaturedBlogPostsBlock } from './FeaturedBlogPostsBlock';
import { RecentBlogPostsBlock } from './RecentBlogPostsBlock';
import { ContactInfoBlock } from './ContactInfoBlock';
import { ContactFormBlock } from './ContactFormBlock';
import { EmbedSectionBlock } from './EmbedSectionBlock';
import { FeaturePriorityBlock } from './FeaturePriorityBlock';
import type {
  StrapiPageBlock,
  StrapiBlockHero,
  StrapiBlockAbout,
  StrapiBlockAccordion,
  StrapiBlockBrand,
  StrapiBlockCard,
  StrapiBlockChart,
  StrapiBlockFeatures,
  StrapiBlockCta,
  StrapiBlockMap,
  StrapiBlockModal,
  StrapiBlockNewsletter,
  StrapiBlockPopover,
  StrapiBlockPricing,
  StrapiBlockProductCarousel,
  StrapiBlockProductGrid,
  StrapiBlockPromoBanner,
  StrapiBlockStats,
  StrapiBlockStep,
  StrapiBlockTab,
  StrapiBlockTable,
  StrapiBlockTeam,
  StrapiBlockTestimonials,
  StrapiBlockRichText,
  StrapiBlockTailgridsComponent,
  StrapiBlockVideo,
  StrapiBlockRow,
  StrapiBlockSubpageHero,
  StrapiBlockTertiaryHero,
  StrapiBlockSplitCta,
  StrapiBlockPhotoGallery,
  StrapiBlockContentImage,
  StrapiBlockHomepageHero,
  StrapiBlockInfoBar,
  StrapiBlockQuickLinksGrid,
  StrapiBlockFeaturedCarousel,
  StrapiBlockSplitPanel,
  StrapiBlockUpcomingEvents,
  StrapiBlockTwoColumnContent,
  StrapiBlockProfileCarousel,
  StrapiBlockNameList,
  StrapiBlockOverlayPair,
  StrapiBlockStatement,
  StrapiBlockCtaBanner,
  StrapiBlockContentCardGrid,
  StrapiBlockCarouselSection,
  StrapiBlockContactPanels,
  StrapiBlockMembershipPricing,
  StrapiBlockFeaturedEvents,
  StrapiBlockMediaCards,
  StrapiBlockFeaturedBlogPosts,
  StrapiBlockRecentBlogPosts,
  StrapiBlockContactInfo,
  StrapiBlockContactForm,
  StrapiBlockEmbedSection,
  StrapiBlockFeaturePriority,
} from '../../types/strapi';

/**
 * Blocks ported from the production block system render their own full-width
 * sections (each brings its own CSS), unlike Tailgrids blocks which go through
 * the DynamicBlock registry. Returns null when the block isn't one of them.
 */
function renderPortedBlock(block: StrapiPageBlock, key: string): ReactElement | null {
  switch (block.__component) {
    case 'blocks.subpage-hero':
      return <SubpageHeroBlock key={key} {...(block as StrapiBlockSubpageHero)} />;
    case 'blocks.tertiary-hero':
      return <TertiaryHeroBlock key={key} {...(block as StrapiBlockTertiaryHero)} />;
    case 'blocks.split-cta':
      return <SplitCtaBlock key={key} {...(block as StrapiBlockSplitCta)} />;
    case 'blocks.photo-gallery':
      return <PhotoGalleryBlock key={key} {...(block as StrapiBlockPhotoGallery)} />;
    case 'blocks.content-image':
      return <ContentImageBlock key={key} {...(block as StrapiBlockContentImage)} />;
    case 'blocks.homepage-hero':
      return <HomepageHeroBlock key={key} {...(block as StrapiBlockHomepageHero)} />;
    case 'blocks.info-bar':
      return <InfoBarBlock key={key} {...(block as StrapiBlockInfoBar)} />;
    case 'blocks.quick-links-grid':
      return <QuickLinksGridBlock key={key} {...(block as StrapiBlockQuickLinksGrid)} />;
    case 'blocks.featured-carousel':
      return <FeaturedCarouselBlock key={key} {...(block as StrapiBlockFeaturedCarousel)} />;
    case 'blocks.split-panel':
      return <SplitPanelBlock key={key} {...(block as StrapiBlockSplitPanel)} />;
    case 'blocks.upcoming-events':
      return <UpcomingEventsBlock key={key} {...(block as StrapiBlockUpcomingEvents)} />;
    case 'blocks.two-column-content':
      return <TwoColumnContentBlock key={key} {...(block as StrapiBlockTwoColumnContent)} />;
    case 'blocks.leadership-grid':
      return <ProfileCarouselBlock key={key} {...(block as StrapiBlockProfileCarousel)} />;
    case 'blocks.board-of-directors':
      return <NameListBlock key={key} {...(block as StrapiBlockNameList)} />;
    case 'blocks.promo-cards':
      return <OverlayPairBlock key={key} {...(block as StrapiBlockOverlayPair)} />;
    case 'blocks.statement':
      return <StatementBlock key={key} {...(block as StrapiBlockStatement)} />;
    case 'blocks.cta-banner':
      return <CtaBannerBlock key={key} {...(block as StrapiBlockCtaBanner)} />;
    case 'blocks.content-card-grid':
      return <ContentCardGridBlock key={key} {...(block as StrapiBlockContentCardGrid)} />;
    case 'blocks.carousel-section':
      return <CarouselSectionBlock key={key} {...(block as StrapiBlockCarouselSection)} />;
    case 'blocks.contact-panels':
      return <ContactPanelsBlock key={key} {...(block as StrapiBlockContactPanels)} />;
    case 'blocks.membership-pricing':
      return <PricingTableBlock key={key} {...(block as StrapiBlockMembershipPricing)} />;
    case 'blocks.event-calendar':
      return <EventCalendarBlock key={key} />;
    case 'blocks.featured-events':
      return <FeaturedEventsBlock key={key} {...(block as StrapiBlockFeaturedEvents)} />;
    case 'blocks.media-cards':
      return <MediaCardsBlock key={key} {...(block as StrapiBlockMediaCards)} />;
    case 'blocks.featured-blog-posts':
      return <FeaturedBlogPostsBlock key={key} {...(block as StrapiBlockFeaturedBlogPosts)} />;
    case 'blocks.recent-blog-posts':
      return <RecentBlogPostsBlock key={key} {...(block as StrapiBlockRecentBlogPosts)} />;
    case 'blocks.contact-info':
      return <ContactInfoBlock key={key} {...(block as StrapiBlockContactInfo)} />;
    case 'blocks.contact-form':
      return <ContactFormBlock key={key} {...(block as StrapiBlockContactForm)} />;
    case 'blocks.embed-section':
      return <EmbedSectionBlock key={key} {...(block as StrapiBlockEmbedSection)} />;
    case 'blocks.mission-priorities':
      return <FeaturePriorityBlock key={key} {...(block as StrapiBlockFeaturePriority)} />;
    default:
      return null;
  }
}

type BlockMapping =
  | { type: string; variation: number; props: Record<string, unknown> }
  | null;

function mapBlockToComponent(block: StrapiPageBlock): BlockMapping {
  switch (block.__component) {
    case 'blocks.hero': {
      const b = block as StrapiBlockHero;
      return {
        type: 'Hero',
        variation: b.variation ?? 1,
        props: {
          title: b.title,
          subtitle: b.subtitle ?? undefined,
          primaryButtonText: b.primaryButtonText ?? undefined,
          primaryButtonUrl: b.primaryButtonUrl ?? undefined,
          secondaryButtonText: b.secondaryButtonText ?? undefined,
          secondaryButtonUrl: b.secondaryButtonUrl ?? undefined,
          image: getStrapiImageUrl(b.image) ?? undefined,
          hideNavbar: true,
        },
      };
    }
    case 'blocks.about': {
      const b = block as StrapiBlockAbout;
      const items = b.items?.map((item) => ({
        title: item.title,
        description: item.description ?? undefined,
        iconUrl: getStrapiImageUrl(item.icon) ?? undefined,
      })) ?? [];
      const listItems = b.listItems?.map((li) => ({ text: li.text })) ?? [];
      const images = b.images?.map((img) => getStrapiImageUrl(img)).filter(Boolean) as string[] | undefined;
      return {
        type: '__AboutBlock__',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          badge: b.badge ?? undefined,
          subtitle: b.subtitle ?? undefined,
          description: b.description ?? undefined,
          buttonText: b.buttonText ?? undefined,
          buttonUrl: b.buttonUrl ?? undefined,
          image: getStrapiImageUrl(b.image) ?? undefined,
          images: images && images.length > 0 ? images : undefined,
          items: items.length > 0 ? items : undefined,
          listItems: listItems.length > 0 ? listItems : undefined,
          statsNumber: b.statsNumber ?? undefined,
          statsLabel: b.statsLabel ?? undefined,
          statsSublabel: b.statsSublabel ?? undefined,
        },
      };
    }
    case 'blocks.features': {
      const b = block as StrapiBlockFeatures;
      const items =
        b.items?.map((item) => ({
          title: item.title,
          description: item.description ?? undefined,
          details: item.description ?? undefined,
          iconUrl: getStrapiImageUrl(item.icon) ?? undefined,
        })) ?? [];
      return {
        type: 'Service',
        variation: b.variation ?? 1,
        props: {
          title: b.title,
          subtitle: b.subtitle ?? undefined,
          items: items.length > 0 ? items : undefined,
        },
      };
    }
    case 'blocks.cta': {
      const b = block as StrapiBlockCta;
      return {
        type: 'Cta',
        variation: b.variation ?? 1,
        props: {
          title: b.title,
          description: b.description ?? undefined,
          buttonText: b.buttonText,
          buttonUrl: b.buttonUrl,
        },
      };
    }
    case 'blocks.testimonials': {
      const b = block as StrapiBlockTestimonials;
      const items =
        b.items?.map((item) => ({
          quote: item.quote,
          author: item.author,
          role: item.role ?? undefined,
        })) ?? [];
      return {
        type: 'Testimonial',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          items: items.length > 0 ? items : undefined,
        },
      };
    }
    case 'blocks.accordion': {
      const b = block as StrapiBlockAccordion;
      const items =
        b.items?.map((item) => ({
          header: item.header,
          text: item.text ?? undefined,
          text2: item.text2 ?? undefined,
          listItems: item.listItems?.map((li) => ({ text: li.text })) ?? [],
        })) ?? [];
      return {
        type: '__AccordionBlock__',
        variation: b.variation ?? 1,
        props: {
          badge: b.badge ?? undefined,
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          items: items.length > 0 ? items : undefined,
        },
      };
    }
    case 'blocks.brand': {
      const b = block as StrapiBlockBrand;
      const items =
        b.items?.map((item) => ({
          imgSrc: getStrapiImageUrl(item.image) ?? undefined,
          href: item.href ?? undefined,
          alt: item.alt ?? undefined,
        })) ?? [];
      return {
        type: 'Brand',
        variation: b.variation ?? 1,
        props: { title: b.title ?? undefined, items: items.length > 0 ? items : undefined },
      };
    }
    case 'blocks.card': {
      const b = block as StrapiBlockCard;
      const items =
        b.items?.map((item) => ({
          image: getStrapiImageUrl(item.image) ?? undefined,
          title: item.title,
          description: item.description ?? undefined,
          buttonText: item.buttonText ?? undefined,
          buttonUrl: item.buttonUrl ?? undefined,
          titleUrl: item.titleUrl ?? undefined,
        })) ?? [];
      return {
        type: 'Card',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          items: items.length > 0 ? items : undefined,
        },
      };
    }
    case 'blocks.chart': {
      const b = block as StrapiBlockChart;
      return {
        type: 'Chart',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          chartType: b.chartType ?? undefined,
          ...(b.props ? (b.props as Record<string, unknown>) : {}),
        },
      };
    }
    case 'blocks.map': {
      const b = block as StrapiBlockMap;
      return {
        type: 'Map',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          embedUrl: b.embedUrl ?? undefined,
          address: b.address ?? undefined,
        },
      };
    }
    case 'blocks.modal': {
      const b = block as StrapiBlockModal;
      return {
        type: 'Modal',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          content: b.content ?? undefined,
          triggerText: b.triggerText ?? undefined,
          triggerButtonStyle: b.triggerButtonStyle ?? undefined,
        },
      };
    }
    case 'blocks.newsletter': {
      const b = block as StrapiBlockNewsletter;
      return {
        type: 'Newsletter',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          placeholder: b.placeholder ?? undefined,
          buttonText: b.buttonText ?? undefined,
          actionUrl: b.actionUrl ?? undefined,
        },
      };
    }
    case 'blocks.popover': {
      const b = block as StrapiBlockPopover;
      return {
        type: 'Popover',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          content: b.content ?? undefined,
          triggerText: b.triggerText ?? undefined,
        },
      };
    }
    case 'blocks.pricing': {
      const b = block as StrapiBlockPricing;
      const plans =
        b.plans?.map((p) => ({
          name: p.name,
          price: p.price ?? undefined,
          period: p.period ?? undefined,
          description: p.description ?? undefined,
          features: p.features ?? undefined,
          buttonText: p.buttonText ?? undefined,
          buttonUrl: p.buttonUrl ?? undefined,
          highlighted: p.highlighted ?? undefined,
        })) ?? [];
      return {
        type: 'Pricing',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          plans: plans.length > 0 ? plans : undefined,
        },
      };
    }
    case 'blocks.product-carousel': {
      const b = block as StrapiBlockProductCarousel;
      const products =
        b.products?.map((p) => ({
          image: getStrapiImageUrl(p.image) ?? undefined,
          title: p.title,
          price: p.price ?? undefined,
          originalPrice: p.originalPrice ?? undefined,
          description: p.description ?? undefined,
          url: p.url ?? undefined,
        })) ?? [];
      return {
        type: 'ProductCarousel',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          products: products.length > 0 ? products : undefined,
        },
      };
    }
    case 'blocks.product-grid': {
      const b = block as StrapiBlockProductGrid;
      const products =
        b.products?.map((p) => ({
          image: getStrapiImageUrl(p.image) ?? undefined,
          title: p.title,
          price: p.price ?? undefined,
          originalPrice: p.originalPrice ?? undefined,
          description: p.description ?? undefined,
          url: p.url ?? undefined,
        })) ?? [];
      return {
        type: 'ProductGrid',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          products: products.length > 0 ? products : undefined,
        },
      };
    }
    case 'blocks.promo-banner': {
      const b = block as StrapiBlockPromoBanner;
      return {
        type: 'PromoBanner',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          linkUrl: b.linkUrl ?? undefined,
          linkText: b.linkText ?? undefined,
          image: getStrapiImageUrl(b.image) ?? undefined,
        },
      };
    }
    case 'blocks.stats': {
      const b = block as StrapiBlockStats;
      const items =
        b.items?.map((i) => ({
          number: i.number,
          label: i.label ?? undefined,
          sublabel: i.sublabel ?? undefined,
        })) ?? [];
      return {
        type: 'Stats',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          items: items.length > 0 ? items : undefined,
        },
      };
    }
    case 'blocks.step': {
      const b = block as StrapiBlockStep;
      const steps =
        b.steps?.map((s) => ({
          number: s.number ?? undefined,
          title: s.title,
          description: s.description ?? undefined,
        })) ?? [];
      return {
        type: 'Step',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          steps: steps.length > 0 ? steps : undefined,
        },
      };
    }
    case 'blocks.tab': {
      const b = block as StrapiBlockTab;
      const tabs =
        b.tabs?.map((t) => ({
          label: t.label,
          content: t.content ?? undefined,
        })) ?? [];
      return {
        type: 'Tab',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          tabs: tabs.length > 0 ? tabs : undefined,
        },
      };
    }
    case 'blocks.table': {
      const b = block as StrapiBlockTable;
      return {
        type: 'Table',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          headers: b.headers,
          rows: b.rows,
        },
      };
    }
    case 'blocks.team': {
      const b = block as StrapiBlockTeam;
      const members =
        b.members?.map((m) => ({
          name: m.name,
          role: m.role ?? undefined,
          image: getStrapiImageUrl(m.image) ?? undefined,
          bio: m.bio ?? undefined,
          socialLinks: m.socialLinks,
        })) ?? [];
      return {
        type: 'Team',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          members: members.length > 0 ? members : undefined,
        },
      };
    }
    case 'blocks.video': {
      const b = block as StrapiBlockVideo;
      return {
        type: 'Video',
        variation: b.variation ?? 1,
        props: {
          title: b.title ?? undefined,
          subtitle: b.subtitle ?? undefined,
          videoUrl: b.videoUrl ?? undefined,
          thumbnailUrl: b.thumbnailUrl ?? undefined,
          embedCode: b.embedCode ?? undefined,
        },
      };
    }
    case 'blocks.tailgrids-component': {
      const b = block as StrapiBlockTailgridsComponent;
      const baseProps = (b.props as Record<string, unknown>) ?? {};
      const merged = {
        ...baseProps,
        ...(b.title && { title: b.title }),
        ...(b.subtitle && { subtitle: b.subtitle }),
      };
      return {
        type: b.componentType,
        variation: b.variation ?? 1,
        props: merged,
      };
    }
    default:
      return null;
  }
}

const COL_CLASSES = { '2': 'grid-cols-2', '3': 'grid-cols-3', '4': 'grid-cols-4' } as const;
const GAP_CLASSES = { '4': 'gap-4', '6': 'gap-6', '8': 'gap-8' } as const;

function renderBlock(block: StrapiPageBlock, key: string, inRow?: boolean) {
  if (block.__component === 'blocks.rich-text-block') {
    const b = block as StrapiBlockRichText;
    const wrapperClass = inRow ? 'py-4' : 'container mx-auto px-4 py-12';
    return (
      <div key={key} className={wrapperClass}>
        <RichText content={b.content} />
      </div>
    );
  }

  const ported = renderPortedBlock(block, key);
  if (ported) {
    const anchorId = (block as { anchorId?: string | null }).anchorId || undefined;
    return anchorId ? (
      <div key={key} id={anchorId}>
        {ported}
      </div>
    ) : (
      ported
    );
  }

  const mapped = mapBlockToComponent(block);
  if (!mapped) return null;

        if (mapped.type === '__AboutBlock__') {
          return (
            <AboutBlock
              key={key}
              variation={mapped.variation}
              {...(mapped.props as Record<string, unknown>)}
            />
          );
        }

        if (mapped.type === '__AccordionBlock__') {
          return (
            <AccordionBlock
              key={key}
              variation={mapped.variation}
              {...(mapped.props as Record<string, unknown>)}
            />
          );
        }

        return (
    <DynamicBlock
      key={key}
      type={mapped.type}
      variation={mapped.variation}
      props={mapped.props}
    />
  );
}

interface BlockRendererProps {
  blocks: StrapiPageBlock[] | null | undefined;
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-0">
      {blocks.map((block, i) => {
        const key = `block-${i}-${block.__component}`;

        if (block.__component === 'blocks.row') {
          const row = block as StrapiBlockRow;
          const cols = row.columns ?? '2';
          const gap = row.gap ?? '6';
          const innerBlocks = row.blocks ?? [];

          return (
            <div
              key={key}
              className={`grid ${COL_CLASSES[cols]} ${GAP_CLASSES[gap]} container mx-auto px-4 py-12`}
            >
              {innerBlocks.map((b, j) =>
                renderBlock(b, `row-${i}-block-${j}-${b.__component}`, true)
              )}
            </div>
          );
        }

        return renderBlock(block, key);
      })}
    </div>
  );
}
