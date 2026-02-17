/**
 * Registry of Tailgrids components from ./components.
 * Type = base name (e.g. Hero, Cta). Variation = number suffix (Hero2 = variation 2).
 * Block list: About, Accordion, Alerts, Avatar, Badge, Badges, Blog, BlogDetails, Brand,
 * Breadcrumb, Button, ButtonGroup, Buttons, Calendar, Card, Chart, ChatBox, ChatList,
 * Checkboxes, Checkout, Contact, Cookies, Cta, CustomerReview, DashboardDropdown, DataStats,
 * Drawer, Dropdown, ECommerceFooter, ECommerceHero, ECommerceNavbar, Error, Faq,
 * FeaturedProduct, Filter, Footer, FormElement, Forms, Hero, HorizontalMenu, List, Map,
 * Modal, Navbar, Newsletter, Notification, OrderSummary, PageTitles, Pagination, Popover,
 * Portfolio, Pricing, ProductCarousel, ProductDetails, ProductGrid, Profile, Progress,
 * PromoBanner, QuickView, RecentProduct, SelectBox, Service, SettingsPage, ShoppingCart,
 * Signin, Stats, Step, Switch, Switcher, Tab, Table, TableGrid, TableStack, Team,
 * Testimonial, Tooltip, VerticalNavbar, Video, Wishlist
 */

import type { ComponentType } from 'react';

const componentModules = import.meta.glob<{ default: ComponentType }>(
  '../../../components/{About,Accordion,Alerts,Avatar,Badge,Badges,Blog,BlogDetails,Brand,Breadcrumb,Button,ButtonGroup,Buttons,Calendar,Card,Chart,ChatBox,ChatList,Checkboxes,Checkout,Contact,Cookies,Cta,CustomerReview,DashboardDropdown,DataStats,Drawer,Dropdown,ECommerceFooter,ECommerceHero,ECommerceNavbar,Error,Faq,FeaturedProduct,Filter,Footer,FormElement,Forms,Hero,HorizontalMenu,List,Map,Modal,Navbar,Newsletter,Notification,OrderSummary,PageTitles,Pagination,Popover,Portfolio,Pricing,ProductCarousel,ProductDetails,ProductGrid,Profile,Progress,PromoBanner,QuickView,RecentProduct,SelectBox,Service,SettingsPage,ShoppingCart,Signin,Stats,Step,Switch,Switcher,Tab,Table,TableGrid,TableStack,Team,Testimonial,Tooltip,VerticalNavbar,Video,Wishlist}*/index.jsx'
);

function parseComponentKey(path: string): { type: string; variation: number } {
  const match = path.match(/components\/([^/]+)\/index\.jsx$/);
  const name = match ? match[1] : '';
  const numMatch = name.match(/^([A-Za-z]+)(\d*)$/);
  const base = numMatch ? numMatch[1] : name;
  const variationStr = numMatch ? numMatch[2] : '';
  const variation = variationStr ? parseInt(variationStr, 10) : 1;
  return { type: base, variation };
}

const registry = new Map<string, () => Promise<{ default: ComponentType }>>();

for (const [path, importFn] of Object.entries(componentModules)) {
  const { type, variation } = parseComponentKey(path);
  registry.set(`${type}:${variation}`, importFn as () => Promise<{ default: ComponentType }>);
}

/** Get component by type and variation. Variation defaults to 1. */
export async function getComponent(
  type: string,
  variation: number = 1
): Promise<ComponentType | null> {
  const key = `${type}:${variation}`;
  const importFn = registry.get(key);
  if (!importFn) return null;
  const mod = await importFn();
  return mod?.default ?? null;
}

export function hasComponent(type: string, variation: number = 1): boolean {
  return registry.has(`${type}:${variation}`);
}

/** List all available { type, variation } pairs. */
export function getComponentTypes(): Array<{ type: string; variation: number }> {
  const seen = new Set<string>();
  return Array.from(registry.keys())
    .map((k) => {
      const [type, v] = k.split(':');
      return { type, variation: parseInt(v, 10) };
    })
    .filter(({ type, variation }) => {
      const key = `${type}:${variation}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) =>
      a.type === b.type ? a.variation - b.variation : a.type.localeCompare(b.type)
    );
}
