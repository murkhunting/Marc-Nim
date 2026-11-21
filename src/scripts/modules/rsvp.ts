import { gsap, ScrollTrigger, reduce } from '../motion';

const LABELS: Record<string, string> = {
  nombre: 'Nombre',
  email: 'Email',
  telefono: 'Teléfono',
  asistencia: 'Asistencia',
  acompanante: 'Acompañante',
  acompanante_nombre: 'Nombre acomp.',
  ninos: 'Niños',
  menu: 'Menú',
  alergias: 'Alergias',
  origen: 'Origen',
  transporte: 'Transporte',
  llegada: 'Llegada',
  cancion: 'Canción',
  mensaje: 'Mensaje',
};

export function initRsvp() {
  const root = document.querySelector<HTMLElement>('[data-rsvp]');
  if (!root) return;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!;
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const submit = root.querySelector<HTMLButtonElement>('[data-submit]')!;
  const err = form.querySelector<HTMLElement>('[data-error]')!;
  const stepLabel = root.querySelector<HTMLElement>('[data-step-label]')!;
  const bar = root.querySelector<HTMLElement>('[data-progress-bar]')!;
  const summary = root.querySelector<HTMLElement>('[data-summary]')!;
  const done = root.querySelector<HTMLElement>('[data-done]')!;
  const endpoint = root.dataset.endpoint || '';

  const exp = `EXP-2027-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  root.querySelectorAll('[data-exp]').forEach((e) => (e.textContent = exp));

  let current = 0;
  const attending = () => (form.elements.namedItem('asistencia') as RadioNodeList).value !== 'no';
  const flow = () => steps.filter((s) => s.dataset.only !== 'si' || attending());

  const updateConditional = () => {
    const fd = new FormData(form);
    form.querySelectorAll<HTMLElement>('[data-show-if]').forEach((el) => {
      const [k, v] = el.dataset.showIf!.split('=');
      el.hidden = fd.get(k) !== v;
    });
    form.querySelectorAll<HTMLElement>('.field[data-only="si"]').forEach((el) => (el.hidden = !attending()));
    const t = form.querySelector<HTMLElement>('[data-title-si]');
    if (t) t.textContent = attending() ? t.dataset.titleSi! : t.dataset.titleNo!;
  };

  const renderProgress = () => {
    const f = flow();
    const idx = f.indexOf(steps[current]);
    bar.innerHTML = f.map((_, i) => `<i class="${i < idx ? 'is-done' : i === idx ? 'is-now' : ''}"></i>`).join('');
    stepLabel.textContent = `Paso ${idx + 1} / ${f.length}`;
    prev.disabled = idx === 0;
    const last = idx === f.length - 1;
    next.hidden = last;
    submit.hidden = !last;
  };

  // Orión comenta cada paso asomando por la esquina de la pantalla (con su bocadillo)
  const sayText = (t: string) => {
    if (t) document.dispatchEvent(new CustomEvent('peek:say', { detail: t }));
  };

  const go = (to: number, dir: 1 | -1) => {
    const from = steps[current];
    const target = steps[to];
    err.hidden = true;
    current = to;
    if (target.querySelector('[data-summary]')) buildSummary();
    updateConditional();
    const show = () => {
      from.classList.remove('is-current');
      target.classList.add('is-current');
      renderProgress();
      sayText(target.dataset.sayText || '');
      if (!reduce) gsap.fromTo(target, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out', clearProps: 'transform' });
      const first = target.querySelector<HTMLElement>('input:not([type=radio]):not([hidden]), textarea');
      if (first && window.matchMedia('(pointer: fine)').matches) first.focus({ preventScroll: true });
    };
    if (reduce) show();
    else gsap.to(from, { opacity: 0, x: -40 * dir, duration: 0.25, ease: 'power2.in', onComplete: () => { gsap.set(from, { clearProps: 'all' }); show(); } });
  };

  const validate = (step: HTMLElement) => {
    const fields = [...step.querySelectorAll<HTMLInputElement>('input, textarea')].filter((f) => !f.closest('[hidden]'));
    for (const f of fields) {
      if (f.type === 'radio') {
        if (f.required && !(form.elements.namedItem(f.name) as RadioNodeList).value) {
          err.textContent = 'Elige una opción para continuar. El promotor no acepta silencios.';
          err.hidden = false;
          return false;
        }
        continue;
      }
      f.setAttribute('aria-invalid', String(!f.checkValidity()));
      if (!f.checkValidity()) {
        err.textContent = f.type === 'email' && f.value ? 'Ese email no parece válido.' : 'Faltan campos obligatorios (*).';
        err.hidden = false;
        f.focus();
        return false;
      }
    }
    err.hidden = true;
    return true;
  };

  const buildSummary = () => {
    const fd = new FormData(form);
    const rows: string[] = [];
    fd.forEach((v, k) => {
      const val = String(v).trim();
      if (!val || !LABELS[k]) return;
      const field = form.querySelector(`[name="${k}"]`);
      if (field?.closest('[hidden]') || (field?.closest('[data-only="si"]') && !attending())) return;
      if (k === 'ninos' && val === '0') return;
      const shown = k === 'asistencia' ? (val === 'si' ? 'Sí, asistiré' : 'No podré asistir') : k === 'acompanante' ? (val === 'si' ? 'Sí' : 'No') : val;
      rows.push(`<div><dt>${LABELS[k]}</dt><dd>${escapeHtml(shown)}</dd></div>`);
    });
    summary.innerHTML = rows.join('');
  };

  next.addEventListener('click', () => {
    if (!validate(steps[current])) return;
    const f = flow();
    const i = f.indexOf(steps[current]);
    go(steps.indexOf(f[i + 1]), 1);
  });
  prev.addEventListener('click', () => {
    const f = flow();
    const i = f.indexOf(steps[current]);
    go(steps.indexOf(f[i - 1]), -1);
  });

  form.addEventListener('change', (e) => {
    updateConditional();
    renderProgress();
    const t = e.target as HTMLInputElement;
    if (t.name === 'asistencia') {
      sayText(t.value === 'si' ? '¡Aprobado! Sabía que vendrías.' : 'Vaya. Te echaremos de menos. Ellos más que yo.');
      // avanzar solo tras elegir asistencia
      window.setTimeout(() => next.click(), reduce ? 0 : 650);
    }
  });

  // Enter avanza en lugar de enviar
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && submit.hidden) {
      e.preventDefault();
      next.click();
    }
  });

  // Contador de niños
  form.querySelectorAll<HTMLElement>('[data-stepper]').forEach((s) => {
    const input = s.querySelector('input')!;
    s.querySelector('[data-dec]')!.addEventListener('click', () => (input.value = String(Math.max(0, Number(input.value) - 1))));
    s.querySelector('[data-inc]')!.addEventListener('click', () => (input.value = String(Math.min(6, Number(input.value) + 1))));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submit.disabled = true;
    submit.classList.add('is-sending');
    const data: Record<string, string> = { expediente: exp, fecha: new Date().toISOString() };
    new FormData(form).forEach((v, k) => (data[k] = String(v)));
    try {
      if (endpoint) {
        // text/plain evita el preflight CORS (compatible con Google Apps Script)
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        console.info('[RSVP] Sin endpoint configurado (PUBLIC_RSVP_ENDPOINT). Datos:', data);
        await new Promise((r) => setTimeout(r, 700));
      }
      finish(data.asistencia !== 'no');
    } catch {
      err.textContent = 'No se ha podido enviar. Revisa tu conexión e inténtalo de nuevo.';
      err.hidden = false;
      submit.disabled = false;
      submit.classList.remove('is-sending');
    }
  });

  const finish = (yes: boolean) => {
    if (!yes) {
      root.querySelector('[data-done-title]')!.textContent = 'Solicitud registrada';
      root.querySelector('[data-done-text]')!.textContent = 'Gracias por avisarnos. Te echaremos mucho de menos y brindaremos por ti.';
      root.querySelector('[data-done-note]')!.textContent = '— Orión (yo también te echaré de menos. Un poco.)';
    }
    form.hidden = true;
    bar.querySelectorAll('i').forEach((i) => (i.className = 'is-done'));
    stepLabel.textContent = 'Completado';
    done.hidden = false;
    if (!reduce) {
      const stamp = done.querySelector('[data-done-stamp]');
      gsap.timeline()
        .fromTo(stamp, { scale: 3.2, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.55, ease: 'back.out(2)' })
        .to(root, { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: 'none', clearProps: 'transform' }, '-=0.15')
        .from(done.querySelectorAll('.done__exp, .done__title, .done__text, .note'), { opacity: 0, y: 20, stagger: 0.08, duration: 0.7, ease: 'expo.out' }, '-=0.1');
      if (yes) confetti(root);
    }
    window.setTimeout(() => ScrollTrigger.refresh(), 1200);
  };

  updateConditional();
  renderProgress();

  // Altura fija: la del paso más alto, para que la tarjeta no cambie de tamaño (la pantalla final se ajusta dentro)
  const fitHeight = () => {
    root.style.removeProperty('--card-h');
    const cur = steps[current];
    const hiddenEls = [...form.querySelectorAll<HTMLElement>('[data-show-if], [data-only]')].filter((e) => e.hidden);
    hiddenEls.forEach((e) => (e.hidden = false));
    let max = 0;
    steps.forEach((st) => {
      steps.forEach((x) => x.classList.toggle('is-current', x === st));
      max = Math.max(max, root.offsetHeight);
    });
    steps.forEach((x) => x.classList.toggle('is-current', x === cur));
    hiddenEls.forEach((e) => (e.hidden = true));
    updateConditional();
    // un poco más alta que el paso más alto: deja respiro entre el contenido y la barra inferior
    root.style.setProperty('--card-h', `${Math.ceil(max) + 64}px`);
  };
  fitHeight();
  document.fonts?.ready.then(() => { fitHeight(); ScrollTrigger.refresh(); });
  let rt = 0;
  window.addEventListener('resize', () => { window.clearTimeout(rt); rt = window.setTimeout(fitHeight, 150); });

  initEnvelope(root, steps, sayText);

  // Al llegar, el área del formulario se queda fija un par de scrolls antes de seguir bajando
  const area = document.querySelector<HTMLElement>('[data-rsvp-area]');
  if (area && !reduce) {
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    ScrollTrigger.create({
      trigger: area,
      start: () => `top ${navH()}px`,
      end: () => `+=${Math.round(window.innerHeight * 0.5)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  }
}

