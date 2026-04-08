'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from './NavLink';
import type { StrapiNavItem } from '../types/strapi';

interface MobileMenuProps {
  primaryNav: StrapiNavItem[];
  utilityNav: StrapiNavItem[];
  logo: string;
  siteName: string;
}

export function MobileMenu({ primaryNav, utilityNav, logo, siteName }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Manage body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 -m-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <motion.div
          className="w-6 h-5 flex flex-col justify-between"
          animate={open ? 'open' : 'closed'}
        >
          <motion.span
            className="w-full h-0.5 bg-fg rounded origin-left"
            variants={{
              closed: { rotate: 0 },
              open: { rotate: 45, y: '10px' },
            }}
          />
          <motion.span
            className="w-full h-0.5 bg-fg rounded"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
          />
          <motion.span
            className="w-full h-0.5 bg-fg rounded origin-left"
            variants={{
              closed: { rotate: 0 },
              open: { rotate: -45, y: '-10px' },
            }}
          />
        </motion.div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              key="panel"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-bg border-l border-border z-40 md:hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  {logo && (
                    <img src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
                  )}
                  <span className="font-semibold">{siteName}</span>
                </div>
                <motion.button
                  onClick={() => setOpen(false)}
                  className="p-2 -m-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Close menu"
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Nav Lists */}
              <div className="flex-1 overflow-y-auto py-4">
                {/* Utility Nav */}
                {utilityNav && utilityNav.length > 0 && (
                  <>
                    <nav aria-label="Utility navigation" className="px-4 py-2 border-b border-border">
                      <ul className="space-y-2 list-none m-0 p-0">
                        {utilityNav.map((item: StrapiNavItem) => (
                          <li key={item.documentId}>
                            <NavLink item={item} />
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </>
                )}

                {/* Primary Nav */}
                {primaryNav && primaryNav.length > 0 && (
                  <nav aria-label="Main navigation" className="px-4 py-2">
                    <ul className="space-y-2 list-none m-0 p-0">
                      {primaryNav.map((item: StrapiNavItem) => (
                        <li key={item.documentId}>
                          <NavLink item={item} />
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
