'use client';
import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './InfoBarBlock.css';
import type { StrapiBlockInfoBar } from '../../types/strapi';

export function InfoBarBlock({ text, floatingText, ctaText, ctaUrl }: StrapiBlockInfoBar) {
  const barRef = useRef<HTMLDivElement>(null);
  
  // Track visibility of both the static bar and the page footer
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const label = ctaText || 'GET TICKETS';
  const floatLabel = floatingText || text;

  useEffect(() => {
    const barEl = barRef.current;
    // Find the footer element in the DOM. 
    // Update this selector if your footer uses a specific ID or class (e.g., '#site-footer')
    const footerEl = document.querySelector('footer');

    // Observer for the main InfoBar
    const barObserver = new IntersectionObserver(
      ([entry]) => setIsBarVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    // Observer for the Footer
    const footerObserver = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0 } 
    );

    if (barEl) barObserver.observe(barEl);
    if (footerEl) footerObserver.observe(footerEl);

    return () => {
      barObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  // Float is active if the main bar is out of view AND the footer is not yet in view
  const floating = !isBarVisible && !isFooterVisible;

  return (
    <>
      <div ref={barRef} className="info-bar" aria-label={text}>
        <div className="info-bar__inner">
          <p className="info-bar__text">{text}</p>
          {ctaUrl && (
            <a href={ctaUrl} className="info-bar__cta">
              {label}
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {floating && (
          <motion.div
            className="info-bar-float"
            role="complementary"
            aria-label={floatLabel}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="info-bar-float__text">{floatLabel}</p>
            {ctaUrl && (
              <a href={ctaUrl} className="info-bar-float__cta">
                {label}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}