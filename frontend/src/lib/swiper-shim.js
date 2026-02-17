/**
 * Shim so components using `import { Pagination } from "swiper"` work with Swiper 12.
 * Uses swiper-core alias to avoid circular resolution.
 */
export { Swiper, Swiper as default } from 'swiper-core';
export { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper-core/modules';
