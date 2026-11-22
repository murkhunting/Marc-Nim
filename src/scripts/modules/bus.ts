import { gsap, reduce } from '../motion';

/** Autobús en perfil que recorre las paradas A → B → C → A y vuelve a empezar.
 *  Escritorio: avanza en horizontal por la línea; móvil: baja en vertical (el autobús gira 90°).
 *  Va por debajo de los indicadores, así que parece salir de uno y entrar en el siguiente. */
export function initBus() {
  const route = document.querySelector<HTMLElement>('[data-bus-route]');
  const rider = route?.querySelector<HTMLElement>('[data-bus-rider]');
  if (!route || !rider || reduce) return;
  const nodes = [...route.querySelectorAll<HTMLElement>('.bus__node')];
  if (nodes.length < 2) return;

  let tl: gsap.core.Timeline | null = null;
  let visible = false;

  // Centro de cada indicador respecto al contenedor (con offsets, para no depender de transformaciones de reveal)
  const centers = () =>
    nodes.map((n) => {
      const li = n.offsetParent as HTMLElement;
      return { x: li.offsetLeft + n.offsetLeft + n.offsetWidth / 2, y: li.offsetTop + n.offsetTop + n.offsetHeight / 2 };
    });

  const build = () => {
    tl?.kill();
    const row = window.matchMedia('(min-width: 900px)').matches;
    const c = centers();
    gsap.set(rider, { xPercent: -50, yPercent: -50, rotation: row ? 0 : 90, x: c[0].x, y: c[0].y, opacity: 1 });
    tl = gsap.timeline({ repeat: -1, paused: !visible });
    for (let i = 1; i < c.length; i++) {
      tl.to(rider, { x: c[i].x, y: c[i].y, duration: 1.7, ease: 'power1.inOut' });
      if (i < c.length - 1) tl.to({}, { duration: 0.45 }); // parada
    }
    tl.to({}, { duration: 0.8 });                                // llega al último A
    tl.set(rider, { x: c[0].x, y: c[0].y });                     // vuelve (oculto bajo los indicadores) y repite
    tl.to({}, { duration: 0.5 });
  };

  build();
  document.fonts?.ready.then(build);
  let rt = 0;
  window.addEventListener('resize', () => { window.clearTimeout(rt); rt = window.setTimeout(build, 150); });

  // Solo anima cuando se ve
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? tl?.play() : tl?.pause();
  }, { threshold: 0.15 }).observe(route);
}
