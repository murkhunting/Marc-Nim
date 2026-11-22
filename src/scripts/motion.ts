import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
// en móvil, la barra del navegador que aparece y desaparece no debe recalcular todos los disparadores
ScrollTrigger.config({ ignoreMobileResize: true });

export const reduce =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFine =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

export function getLenis() {
  if (lenis || reduce) return lenis;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const l = getLenis();
  // Las secciones "flush" llevan un hueco de la altura del header: se paran justo en el borde superior
  const offset = id === 'inicio' || el.hasAttribute('data-flush') ? 0 : -60;
  if (l) l.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/** Anima títulos por líneas con máscara. */
export function splitLines(el: HTMLElement, opts: gsap.TweenVars = {}) {
  if (reduce) return;
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'sl', maskClass: 'sl-mask' });
  return gsap.from(split.lines, {
    yPercent: 140,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.08,
    ...opts,
  });
}

export { gsap, ScrollTrigger, SplitText };
