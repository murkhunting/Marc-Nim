import { gsap, ScrollTrigger, reduce, isFine } from '../motion';

export function initSections() {
  marquees();
  if (reduce) return;
  story();
  location();
  itinerary();
  extras();
}

function marquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((track, i) => {
    if (reduce) return;
    const dir = i % 2 ? 1 : -1;
    const tween = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
    let boost = { v: 1 };
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
        gsap.to(boost, { v: 1 + Math.abs(v), duration: 0.2, overwrite: true, onUpdate: () => tween.timeScale(boost.v) });
        gsap.to(boost, { v: 1, duration: 1.2, delay: 0.2, ease: 'power2.out', onUpdate: () => tween.timeScale(boost.v) });
      },
    });
  });
}

const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;

function story() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const pin = document.querySelector<HTMLElement>('[data-story-pin]');
    const track = document.querySelector<HTMLElement>('[data-story-track]');
    const bar = document.querySelector<HTMLElement>('[data-story-progress]');
    if (!pin || !track) return;
    const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: () => `top ${navH()}px`, // el ancla se produce justo bajo el header
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => bar && (bar.style.transform = `scaleX(${self.progress})`),
      },
    });
  });
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray<HTMLElement>('[data-story-card]').forEach((card) => {
      gsap.from(card, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });
  });
}

function location() {
  gsap.from('.loc__island-map', {
    opacity: 0, scale: 0.85, rotate: -6, duration: 1.4, ease: 'expo.out',
    scrollTrigger: { trigger: '.loc__split', start: 'top 80%', once: true },
  });
}

function itinerary() {
  const sec = document.querySelector<HTMLElement>('[data-iti]');
  if (!sec) return;
  const body = sec.querySelector<HTMLElement>('.iti__body')!;
  const skyEl = sec.querySelector<HTMLElement>('[data-iti-sky]')!;
  const rail = sec.querySelector<HTMLElement>('.iti__rail')!;
  const fill = sec.querySelector<HTMLElement>('[data-iti-fill]')!;
  const orb = sec.querySelector<HTMLElement>('[data-iti-orb]')!;
  const sun = orb.querySelector('.iti__sun');
  const moon = orb.querySelector('.iti__moon');
  const stars = sec.querySelector<HTMLElement>('[data-iti-stars]');

  // Del cielo azul al naranja del atardecer y a la noche (solo el bloque del planning)
  const sky = gsap.timeline({
    scrollTrigger: {
      trigger: body, start: 'top 38%', end: 'bottom 55%', scrub: true,
      onUpdate: (s) => sec.classList.toggle('is-night', s.progress > 0.55),
    },
  });
  sky
    .to(skyEl, { '--bg': '#ea7f2b', '--fg': '#ffffff', '--muted': 'rgba(255,255,255,.88)', '--ln': 'rgba(255,255,255,.4)', ease: 'none', duration: 1 })
    .to(skyEl, { '--bg': '#b8573a', '--fg': '#f6ede0', '--muted': 'rgba(246,237,224,.75)', '--ln': 'rgba(246,237,224,.3)', ease: 'none', duration: 1 })
    .to(skyEl, { '--bg': '#121417', '--fg': '#ebebed', '--muted': 'rgba(235,235,237,.62)', '--ln': 'rgba(235,235,237,.22)', ease: 'none', duration: 1.2 })
    .to(stars, { opacity: 1, ease: 'none', duration: 0.8 }, '<0.4');

  gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top 55%', end: 'bottom 55%', scrub: true } });
  gsap.fromTo(orb, { y: 0 }, {
    y: () => rail.offsetHeight - orb.offsetHeight, ease: 'none',
    scrollTrigger: {
      trigger: body, start: 'top 55%', end: 'bottom 55%', scrub: true, invalidateOnRefresh: true,
      onUpdate: (s) => {
        const p = gsap.utils.clamp(0, 1, (s.progress - 0.5) / 0.2);
        gsap.set(sun, { opacity: 1 - p, rotate: s.progress * 360, transformOrigin: '50% 50%' });
        gsap.set(moon, { opacity: p });
      },
    },
  });

  sec.querySelectorAll<HTMLElement>('[data-iti-item]').forEach((item) => {
    const st = { trigger: item, start: 'top 80%', once: true };
    gsap.from(item.querySelector('.iti__hour'), { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: st });
    gsap.from(item.querySelectorAll('.iti__head, .iti__text'), { opacity: 0, x: 30, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: st });
    gsap.from(item.querySelector('.iti__bar'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut', delay: 0.2, scrollTrigger: st });
  });
}

function extras() {
  // Huella "aprobado" en las fichas de vestuario al llegar a ellas en móvil
  if (!isFine) {
    document.querySelectorAll<HTMLElement>('.fig').forEach((f) => {
      ScrollTrigger.create({ trigger: f, start: 'top 60%', once: true, onEnter: () => setTimeout(() => f.classList.add('is-stamped'), 400) });
    });
  }

  // Número gigante del pie
  const big = document.querySelector<HTMLElement>('[data-foot-big]');
  if (big) {
    // Aparición suave (con tiempo, no atada al scroll) la primera vez que entra en pantalla
    gsap.fromTo(big.firstElementChild ?? big, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: big, start: 'top 98%', once: true } });
  }

  // Orión del pie asomándose
  const cat = document.querySelector<HTMLElement>('.foot__cat');
  if (cat) gsap.from(cat, { yPercent: 100, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: cat, start: 'top 95%', once: true } });
}
