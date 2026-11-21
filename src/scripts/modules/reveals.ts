import { gsap, ScrollTrigger, SplitText, reduce } from '../motion';

export function initReveals() {
  if (reduce) return;

  // Bloques genéricos
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true,
        onStart() { els.forEach((e) => e.classList.add('is-in')); },
        onComplete() { gsap.set(els, { clearProps: 'opacity,transform' }); },
      }),
  });

  // Títulos por líneas con máscara
  document.fonts.ready.then(() => {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
      // Margen de sobra en la máscara para que no recorte acentos ni letras que bajan (J, Ñ, Ó…)
      (split.masks as HTMLElement[]).forEach((m) => { m.style.paddingBlock = '.22em'; m.style.marginBlock = '-.22em'; });
      gsap.from(split.lines, {
        yPercent: 140,
        rotate: 2,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        // Al terminar se quita la máscara: así nunca recorta acentos ni letras que bajan (J, Ñ, Ó…)
        onComplete: () => split.revert(),
      });
    });
    ScrollTrigger.refresh();
  });

  // Línea de cabecera de lámina que se "dibuja"
  document.querySelectorAll<HTMLElement>('[data-sheet-meta]').forEach((el) => {
    gsap.fromTo(el, { '--draw': 0 }, {
      '--draw': 1, duration: 1.4, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
    gsap.from(el.children, {
      opacity: 0, y: 8, duration: 0.6, stagger: 0.1, delay: 0.2,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

export function heroIntro() {
  const sheet = document.querySelector<HTMLElement>('.hero__sheet');
  if (!sheet) return;
  gsap.set(sheet, { visibility: 'visible' });
  if (reduce) return;

  const cells = sheet.querySelectorAll<HTMLElement>('[data-cell]');
  const names = sheet.querySelector<HTMLElement>('[data-hero-names]')!;
  const photo = sheet.querySelector<HTMLElement>('[data-hero-photo]')!;
  const split = SplitText.create(names, { type: 'chars' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(sheet, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' })
    .from(cells, { opacity: 0, duration: 0.8, stagger: 0.06 }, '-=0.7')
    .from(split.chars, { yPercent: 80, rotate: () => gsap.utils.random(-14, 14), opacity: 0, duration: 1, stagger: 0.035 }, '-=0.6')
    .fromTo(photo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, '<-0.3')
    .from(photo.querySelector('img'), { scale: 1.25, duration: 1.8 }, '<');

  // Parallax de la foto al hacer scroll
  gsap.to(photo.querySelector('img'), {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}
