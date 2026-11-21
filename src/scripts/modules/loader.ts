import { gsap, reduce, getLenis } from '../motion';

export function runLoader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-loader]');
  let seen = false;
  try { seen = sessionStorage.getItem('mn-loaded') === '1'; } catch {}

  if (!el || reduce || seen) {
    el?.remove();
    return Promise.resolve();
  }

  const lenis = getLenis();
  lenis?.stop();
  const count = el.querySelector<HTMLElement>('[data-loader-count]')!;
  const bar = el.querySelector<HTMLElement>('[data-loader-bar]')!;
  const status = el.querySelector<HTMLElement>('[data-loader-status]')!;
  const msgs = ['Cargando planos', 'Revisando cotas', 'Esperando firma del promotor', 'Licencia aprobada'];

  return new Promise((resolve) => {
    const o = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.setItem('mn-loaded', '1'); } catch {}
        lenis?.start();
        el.remove();
        resolve();
      },
    });
    tl.to(o, {
      v: 100, duration: 2.1, ease: 'power2.inOut',
      onUpdate: () => {
        count.textContent = String(Math.round(o.v)).padStart(3, '0');
        bar.style.transform = `scaleX(${o.v / 100})`;
        status.textContent = msgs[Math.min(msgs.length - 1, Math.floor(o.v / 26))];
      },
    })
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=0.15');
    // arranca la animación del hero un poco antes de que acabe la cortina
    tl.call(() => resolve(), [], '-=0.55');
  });
}
