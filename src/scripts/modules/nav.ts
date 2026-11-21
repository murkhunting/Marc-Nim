import { gsap, ScrollTrigger, getLenis, reduce } from '../motion';

export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]')!;
  const links = [...nav.querySelectorAll<HTMLElement>('[data-nav-link]')];
  const menu = document.querySelector<HTMLElement>('[data-menu]')!;
  const toggle = nav.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const label = toggle.querySelector<HTMLElement>('[data-open-label]')!;
  const menuLinks = [...menu.querySelectorAll<HTMLElement>('.menu__link')];

  // El texto de cada cara se ajusta al ancho disponible, centrado
  const fits = [...nav.querySelectorAll<HTMLElement>('[data-fit]')];
  if (fits.length) {
    const run = () => fits.forEach((fit) => {
      const box = fit.parentElement!;
      const max = Number(fit.dataset.max || 24);
      fit.style.fontSize = '20px';
      const w = fit.offsetWidth || fit.scrollWidth;
      const size = ((box.clientWidth * 0.78) / w) * 20;
      fit.style.fontSize = `${Math.max(8, Math.min(max, size)).toFixed(2)}px`;
    });
    document.fonts.ready.then(run);
    new ResizeObserver(run).observe(fits[0].parentElement!);
  }

  // Sección activa
  document.querySelectorAll<HTMLElement>('section[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        links.forEach((l) => l.classList.toggle('is-active', l.dataset.navLink === sec.id));
      },
    });
  });

  // Menú overlay
  let open = false;
  const tl = gsap.timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: reduce ? 0 : 0.8, ease: 'expo.inOut' })
    .fromTo(menu.querySelectorAll('.menu__label, .menu__num'), { yPercent: 110, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: reduce ? 0 : 0.7, ease: 'expo.out', stagger: 0.035 }, '-=0.35')
    .fromTo(menu.querySelector('.menu__foot'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');

  const set = (v: boolean) => {
    open = v;
    toggle.setAttribute('aria-expanded', String(v));
    menu.setAttribute('aria-hidden', String(!v));
    menu.classList.toggle('is-open', v);
    nav.classList.toggle('menu-open', v);
    label.textContent = v ? 'Cerrar' : 'Menú';
    menuLinks.forEach((a) => (a.tabIndex = v ? 0 : -1));
    const lenis = getLenis();
    if (v) { tl.timeScale(1).play(); lenis?.stop(); document.body.style.overflow = 'hidden'; }
    else { tl.timeScale(1.6).reverse(); lenis?.start(); document.body.style.overflow = ''; }
  };
  toggle.addEventListener('click', () => set(!open));
  document.addEventListener('menu:close', () => open && set(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { set(false); toggle.focus(); } });
  window.matchMedia('(min-width: 1180px)').addEventListener('change', (e) => { if (e.matches && open) set(false); });
}
