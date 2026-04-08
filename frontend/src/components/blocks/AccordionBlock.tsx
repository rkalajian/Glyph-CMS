'use client';

/**
 * Accordion block with 5 layout variations.
 * Renders customizable FAQ/accordion content from Strapi.
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface AccordionItemProps {
  header: string;
  text?: string;
  text2?: string;
  listItems?: Array<{ text: string }>;
}

export interface AccordionBlockProps {
  variation?: number;
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: AccordionItemProps[];
}

const DEFAULTS = {
  badge: 'FAQ',
  title: 'Frequently Asked Questions',
  subtitle: 'There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.',
  defaultItem: {
    header: 'How long we deliver your first blog post?',
    text: 'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post.',
  },
};

const ChevronIcon = ({ active }: { active: boolean }) => (
  <motion.svg
    className="fill-primary stroke-primary"
    width="17"
    height="10"
    viewBox="0 0 17 10"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: active ? 180 : 0 }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
  >
    <path d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z" fill="" stroke="" />
  </motion.svg>
);

const QuestionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 34 34" className="fill-current">
    <path d="M17.0008 0.690674C7.96953 0.690674 0.691406 7.9688 0.691406 17C0.691406 26.0313 7.96953 33.3625 17.0008 33.3625C26.032 33.3625 33.3633 26.0313 33.3633 17C33.3633 7.9688 26.032 0.690674 17.0008 0.690674ZM17.0008 31.5032C9.03203 31.5032 2.55078 24.9688 2.55078 17C2.55078 9.0313 9.03203 2.55005 17.0008 2.55005C24.9695 2.55005 31.5039 9.0313 31.5039 17C31.5039 24.9688 24.9695 31.5032 17.0008 31.5032Z" />
    <path d="M17.9039 6.32194C16.3633 6.05631 14.8227 6.48131 13.707 7.43756C12.5383 8.39381 11.8477 9.82819 11.8477 11.3688C11.8477 11.9532 11.9539 12.5376 12.1664 13.0688C12.3258 13.5469 12.857 13.8126 13.3352 13.6532C13.8133 13.4938 14.0789 12.9626 13.9195 12.4844C13.8133 12.1126 13.707 11.7938 13.707 11.3688C13.707 10.4126 14.132 9.50944 14.8758 8.87194C15.6195 8.23444 16.5758 7.96881 17.5852 8.18131C18.9133 8.39381 19.9758 9.50944 20.1883 10.7844C20.4539 12.3251 19.657 13.8126 18.2227 14.3969C16.8945 14.9282 16.0445 16.2563 16.0445 17.7969V21.1969C16.0445 21.7282 16.4695 22.1532 17.0008 22.1532C17.532 22.1532 17.957 21.7282 17.957 21.1969V17.7969C17.957 17.0532 18.382 16.3626 18.9664 16.1501C21.1977 15.2469 22.4727 12.9094 22.0477 10.4657C21.6758 8.39381 19.9758 6.69381 17.9039 6.32194Z" />
    <path d="M17.0531 24.8625H16.8937C16.3625 24.8625 15.9375 25.2875 15.9375 25.8188C15.9375 26.35 16.3625 26.7751 16.8937 26.7751H17.0531C17.5844 26.7751 18.0094 26.35 18.0094 25.8188C18.0094 25.2875 17.5844 24.8625 17.0531 24.8625Z" />
  </svg>
);

function AccordionItemV1({ item, defaultText }: { item: AccordionItemProps; defaultText: string }) {
  const [active, setActive] = useState(false);
  const text = item.text ?? defaultText;
  return (
    <div className="mb-8 w-full rounded-lg bg-white p-4 shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] dark:bg-dark-2 dark:shadow-[0px_20px_95px_0px_rgba(0,0,0,0.30)] sm:p-8 lg:px-6 xl:px-8">
      <button className="faq-btn flex w-full text-left" onClick={() => setActive(!active)}>
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-white/5">
          <ChevronIcon active={active} />
        </div>
        <div className="w-full">
          <h4 className="mt-1 text-lg font-semibold text-dark dark:text-white">{item.header}</h4>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            className="pl-[62px] overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <p className="py-3 text-base leading-relaxed text-body-color dark:text-dark-6">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionItemV2({ item, defaultText }: { item: AccordionItemProps; defaultText: string }) {
  const [active, setActive] = useState(false);
  const text = item.text ?? defaultText;
  return (
    <div className="mb-10 rounded-lg bg-white px-7 py-6 shadow-[0px_4px_18px_0px_rgba(0,0,0,0.07)] dark:bg-dark-2 md:px-10 md:py-8">
      <button className="faq-btn flex w-full items-center justify-between text-left" onClick={() => setActive(!active)}>
        <h4 className="mr-2 text-base font-semibold text-dark dark:text-white sm:text-lg md:text-xl lg:text-2xl">
          {item.header}
        </h4>
        <span className="icon inline-flex h-8 w-full max-w-[32px] items-center justify-center rounded-full border-2 border-primary text-lg font-semibold text-primary">
          {active ? '-' : '+'}
        </span>
      </button>
      <div className={active ? 'block' : 'hidden'}>
        <p className="text-relaxed pt-6 text-base text-body-color dark:text-dark-6">{text}</p>
      </div>
    </div>
  );
}

function AccordionItemV3({ item, defaultText }: { item: AccordionItemProps; defaultText: string }) {
  const text = item.text ?? defaultText;
  return (
    <div className="w-full px-4 lg:w-1/2">
      <div className="mb-12 flex lg:mb-[70px]">
        <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
          <QuestionIcon />
        </div>
        <div className="w-full">
          <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            {item.header}
          </h3>
          <p className="text-base leading-relaxed text-body-color dark:text-dark-6">{text}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  tabNumber,
  children,
  openTab,
  setOpenTab,
}: {
  tabNumber: string;
  children: React.ReactNode;
  openTab: string;
  setOpenTab: (s: string) => void;
}) {
  const isActive = openTab === tabNumber;
  return (
    <button
      type="button"
      onClick={() => setOpenTab(tabNumber)}
      className={`block w-full border-l-4 px-7 py-6 text-left text-base font-medium md:px-10 lg:px-7 xl:px-10 ${
        isActive
          ? 'border-primary bg-primary/[.13] text-dark dark:bg-dark-2 dark:text-white'
          : 'border-transparent text-body-color hover:border-primary hover:text-dark dark:text-dark-6 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function AccordionItemV4({
  item,
  tabNumber,
  openTab,
  defaultText,
}: {
  item: AccordionItemProps;
  tabNumber: string;
  openTab: string;
  defaultText: string;
}) {
  const text = item.text ?? defaultText;
  const text2 = item.text2;
  const listItems = item.listItems ?? [];
  const isActive = openTab === tabNumber;

  return (
    <div className={isActive ? 'block' : 'hidden'}>
      <h2 className="mb-6 text-3xl font-semibold text-dark dark:text-white">{item.header}</h2>
      <p className="mb-8 text-base leading-relaxed text-body-color dark:text-dark-6">{text}</p>
      {text2 && (
        <p className="mb-8 text-base leading-relaxed text-body-color dark:text-dark-6">{text2}</p>
      )}
      {listItems.length > 0 && (
        <div>
          {listItems.map((li, i) => (
            <div key={i} className="mb-4 flex">
              <span className="mr-5 flex h-[30px] w-full max-w-[30px] items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="text-base leading-relaxed text-body-color dark:text-dark-6">{li.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccordionItemV5({ item, defaultText }: { item: AccordionItemProps; defaultText: string }) {
  const text = item.text ?? defaultText;
  return (
    <div className="w-full px-4 lg:w-1/2">
      <div className="relative mb-10 overflow-hidden rounded-lg border border-[#F3F4FE] p-6 dark:border-dark-3/50 sm:px-10 sm:py-11 lg:px-8 2xl:px-14">
        <h4 className="mb-6 text-lg font-semibold text-dark dark:text-white sm:text-xl lg:text-lg xl:text-xl">
          {item.header}
        </h4>
        <p className="text-base leading-relaxed text-body-color dark:text-dark-6">{text}</p>
        <span className="absolute left-0 top-0 z-[-1]">
          <svg width="155" height="245" viewBox="0 0 155 245" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="17.5" cy="124.5" rx="137.5" ry="139.5" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="17.5" y1="-15" x2="17.5" y2="264" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3056D3" stopOpacity="0.09" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute bottom-2 right-2 z-[-1]">
          <DotShape />
        </span>
      </div>
    </div>
  );
}

function DotShape() {
  return (
    <svg width="23" height="44" viewBox="0 0 23 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[42.7256, 32.4089, 22.0923, 11.7754, 1.45875].map((cy, row) =>
        [21.8062, 11.4898, 1.1714].map((cx, col) => (
          <circle
            key={`${row}-${col}`}
            cx={cx}
            cy={cy}
            r="1.17235"
            transform={`rotate(180 ${cx} ${cy})`}
            fill="#3056D3"
          />
        ))
      )}
    </svg>
  );
}

const DotShapeV3 = () => (
  <svg width="48" height="134" viewBox="0 0 48 134" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[45.6673, 31.0013, 16.3333, 1.66732].map((cx, i) =>
      [132, 117.333, 102.667, 88.0001, 73.3335, 45.0001, 16.0001, 59.0001, 30.6668, 1.66683].map((cy, j) => (
        <circle key={`${i}-${j}`} cx={cx} cy={cy} r="1.66667" transform={`rotate(180 ${cx} ${cy})`} fill="#13C296" />
      ))
    )}
  </svg>
);

export function AccordionBlock({
  variation = 1,
  badge,
  title,
  subtitle,
  items = [],
}: AccordionBlockProps) {
  const badgeVal = badge ?? DEFAULTS.badge;
  const titleVal = title ?? DEFAULTS.title;
  const subtitleVal = subtitle ?? DEFAULTS.subtitle;
  const defaultText = DEFAULTS.defaultItem.text;

  const displayItems =
    items.length > 0 ? items : [DEFAULTS.defaultItem, { ...DEFAULTS.defaultItem, header: 'Do you provide support?' }];

  // Variation 1: 2-column collapsible, badge+title+subtitle
  if (variation === 1) {
    const half = Math.ceil(displayItems.length / 2);
    const left = displayItems.slice(0, half);
    const right = displayItems.slice(half);
    return (
      <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
                <span className="mb-2 block text-lg font-semibold text-primary">{badgeVal}</span>
                <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">{titleVal}</h2>
                <p className="text-base text-body-color dark:text-dark-6">{subtitleVal}</p>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-1/2">
              {left.map((item, i) => (
                <AccordionItemV1 key={i} item={item} defaultText={defaultText} />
              ))}
            </div>
            <div className="w-full px-4 lg:w-1/2">
              {right.map((item, i) => (
                <AccordionItemV1 key={i} item={item} defaultText={defaultText} />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 z-[-1]">
          <svg width="1440" height="886" viewBox="0 0 1440 886" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.5"
              d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient id="paint0_linear" x1="1308.65" y1="1142.58" x2="602.827" y2="-418.681" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3056D3" stopOpacity="0.36" />
                <stop offset="1" stopColor="#F5F2FD" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    );
  }

  // Variation 2: centered single column, collapsible +/-
  if (variation === 2) {
    return (
      <section className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                <span className="mb-2 block text-lg font-semibold text-primary">{badgeVal}</span>
                <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">{titleVal}</h2>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 xl:w-10/12">
              {displayItems.map((item, i) => (
                <AccordionItemV2 key={i} item={item} defaultText={defaultText} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variation 3: 2-column always expanded with icon
  if (variation === 3) {
    return (
      <section className="relative z-20 overflow-hidden bg-white pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                <span className="mb-2 block text-lg font-semibold text-primary">{badgeVal}</span>
                <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">{titleVal}</h2>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            {displayItems.map((item, i) => (
              <AccordionItemV3 key={i} item={item} defaultText={defaultText} />
            ))}
          </div>
        </div>
        <span className="absolute left-4 top-4 z-[-1]">
          <DotShapeV3 />
        </span>
        <span className="absolute bottom-4 right-4 z-[-1]">
          <DotShapeV3 />
        </span>
      </section>
    );
  }

  // Variation 4: Tabbed layout - sidebar + content
  if (variation === 4) {
    return (
      <AccordionVariation4
        displayItems={displayItems}
        defaultText={defaultText}
      />
    );
  }

  // Variation 5: 2-column cards, always expanded
  return (
    <section className="relative z-20 overflow-hidden bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">{badgeVal}</span>
              <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-[40px]">{titleVal}</h2>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {displayItems.map((item, i) => (
            <AccordionItemV5 key={i} item={item} defaultText={defaultText} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionVariation4({
  displayItems,
  defaultText,
}: {
  displayItems: AccordionItemProps[];
  defaultText: string;
}) {
  const [openTab, setOpenTab] = useState('1');
  return (
    <section className="relative z-20 overflow-hidden bg-white py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-4/12">
            <div className="mb-10 overflow-hidden rounded bg-[#F3F6FF] dark:bg-dark-3 lg:mb-0">
              {displayItems.map((item, i) => (
                <TabButton key={i} tabNumber={String(i + 1)} openTab={openTab} setOpenTab={setOpenTab}>
                  {item.header}
                </TabButton>
              ))}
            </div>
          </div>
          <div className="w-full px-4 lg:w-8/12 xl:w-7/12">
            <div className="lg:pl-8 2xl:pl-[60px]">
              {displayItems.map((item, i) => (
                <AccordionItemV4
                  key={i}
                  item={item}
                  tabNumber={String(i + 1)}
                  openTab={openTab}
                  defaultText={defaultText}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