function confetti(root: HTMLElement) {
  const r = root.getBoundingClientRect();
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    const paw = i % 3 === 0;
    p.innerHTML = paw ? '<svg viewBox="0 0 64 64" width="18" height="18" fill="currentColor"><use href="#paw"/></svg>' : '';
    Object.assign(p.style, {
      position: 'fixed', left: `${r.left + r.width / 2}px`, top: `${Math.max(80, r.top + 120)}px`, zIndex: '1500', pointerEvents: 'none',
      width: paw ? '18px' : '8px', height: paw ? '18px' : '14px',
      background: paw ? 'transparent' : ['#78a58a', '#17191d', '#66734a', '#2c6e8a'][i % 4],
      color: '#17191d',
    });
    document.body.appendChild(p);
    gsap.to(p, {
      x: gsap.utils.random(-260, 260), y: gsap.utils.random(-240, 160), rotate: gsap.utils.random(-360, 360), opacity: 0,
      duration: gsap.utils.random(1.2, 2), ease: 'power3.out', onComplete: () => p.remove(),
    });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Nombre del invitado desde la URL: ?para=Marta%20y%20Jordi (también ?invitado=, ?nombre=, ?n=) */
function guestName(): string {
  const q = new URLSearchParams(window.location.search);
  const raw = q.get('para') ?? q.get('invitado') ?? q.get('nombre') ?? q.get('n') ?? '';
  return raw.replace(/\s+/g, ' ').trim().slice(0, 60);
}

/** Sobre de la invitación: flota con el nombre del invitado; al abrirlo se da la vuelta, se rompe el lacre
 *  y la tarjeta (el formulario) sale de dentro. */
function initEnvelope(card: HTMLElement, steps: HTMLElement[], sayText: (t: string) => void) {
  const stage = card.closest<HTMLElement>('[data-stage]');
  const hit = stage?.querySelector<HTMLButtonElement>('[data-envelope]');
  if (!stage || !hit) return;
  const env = stage.querySelector<HTMLElement>('.env')!;
  const tilt = env.querySelector<HTMLElement>('[data-env-tilt]')!;
  const flip = env.querySelector<HTMLElement>('[data-env-flip]')!;
  const part = (n: string) => env.querySelector<HTMLElement>(`[data-env="${n}"]`)!;
  const back = part('back'), front = part('front'), flap = part('flap'), seal = part('seal');
  const area = stage.parentElement!;

  // Nombre personalizado
  const name = guestName();
  const nameEl = env.querySelector<HTMLElement>('[data-guest-name]')!;
  if (name) {
    nameEl.textContent = name;
    env.querySelector<HTMLElement>('[data-guest-to]')!.hidden = false;
    hit.setAttribute('aria-label', `Abrir la invitación de ${name}`);
  }
  nameEl.style.setProperty('--len', String(Math.max(6, nameEl.textContent!.length)));

  // Cerrado: la tarjeta espera dentro, algo más pequeña y baja, tapada por el bolsillo y la solapa
  stage.setAttribute('data-closed', '');
  card.setAttribute('inert', '');
  const inside = () => ({ scale: 0.9, y: card.offsetHeight * 0.08, transformOrigin: '50% 0%' });
  gsap.set(card, { ...inside(), visibility: 'hidden' }); // oculta hasta que se abre: sin costuras entre solapa y bolsillo

  // ── Sobre flotando en 3D ──────────────────────────────────
  const cleanups: (() => void)[] = [];
  if (!reduce) {
    gsap.set(tilt, { y: 0, rotation: -0.6 });
    const floats = [
      gsap.to(tilt, { y: -12, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      gsap.to(tilt, { rotation: 0.6, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    ];
    cleanups.push(() => floats.forEach((t) => t.kill()));

    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      // Escritorio: se inclina siguiendo al ratón
      const move = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const x = gsap.utils.clamp(-0.5, 0.5, (e.clientX - r.left) / r.width - 0.5);
        const y = gsap.utils.clamp(-0.5, 0.5, (e.clientY - r.top) / r.height - 0.5);
        rx(-y * 16); ry(x * 20);
      };
      const leave = () => { rx(0); ry(0); };
      area.addEventListener('pointermove', move);
      area.addEventListener('pointerleave', leave);
      cleanups.push(() => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); });
    } else {
      // Móvil: se inclina con el scroll
      const st = ScrollTrigger.create({
        trigger: area, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const p = self.progress - 0.5;
          rx(-p * 34); ry(Math.sin(self.progress * Math.PI * 2) * 7);
        },
      });
      cleanups.push(() => st.kill());
    }
  }

  let opened = false;
  const finish = () => {
    stage.removeAttribute('data-closed');
    card.removeAttribute('inert');
    gsap.set(card, { clearProps: 'transform' });
    env.hidden = true;
    ScrollTrigger.refresh();
    sayText(steps[0].dataset.sayText || '');
    const first = card.querySelector<HTMLElement>('input:not([type=radio]), textarea');
    if (first && window.matchMedia('(pointer: fine)').matches) first.focus({ preventScroll: true });
  };

  // Apertura (igual que antes): el lacre se desvanece, la solapa se abre, la tarjeta sale y el sobre se retira
  const openTimeline = () => {
    gsap.set(flap, { transformPerspective: 1400, rotationX: 0 });
    const h = card.offsetHeight;
    const rise = h * 0.4;              // cuánto asoma la tarjeta antes de que el sobre se retire
    // La escena (sobre + tarjeta) se aleja un poco y baja para que la solapa abierta y la tarjeta quepan en pantalla
    const areaR = area.getBoundingClientRect();
    const stageR = stage.getBoundingClientRect();
    const k = Math.min(1, (areaR.height - 24) / (h * 1.5 + 12));
    const scaledTop = stageR.top - areaR.top + (h * (1 - k)) / 2;
    const shift = h * 0.5 * k + 12 - scaledTop;

    return gsap.timeline({ onComplete: () => { gsap.set(stage, { clearProps: 'transform' }); finish(); } })
      .to(seal, { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 0.05)
      .set(card, { visibility: 'visible' }, 0.8)
      .to(stage, { scale: k, y: Math.max(0, shift), duration: 1.2, ease: 'sine.inOut' }, 0.85)
      .to(flap, { rotationX: -180, duration: 1.2, ease: 'sine.inOut' }, 0.85)
      .set(flap, { zIndex: 1 }, 1.45)     // pasada la vertical, la solapa queda detrás de la tarjeta
      .to(card, { y: -rise, duration: 1.2, ease: 'sine.inOut' }, 1.75)
      .to(stage, { scale: 1, y: 0, duration: 1.5, ease: 'sine.inOut' }, 2.9)
      .to([back, front, flap], { y: 120, opacity: 0, duration: 1.5, ease: 'sine.inOut' }, 2.9)
      .to(card, { y: 0, scale: 1, duration: 1.5, ease: 'sine.inOut' }, 2.9);
  };

  const open = () => {
    if (opened) return;
    opened = true;
    hit.disabled = true;
    hit.removeAttribute('data-cursor-text');
    document.querySelector('[data-cursor-el]')?.classList.remove('is-label');
    cleanups.forEach((c) => c());
    const flatten = () => {
      gsap.killTweensOf(tilt);
      gsap.set([tilt, flip], { clearProps: 'transform' });
      env.classList.add('is-flat');
    };
    if (reduce) { flatten(); gsap.set(card, { visibility: 'visible' }); finish(); return; }

    // 1) se endereza y deja de flotar · 2) se da la vuelta mostrando la solapa y el lacre · 3) se abre
    gsap.killTweensOf(tilt);
    gsap.timeline()
      .to(tilt, { y: 0, rotation: 0, rotationX: 0, rotationY: 0, duration: 0.6, ease: 'sine.inOut' }, 0)
      .to(flip, { rotationY: 180, duration: 1.3, ease: 'power2.inOut' }, 0.2)
      .to(flip, { z: 60, duration: 0.65, ease: 'sine.out', yoyo: true, repeat: 1 }, 0.2)
      .add(flatten)
      .add(openTimeline(), '+=0.25');
  };

  hit.addEventListener('click', open);
  // si cambia el tamaño antes de abrir, recolocar la tarjeta dentro
  window.addEventListener('resize', () => { if (!opened) gsap.set(card, { ...inside(), visibility: 'hidden' }); });
}
