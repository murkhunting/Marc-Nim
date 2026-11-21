import type { Spot } from '../../data/site';

export function initMap() {
  const el = document.querySelector<HTMLElement>('[data-map]');
  if (!el) return;
  const spots: Spot[] = JSON.parse(el.dataset.spots || '[]');
  const list = document.querySelector<HTMLElement>('[data-spot-list]')!;
  const items = [...list.querySelectorAll<HTMLElement>('[data-spot]')];
  const chips = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const desktop = window.matchMedia('(min-width: 900px)');

  let map: import('leaflet').Map | null = null;
  const markers = new Map<string, import('leaflet').Marker>();
  let activeId = '';

  const setActive = (id: string, fly = true) => {
    if (id === activeId) return;
    activeId = id;
    items.forEach((i) => i.classList.toggle('is-active', i.dataset.spot === id));
    markers.forEach((m, key) => m.getElement()?.querySelector('.pin')?.classList.toggle('is-active', key === id));
    const s = spots.find((x) => x.id === id);
    if (map && s && fly) {
      if (s.soon) map.flyTo([38.98, 1.42], 10, { duration: 1 });
      else { map.flyTo([s.lat, s.lng], 13, { duration: 1.2 }); markers.get(id)?.openPopup(); }
    }
  };

  const boot = async () => {
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');
    el.innerHTML = '';
    map = L.map(el, {
      center: [38.98, 1.42],
      zoom: 10,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
      // en móvil no se arrastra con un dedo, para no bloquear el scroll de la página (pinch sí)
      dragging: desktop.matches,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const bounds: [number, number][] = [];
    spots.forEach((s, i) => {
      if (s.soon) return;
      const icon = L.divIcon({
        className: '',
        html: `<span class="pin pin--${s.cat}"><span>${String(i + 1).padStart(2, '0')}</span></span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      });
      const m = L.marker([s.lat, s.lng], { icon, title: s.name, keyboard: true })
        .addTo(map!)
        .bindPopup(`<b>${s.name}</b>${s.text}`);
      m.on('click', () => { setActive(s.id, false); scrollCardIntoView(s.id); });
      markers.set(s.id, m);
      bounds.push([s.lat, s.lng]);
    });
    map.fitBounds(bounds, { padding: [30, 30] });
  };

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); boot(); }
  }, { rootMargin: '600px 0px' });
  io.observe(el);

  const scrollCardIntoView = (id: string) => {
    const card = items.find((i) => i.dataset.spot === id);
    if (!card || desktop.matches) return;
    list.scrollTo({ left: card.offsetLeft - list.offsetLeft - 16, behavior: 'smooth' });
  };

  // Clic en tarjeta
  list.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-spot-btn]');
    if (b) setActive(b.dataset.spotBtn!);
  });

  // Carrusel móvil: la tarjeta centrada mueve el mapa
  let t = 0;
  list.addEventListener('scroll', () => {
    if (desktop.matches) return;
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      const mid = list.scrollLeft + list.clientWidth * 0.3;
      const visible = items.filter((i) => !i.hidden);
      const current = visible.find((i) => i.offsetLeft + i.offsetWidth > mid) ?? visible[0];
      if (current) setActive(current.dataset.spot!);
    }, 140);
  }, { passive: true });

  // Filtros
  chips.forEach((c) => c.addEventListener('click', () => {
    const f = c.dataset.filter!;
    chips.forEach((x) => { x.classList.toggle('is-on', x === c); x.setAttribute('aria-pressed', String(x === c)); });
    items.forEach((i) => (i.hidden = f !== 'all' && i.dataset.cat !== f));
    if (!map) return;
    const pts: [number, number][] = [];
    markers.forEach((m, id) => {
      const s = spots.find((x) => x.id === id)!;
      const show = f === 'all' || s.cat === f;
      const el = m.getElement();
      if (el) el.style.display = show ? '' : 'none';
      if (show) pts.push([s.lat, s.lng]);
    });
    if (pts.length > 1) map.flyToBounds(pts, { padding: [40, 40], duration: 1 });
    else if (pts.length === 1) map.flyTo(pts[0], 13, { duration: 1 });
    else map.flyTo([38.98, 1.42], 10, { duration: 1 });
    list.scrollTo({ left: 0 });
  }));
}
