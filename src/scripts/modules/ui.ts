import { gsap, ScrollTrigger, reduce } from '../motion';

export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const ink = root.querySelector<HTMLElement>('[data-tabs-ink]')!;

    const moveInk = (t: HTMLElement) => {
      ink.style.width = `${t.offsetWidth}px`;
      ink.style.transform = `translateX(${t.offsetLeft}px)`;
    };
    const select = (t: HTMLButtonElement, focus = false) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => {
        const on = p.dataset.panel === t.dataset.tab;
        p.hidden = !on;
        if (on && !reduce) {
          gsap.fromTo(p.querySelectorAll('.route__stop, .route__leg'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'expo.out', overwrite: true });
          gsap.fromTo(p.querySelectorAll('.tips__row'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'expo.out', delay: 0.1, overwrite: true });
        }
      });
      moveInk(t);
      if (focus) t.focus();
      ScrollTrigger.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        select(n, true);
      });
    });
    const init = () => moveInk(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
    document.fonts.ready.then(init);
    window.addEventListener('resize', init);
  });
}

export function initFaq() {
  document.querySelectorAll<HTMLElement>('[data-acc-item]').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('[data-acc-btn]')!;
    const panel = item.querySelector<HTMLElement>('[data-acc-panel]')!;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (!open) {
        panel.hidden = false;
        if (!reduce) gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
      } else if (reduce) {
        panel.hidden = true;
      } else {
        gsap.to(panel, { height: 0, duration: 0.45, ease: 'expo.inOut', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); ScrollTrigger.refresh(); } });
      }
    });
  });

  // Acariciar a Orión
  const pet = document.querySelector<HTMLButtonElement>('[data-pet]');
  const count = document.querySelector<HTMLElement>('[data-pet-count]');
  const fx = document.querySelector<HTMLElement>('[data-pet-fx]');
  if (!pet || !count || !fx) return;
  let n = 0;
  let glasses = false; // en cada visita, las gafas caen con la primera caricia
  try { n = Number(localStorage.getItem('mn-pets') || 0); } catch {}
  // Contador mecánico: cada cifra es un rodillo que gira hasta el número nuevo
  const DIGITS = 3;
  const strips: HTMLElement[] = [];
  const shown: number[] = [];
  for (let i = 0; i < DIGITS; i++) {
    const win = document.createElement('span');
    win.className = 'odo';
    const strip = document.createElement('span');
    strip.className = 'odo__strip no-anim';
    strip.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<i>${d}</i>`).join('');
    win.appendChild(strip);
    count.appendChild(win);
    strips.push(strip);
    shown.push(0);
  }
  const setCounter = (value: number, animate: boolean) => {
    const txt = String(Math.min(value, 10 ** DIGITS - 1)).padStart(DIGITS, '0');
    count.setAttribute('aria-label', String(value));
    strips.forEach((strip, i) => {
      const d = Number(txt[i]);
      const prev = shown[i];
      if (d === prev && animate) return;
      shown[i] = d;
      if (!animate || reduce) {
        strip.classList.add('no-anim');
        strip.style.transform = `translateY(${-d * 40}px)`;
        return;
      }
      strip.classList.remove('no-anim');
      // 9 → 0: sigue girando hasta el 0 extra y luego se recoloca sin animar
      const target = prev === 9 && d === 0 ? 10 : d;
      strip.style.transform = `translateY(${-target * 40}px)`;
      if (target === 10) {
        strip.addEventListener('transitionend', () => {
          strip.classList.add('no-anim');
          strip.style.transform = 'translateY(0px)';
        }, { once: true });
      }
    });
  };
  setCounter(n, false);
  pet.addEventListener('click', (e) => {
    n++;
    setCounter(n, true);
    try { localStorage.setItem('mn-pets', String(n)); } catch {}
    const r = pet.getBoundingClientRect();
    const x = (e as MouseEvent).clientX ? (e as MouseEvent).clientX - r.left : r.width / 2;
    const y = (e as MouseEvent).clientY ? (e as MouseEvent).clientY - r.top : r.height / 2;
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('span');
      h.textContent = i % 2 ? '♥' : '✦';
      Object.assign(h.style, { position: 'absolute', left: `${x}px`, top: `${y}px`, color: '#78a58a', fontSize: `${14 + Math.random() * 14}px`, pointerEvents: 'none' });
      fx.appendChild(h);
      gsap.to(h, {
        x: gsap.utils.random(-60, 60), y: gsap.utils.random(-110, -50), rotate: gsap.utils.random(-40, 40), opacity: 0,
        duration: 1.1, ease: 'power2.out', onComplete: () => h.remove(),
      });
    }
    if (!glasses) {
      glasses = true;
      const g = document.querySelector<SVGElement>('[data-glasses]');
      const box = document.querySelector<HTMLElement>('[data-pet-img]');
      if (g && box) {
        if (reduce) gsap.set(g, { opacity: 1, xPercent: -50, yPercent: -27, rotation: 1 });
        else {
          // caen desde arriba del recuadro y se quedan en la cara
          const drop = box.getBoundingClientRect().height * 0.9;
          // caída recta y un pequeño rebote al apoyarse en la cara (una sola vez)
          gsap.timeline()
            .fromTo(g, { opacity: 1, xPercent: -50, yPercent: -27, y: -drop, rotation: -22 }, { y: 0, rotation: 2.5, duration: 0.6, ease: 'power2.in' })
            .to(g, { y: -9, rotation: -0.5, duration: 0.16, ease: 'power2.out' })
            .to(g, { y: 0, rotation: 1, duration: 0.2, ease: 'power2.in' });
        }
        setTimeout(() => document.dispatchEvent(new CustomEvent('peek:say', { detail: 'Turn down for what.' })), reduce ? 0 : 800);
      }
    }
    if (n === 10 || n === 50 || n === 100) {
      document.querySelector<HTMLElement>('[data-peek-text]') &&
        document.querySelector<HTMLElement>('[data-peek-cat]')?.click();
    }
  });
}
