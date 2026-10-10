// Sungrid homepage hero slideshow
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  effect: 'fade',
  speed: 1000,
  autoplay: { delay: 5000, disableOnInteraction: false },
  fadeEffect: { crossFade: true },
  pagination: { el: '#section-intro .swiper-pagination', clickable: true }
});
