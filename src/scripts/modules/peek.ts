import { gsap, ScrollTrigger, reduce, isFine } from '../motion';

const RANDOM = [
  'Miau. Quiero decir: aprobado.',
  'Estoy supervisando. Con los ojos cerrados, pero supervisando.',
  '¿Has confirmado ya? Te estoy vigilando.',
  'Las gafas son por lo que brilla este proyecto.',
  'Cobro en caricias. Y en latas.',
  'No me toques el plano. Bueno, vale.',
];

// Orión nunca sale entero: se queda con el borde inferior (recortado en la foto) fuera de la pantalla
const REST = 11; // % de su alto que queda oculto

export function initPeek() {
  const root = document.querySelector<HTMLElement>('[data-peek]');
  if (!root) return;
  const cat = root.querySelector<HTMLElement>('[data-peek-cat]')!;
  const bubble = root.querySelector<HTMLElement>('[data-peek-bubble]')!;
  const text = root.querySelector<HTMLElement>('[data-peek-text]')!;
  const lines: Record<string, string> = JSON.parse(root.dataset.lines || '{}');

  let visible = false;
  let hideTimer = 0;
  let lastAuto = 0;
  let lastSay = 0;
  let ready = false;
  const seen = new Set<string>();

  const show = (msg: string, ms = 4200) => {
    window.clearTimeout(hideTimer);
    text.textContent = msg;
    if (!visible) {
      visible = true;
      gsap.killTweensOf([cat, bubble]);
      gsap.to(cat, { yPercent: REST, y: 0, duration: reduce ? 0 : 0.7, ease: 'back.out(1.1)' });
      gsap.fromTo(bubble, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, delay: reduce ? 0 : 0.25, ease: 'back.out(2)' });
    } else {
      gsap.fromTo(bubble, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
    }
    if (ms > 0) hideTimer = window.setTimeout(hide, ms);
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    gsap.to(bubble, { opacity: 0, y: 10, scale: 0.9, duration: 0.25 });
    gsap.to(cat, { yPercent: reduce ? REST : 105, duration: 0.6, ease: 'power3.in', delay: 0.1 });
  };

  if (!reduce) gsap.set(cat, { yPercent: 105 });
  cat.addEventListener('click', () => show(RANDOM[Math.floor(Math.random() * RANDOM.length)]));

  // Mensajes pedidos desde otras partes de la web
  document.addEventListener('peek:say', (e) => show(String((e as CustomEvent).detail || ''), 4200));

  // Aparece al entrar en secciones (una vez por sección)
  document.addEventListener('app:ready', () => { ready = true; window.setTimeout(() => show(lines.inicio || '', 4000), 900); seen.add('inicio'); });
  document.querySelectorAll<HTMLElement>('section[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      refreshPriority: -1,
      onEnter: () => {
        const id = sec.dataset.section!;
        if (!ready || seen.has(id) || !lines[id]) return;
        if (Date.now() - lastAuto < 5000) return;
        seen.add(id); lastAuto = Date.now(); lastSay = Date.now();
        show(lines[id]);
      },
    });
  });

  // Móvil: no hay hover, así que Orión comenta SOLO al hacer scroll: cada vez que una zona con comentario
  // llega a la franja central de la pantalla, sale con su frase (y se esconde solo).
  const io = !isFine && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting || !ready) return;
          const msg = (en.target as HTMLElement).dataset.cuquiHover;
          if (!msg) return;
          if (Date.now() - lastSay < 2200) return; // sin solaparse con el comentario anterior
          lastSay = Date.now();
          show(msg, 3800);
        });
      }, { rootMargin: '-36% -18% -36% -18%', threshold: 0 })
    : null;

  // Hover (escritorio) / aparición con scroll (móvil) en zonas marcadas
  document.querySelectorAll<HTMLElement>('[data-cuqui-hover]').forEach((el) => {
    const msg = el.dataset.cuquiHover!;
    if (isFine) {
      el.addEventListener('pointerenter', () => show(msg, 0));
      el.addEventListener('pointerleave', () => { window.clearTimeout(hideTimer); hideTimer = window.setTimeout(hide, 900); });
    } else {
      io?.observe(el);
      let last = 0;
      el.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('a, button, input, label')) return;
        if (Date.now() - last < 600) return;
        last = Date.now();
        lastSay = Date.now();
        show(msg, 3500);
      });
    }
  });
}
