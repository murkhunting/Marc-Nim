export function initCountdown() {
  const root = document.querySelector<HTMLElement>('[data-countdown]');
  if (!root) return;
  const target = new Date(root.dataset.countdown!).getTime();
  const get = (k: string) => root.querySelector<HTMLElement>(`[data-cd="${k}"]`)!;
  const els = { d: get('d'), h: get('h'), m: get('m'), s: get('s') };
  const pad = (n: number, l = 2) => String(n).padStart(l, '0');

  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    els.d.textContent = pad(d, 3);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
  };
  tick();
  window.setInterval(tick, 1000);
}
