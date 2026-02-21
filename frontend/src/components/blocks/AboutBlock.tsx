/**
 * Customizable About block with 8 layout variations.
 * Renders content from Strapi with sensible defaults.
 */

export interface AboutBlockProps {
  variation?: number;
  title?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string | null;
  images?: string[];
  items?: Array<{ title: string; description?: string; iconUrl?: string }>;
  listItems?: Array<{ text: string }>;
  statsNumber?: string;
  statsLabel?: string;
  statsSublabel?: string;
}

const DEFAULTS = {
  title: 'Make your customers happy by giving services.',
  badge: 'Why Choose Us',
  description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
  subtitle: 'Marketing solutions',
  buttonText: 'Learn More',
  buttonUrl: '/#',
  statsNumber: '09',
  statsLabel: 'We have',
  statsSublabel: 'Years of experience',
  defaultImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
  defaultImages: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
  ],
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden bg-white dark:bg-dark pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] ${className}`}>
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-center">
          {children}
        </div>
      </div>
    </section>
  );
}

function ContentBlock({ badge, title, description, subtitle, listItems, buttonText, buttonUrl }: Partial<AboutBlockProps>) {
  const desc = description ?? DEFAULTS.description;
  const list = listItems && listItems.length > 0 ? listItems : [
    { text: 'Consectetur adipiscing elit in voluptate velit.' },
    { text: 'Mattis vulputate cupidatat.' },
  ];
  return (
    <div className="w-full px-4 lg:w-1/2">
      <div className="mb-12 max-w-[540px] lg:mb-0">
        {badge && (
          <span className="block mb-2 text-lg font-semibold text-primary">{badge}</span>
        )}
        {title && (
          <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px]/[48px]">
            {title}
          </h2>
        )}
        {desc && (
          <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
            {desc}
          </p>
        )}
        {subtitle && (
          <h3 className="mb-8 text-2xl font-bold text-dark dark:text-white">{subtitle}</h3>
        )}
        {list.length > 0 && (
          <ul className="pb-6 list-disc list-inside marker:text-primary space-y-4">
            {list.map((item, i) => (
              <li key={i} className="text-base text-body-color dark:text-dark-6">
                {item.text}
              </li>
            ))}
          </ul>
        )}
        {buttonText && (
          <a
            href={buttonUrl || DEFAULTS.buttonUrl}
            className="inline-flex items-center justify-center py-3 px-7 text-base font-medium text-center text-white rounded-md bg-primary hover:bg-opacity-90"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

function ImageBlock({ image, images, variation }: Partial<AboutBlockProps> & { variation: number }) {
  const img = image ?? DEFAULTS.defaultImage;
  const imgs = (images && images.length >= 3) ? images : DEFAULTS.defaultImages;
  return (
    <div className="w-full px-4 lg:w-1/2">
      <div className="flex justify-center">
        {variation === 1 ? (
          <div className="flex flex-wrap -mx-3 sm:-mx-4">
            <div className="w-full px-3 sm:px-4 xl:w-1/2 space-y-4">
              <img src={imgs[0]} alt="" width={600} height={400} loading="lazy" className="w-full rounded-2xl" />
              <img src={imgs[1]} alt="" width={600} height={400} loading="lazy" className="w-full rounded-2xl" />
            </div>
            <div className="w-full px-3 sm:px-4 xl:w-1/2">
              <img src={imgs[2]} alt="" width={600} height={400} loading="lazy" className="w-full rounded-2xl my-4" />
            </div>
          </div>
        ) : (
          <img src={img} alt="" width={600} height={400} loading="lazy" className="w-full max-w-lg rounded-2xl" />
        )}
      </div>
    </div>
  );
}

function StatsBox({ statsNumber, statsLabel, statsSublabel }: Partial<AboutBlockProps>) {
  const num = statsNumber ?? DEFAULTS.statsNumber;
  const label = statsLabel ?? DEFAULTS.statsLabel;
  const sub = statsSublabel ?? DEFAULTS.statsSublabel;
  return (
    <div className="relative z-10 bg-primary flex items-center justify-center overflow-hidden py-12 px-6 rounded-lg">
      <div>
        <span className="block text-5xl font-extrabold text-white">{num}</span>
        <span className="block text-base font-semibold text-white">{label}</span>
        <span className="block text-base font-medium text-white/70">{sub}</span>
      </div>
    </div>
  );
}

function AboutVariation1(props: AboutBlockProps) {
  const { badge, title, description, buttonText, buttonUrl } = props;
  const b = badge ?? DEFAULTS.badge;
  const t = title ?? DEFAULTS.title;
  const d = description ?? DEFAULTS.description;
  return (
    <Section>
      <ImageBlock {...props} variation={1} />
      <ContentBlock badge={b} title={t} description={d} buttonText={buttonText ?? DEFAULTS.buttonText} buttonUrl={buttonUrl} listItems={[]} />
    </Section>
  );
}

function AboutVariation2(props: AboutBlockProps) {
  const { badge, title, description, buttonText, buttonUrl, image } = props;
  return (
    <Section>
      <ContentBlock badge={badge} title={title ?? DEFAULTS.title} description={description} buttonText={buttonText} buttonUrl={buttonUrl} />
      <ImageBlock image={image} variation={2} />
    </Section>
  );
}

function AboutVariation3(props: AboutBlockProps) {
  const { badge, title, items, image } = props;
  const featureItems = items && items.length > 0 ? items : [
    { title: 'Security Maintenance', description: 'The little rotter bevvy I gormless mush golly gosh cras.' },
    { title: 'Backup Database', description: 'The little rotter bevvy I gormless mush golly gosh cras.' },
    { title: 'Server Maintenance', description: 'The little rotter bevvy I gormless mush golly gosh cras.' },
    { title: 'No Risk Protestable', description: 'The little rotter bevvy I gormless mush golly gosh cras.' },
  ];
  return (
    <Section>
      <div className="w-full px-4 lg:w-6/12">
        <div className="mb-10 max-w-[500px]">
          {badge && <span className="block mb-2 text-lg font-semibold text-primary">{badge}</span>}
          {title && <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{title}</h2>}
        </div>
        <div className="flex flex-wrap -mx-4 gap-6">
          {featureItems.map((item, i) => (
            <div key={i} className="w-full px-4 sm:w-1/2">
              <div className="mb-6 flex h-[75px] w-[75px] items-center justify-center rounded-[20px] bg-primary/20 text-primary">
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt="" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-2xl font-bold">{i + 1}</span>
                )}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">{item.title}</h3>
              {item.description && <p className="text-base text-body-color dark:text-dark-6">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-4 lg:w-6/12 flex justify-center mt-10 lg:mt-0">
        <img src={image ?? DEFAULTS.defaultImage} alt="" width={448} height={300} loading="lazy" className="max-w-md w-full" />
      </div>
    </Section>
  );
}

function AboutVariation4(props: AboutBlockProps) {
  const { title, description, subtitle, listItems, buttonText, buttonUrl, statsNumber, statsLabel, statsSublabel } = props;
  const imgs = (props.images && props.images.length >= 2) ? props.images : [props.image ?? DEFAULTS.defaultImage, DEFAULTS.defaultImages[1]];
  return (
    <Section className="pt-[150px] lg:pt-[170px]">
      <ContentBlock
        title={title ?? 'Smart solution for starting your business'}
        description={description}
        subtitle={subtitle ?? DEFAULTS.subtitle}
        listItems={listItems}
        buttonText={buttonText ?? 'Know More'}
        buttonUrl={buttonUrl}
      />
      <div className="w-full px-4 lg:w-1/2">
        <div className="flex flex-wrap -mx-2 gap-4">
          <div className="w-full sm:w-1/2">
            <img src={imgs[0]} alt="" width={600} height={400} loading="lazy" className="w-full h-64 sm:h-[400px] object-cover rounded-lg" />
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <img src={imgs[1]} alt="" width={600} height={288} loading="lazy" className="w-full h-48 object-cover rounded-lg" />
            <StatsBox statsNumber={statsNumber} statsLabel={statsLabel} statsSublabel={statsSublabel} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function AboutVariation5(props: AboutBlockProps) {
  const { badge, title, description, buttonText, buttonUrl, image } = props;
  return (
    <Section>
      <div className="w-full px-4 lg:w-6/12">
        <img src={image ?? DEFAULTS.defaultImage} alt="" width={448} height={300} loading="lazy" className="w-full max-w-md rounded-lg" />
      </div>
      <ContentBlock badge={badge} title={title} description={description} buttonText={buttonText} buttonUrl={buttonUrl} />
    </Section>
  );
}

function AboutVariation6(props: AboutBlockProps) {
  const { badge, description, statsNumber, statsLabel, statsSublabel, buttonText, buttonUrl, image } = props;
  return (
    <Section className="py-20 lg:py-[110px]">
      <div className="w-full px-4 lg:w-1/2">
        <div className="bg-primary rounded-lg p-8 lg:p-12 mb-12 lg:mb-0">
          {badge && <h2 className="mb-6 text-xl font-bold text-white">{badge}</h2>}
          {description && <p className="mb-6 text-base text-white/70">{description}</p>}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl font-extrabold text-white">{statsNumber ?? DEFAULTS.statsNumber}</span>
            <div>
              <span className="block font-semibold text-white">{statsLabel ?? DEFAULTS.statsLabel}</span>
              <span className="font-medium text-white/70">{statsSublabel ?? DEFAULTS.statsSublabel}</span>
            </div>
          </div>
          {buttonText && (
            <a href={buttonUrl || '#'} className="inline-flex items-center text-base font-semibold text-white">
              {buttonText} →
            </a>
          )}
        </div>
      </div>
      <div className="w-full px-4 lg:w-1/2 flex justify-center">
        <img src={image ?? DEFAULTS.defaultImage} alt="" width={512} height={340} loading="lazy" className="w-full max-w-lg rounded-lg" />
      </div>
    </Section>
  );
}

function AboutVariation7(props: AboutBlockProps) {
  const { badge, title, description, image } = props;
  return (
    <Section>
      <ContentBlock badge={badge} title={title} description={description} />
      <div className="w-full px-4 lg:w-1/2 flex justify-center">
        <img src={image ?? DEFAULTS.defaultImage} alt="" width={448} height={300} loading="lazy" className="w-full max-w-md rounded-lg" />
      </div>
    </Section>
  );
}

function AboutVariation8(props: AboutBlockProps) {
  const { title, image } = props;
  return (
    <Section>
      <div className="w-full px-4 lg:w-6/12">
        <div className="max-w-[430px] rounded-tl-[50px] overflow-hidden">
          <img src={image ?? DEFAULTS.defaultImage} alt="" width={600} height={400} loading="lazy" className="w-full" />
        </div>
      </div>
      <div className="w-full px-4 lg:w-6/12">
        <div className="bg-primary rounded-tr-[50px] p-10 text-xl font-bold text-white">
          {title ?? 'We make clean & professional design'}
        </div>
      </div>
    </Section>
  );
}

const VARIATIONS: Record<number, React.ComponentType<AboutBlockProps>> = {
  1: AboutVariation1,
  2: AboutVariation2,
  3: AboutVariation3,
  4: AboutVariation4,
  5: AboutVariation5,
  6: AboutVariation6,
  7: AboutVariation7,
  8: AboutVariation8,
};

export function AboutBlock(props: AboutBlockProps) {
  const variation = Math.min(8, Math.max(1, props.variation ?? 1));
  const Component = VARIATIONS[variation] ?? AboutVariation1;
  return <Component {...props} variation={variation} />;
}
