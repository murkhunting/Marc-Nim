import { gsap, reduce } from '../motion';

const REPLAYS = [
  '¿Otra vez? Ya estaba aprobado.',
  'Sello nuevo. Esto es burocracia, y me encanta.',
  'Aprobado, aprobado, aprobado.',
];

/** Pulsar la foto del hero: el sello de Orión entra desde el lateral. */
export function initHeroApprove() {
  const cell = document.querySelector<HTMLElement>('[data-approve]');
  const stamp = document.querySelector<HTMLElement>('[data-hero-stamp]');
  const sheet = document.querySelector<HTMLElement>('.hero__sheet');
  if (!cell || !stamp || !sheet) return;

  let approved = false;
  let n = 0;

  const say = (msg: string) => document.dispatchEvent(new CustomEvent('peek:say', { detail: msg }));

  const slamIn = () => {
    if (reduce) return;
    gsap.timeline()
      .fromTo(stamp, { xPercent: 220, rotate: 24, opacity: 1, scale: 1 }, { xPercent: 0, rotate: -8, duration: 0.8, ease: 'expo.out', clearProps: 'xPercent' })
      .fromTo(stamp, { scale: 1.45 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', clearProps: 'scale' }, '-=0.25')
      .to(sheet, { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: 'none', clearProps: 'transform' }, '<');
  };

  const approve = () => {
    if (!approved) {
      approved = true;
      cell.classList.add('is-approved');
      cell.setAttribute('aria-pressed', 'true');
      cell.setAttribute('aria-label', 'Foto aprobada por Orión');
      cell.dataset.cursorText = '¡Aprobado!';
      const label = document.querySelector<HTMLElement>('[data-cursor-label]');
      if (label) label.textContent = '¡Aprobado!';
      slamIn();
      say('¡Aprobado! Firmado con pata y todo.');
    } else {
      // Repetir el sello: sale otra vez desde el lateral
      stamp.style.opacity = '0';
      requestAnimationFrame(() => { stamp.style.opacity = ''; slamIn(); });
      say(REPLAYS[n++ % REPLAYS.length]);
    }
  };

  cell.addEventListener('click', approve);
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); approve(); }
  });
}
