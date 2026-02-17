/**
 * Renders page blocks from Strapi dynamic zone.
 */

import { DynamicBlock } from './DynamicBlock';
import { AboutBlock } from './AboutBlock';
import { RichText } from '../RichText';
import { getStrapiImageUrl } from '../../lib/strapi';
import { AccordionBlock } from './AccordionBlock';
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
} from '../../types/strapi';

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
