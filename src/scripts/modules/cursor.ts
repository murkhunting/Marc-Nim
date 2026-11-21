import { gsap } from '../motion';

export function initCursor() {
  const el = document.querySelector<HTMLElement>('[data-cursor-el]');
  const cross = document.querySelector<HTMLElement>('[data-cursor-cross]');
  if (!el || !cross) return;
  document.documentElement.classList.add('has-cursor');

  const label = el.querySelector<HTMLElement>('[data-cursor-label]')!;
  const xy = el.querySelector<HTMLElement>('[data-cursor-xy]')!;
  const h = cross.querySelector<HTMLElement>('.h')!;
  const v = cross.querySelector<HTMLElement>('.v')!;

  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  const hTo = gsap.quickTo(h, 'y', { duration: 0.6, ease: 'power3' });
  const vTo = gsap.quickTo(v, 'x', { duration: 0.6, ease: 'power3' });
  gsap.set(el, { x: -100, y: -100 });

  const pad = (n: number) => String(Math.round(n)).padStart(4, '0');

  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY); hTo(e.clientY); vTo(e.clientX);
    xy.textContent = `X ${pad(e.clientX)} · Y ${pad(e.clientY + window.scrollY)}`;
  }, { passive: true });

  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => gsap.to(el, { opacity: 1, duration: 0.2 }));

  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    const withText = t.closest<HTMLElement>('[data-cursor-text]');
    const interactive = t.closest('a, button, label, input, textarea, select, [data-cursor="paw"]');
    el.classList.toggle('is-label', !!withText);
    if (withText) label.textContent = withText.dataset.cursorText!;
    el.classList.toggle('is-hover', !withText && !!interactive);
    el.classList.toggle('is-dark', !!t.closest('.iti.is-night .iti__sky, .rsvp, .menu.is-open, .weather, .marquee--dark'));
  });
}
