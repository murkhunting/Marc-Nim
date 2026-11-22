import { gsap, ScrollTrigger, reduce } from '../motion';

type Guest = { id: string; para: string; personas: string[] };

/** Invitación personalizada: ?i=alberto-isa → se busca en /invitados.json (personas del grupo y nombre del sobre).
 *  Sin id (o si no existe) se usa ?para=Nombre, o una sola persona genérica. */
async function loadGuest(): Promise<Guest> {
  const q = new URLSearchParams(window.location.search);
  const id = (q.get('i') ?? q.get('id') ?? '').trim().toLowerCase();
  const para = (q.get('para') ?? q.get('invitado') ?? q.get('nombre') ?? q.get('n') ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (id) {
    try {
      const res = await fetch('/invitados.json', { cache: 'no-cache' });
      const g = (await res.json())[id];
      const personas: string[] = Array.isArray(g?.personas) ? g.personas.map((x: unknown) => String(x).trim()).filter(Boolean) : [];
      if (personas.length) return { id, para: String(g.para ?? '').trim() || personas.join(' y '), personas };
    } catch { /* sin archivo o inválido: se usa el respaldo */ }
  }
  return { id, para, personas: [para || 'Tú'] };
}

const MENUS = ['Sin preferencias', 'Vegetariano', 'Vegano'];

/** Cada grupo de botones (.seg) lleva también un desplegable (.sel) equivalente: en móvil se ve el desplegable
 *  (ocupa mucho menos alto) y en escritorio los botones. Los dos se mantienen sincronizados. */
function enhanceSeg(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('.seg:not([data-enhanced])').forEach((seg) => {
    seg.setAttribute('data-enhanced', '');
    const radios = [...seg.querySelectorAll<HTMLInputElement>('input[type=radio]')];
    if (!radios.length) return;
    const label = seg.closest('.field')?.querySelector('.field__label')?.textContent?.trim() || seg.closest('.person')?.querySelector('.person__name')?.textContent?.trim() || '';
    const wrap = document.createElement('span');
    wrap.className = 'sel';
    const sel = document.createElement('select');
    sel.setAttribute('aria-label', label);
    radios.forEach((rd) => {
      const o = document.createElement('option');
      o.value = rd.value;
      o.textContent = rd.nextElementSibling?.textContent?.trim() || rd.value;
      sel.appendChild(o);
    });
    const hasChecked = () => radios.find((x) => x.checked);
    // sin ninguna opción marcada se añade un primer valor vacío ("Elige…")
    if (!hasChecked()) {
      const o = document.createElement('option');
      o.value = ''; o.textContent = 'Elige…'; o.disabled = true; o.selected = true;
      sel.prepend(o);
    } else sel.value = hasChecked()!.value;
    wrap.appendChild(sel);
    seg.after(wrap);
    sel.addEventListener('change', () => {
      const t = radios.find((x) => x.value === sel.value);
      if (t && !t.checked) { t.checked = true; t.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    radios.forEach((rd) => rd.addEventListener('change', () => { if (rd.checked) sel.value = rd.value; }));
  });
}

export async function initRsvp() {
  const root = document.querySelector<HTMLElement>('[data-rsvp]');
  if (!root) return;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!;
  const guest = await loadGuest();
  const personas = guest.personas;

  // Lista de personas de la invitación: quién viene (interruptor Sí/No) y menú de cada una
  const seg = (name: string, opts: [string, string][], checked: string) =>
    `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<label class="seg__opt"><input type="radio" name="${name}" value="${escapeHtml(v)}"${v === checked ? ' checked' : ''} /><span class="seg__box mono">${escapeHtml(l)}</span></label>`).join('')}</div>`;
  form.querySelector('[data-people]')!.innerHTML = personas
    .map((n, i) => `<div class="person person--switch"><span class="person__name">${escapeHtml(n)}</span>${seg(`asiste_${i}`, [['no', 'No'], ['si', 'Sí']], 'si')}</div>`)
    .join('');
  form.querySelector('[data-menus]')!.innerHTML = personas
    .map((n, i) => `<div class="person" data-person-row="${i}"><span class="person__name">${escapeHtml(n)}</span>${seg(`menu_${i}`, MENUS.map((m) => [m, m] as [string, string]), MENUS[0])}</div>`)
    .join('');

  enhanceSeg(form);
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
  const comes = (i: number) => (form.elements.namedItem(`asiste_${i}`) as RadioNodeList).value === 'si';
  const attending = () => personas.some((_, i) => comes(i));
  const flow = () => steps.filter((s) => s.dataset.only !== 'si' || attending());

  const updateConditional = () => {
    form.querySelectorAll<HTMLElement>('[data-person-row]').forEach((el) => (el.hidden = !comes(Number(el.dataset.personRow))));
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

  const answers = () => {
    const fd = new FormData(form);
    const yes = personas.filter((_, i) => comes(i));
    const no = personas.filter((_, i) => !comes(i));
    const menus = personas.map((n, i) => [n, String(fd.get(`menu_${i}`) ?? '')] as const).filter((_, i) => comes(i));
    return { yes, no, menus, fd };
  };

  const buildSummary = () => {
    const { yes, no, menus, fd } = answers();
    const rows: [string, string][] = [];
    if (yes.length) rows.push(['Asisten', yes.join(', ')]);
    if (no.length) rows.push(['No pueden venir', no.join(', ')]);
    if (yes.length) {
      rows.push(['Menú', menus.map(([n, m]) => `${n}: ${m}`).join('\n')]);
      const extra: [string, string][] = [['Alergias', 'alergias'], ['Origen', 'origen'], ['Transporte', 'transporte'], ['Llegada', 'llegada']];
      extra.forEach(([l, k]) => { const v = String(fd.get(k) ?? '').trim(); if (v) rows.push([l, v]); });
    }
    const msg = String(fd.get('mensaje') ?? '').trim();
    if (msg) rows.push(['Mensaje', msg]);
    summary.innerHTML = rows.map(([l, v]) => `<div><dt>${l}</dt><dd>${escapeHtml(v).replace(/\n/g, '<br>')}</dd></div>`).join('');
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
    if (t.name.startsWith('asiste_')) {
      sayText(attending() ? '¡Aprobado! Sabía que vendrías.' : 'Vaya. Os echaremos de menos. Ellos más que yo.');
    }
  });

  // Enter avanza en lugar de enviar
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && submit.hidden) {
      e.preventDefault();
      next.click();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submit.disabled = true;
    submit.classList.add('is-sending');
    const { yes, no, menus, fd } = answers();
    const text = (k: string) => String(fd.get(k) ?? '').trim();
    const data: Record<string, string> = {
      expediente: exp, fecha: new Date().toISOString(),
      invitacion: guest.id, para: guest.para,
      asistencia: yes.length ? 'si' : 'no', asisten: yes.join(', '), no_asisten: no.join(', '),
      menus: menus.map(([n, m]) => `${n}: ${m}`).join(' | '),
      alergias: yes.length ? text('alergias') : '', origen: yes.length ? text('origen') : '',
      transporte: yes.length ? text('transporte') : '', llegada: yes.length ? text('llegada') : '',
      mensaje: text('mensaje'),
    };
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
    const hiddenEls = [...form.querySelectorAll<HTMLElement>('[data-person-row], [data-only]')].filter((e) => e.hidden);
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
    const slack = window.matchMedia('(max-width: 639px)').matches ? 18 : 64;
    root.style.setProperty('--card-h', `${Math.ceil(max) + slack}px`);
  };
  fitHeight();
  document.fonts?.ready.then(() => { fitHeight(); ScrollTrigger.refresh(); });
  let rt = 0;
  window.addEventListener('resize', () => { window.clearTimeout(rt); rt = window.setTimeout(fitHeight, 150); });

  initEnvelope(root, steps, sayText, guest.para);

  // Al llegar, el área del formulario se queda fija un par de scrolls antes de seguir bajando
  const area = document.querySelector<HTMLElement>('[data-rsvp-area]');
  if (area && !reduce) {
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    // Solo en pantallas grandes: en móvil el área se adapta a la tarjeta y el scroll no se detiene
    gsap.matchMedia().add('(min-width: 640px)', () => {
      ScrollTrigger.create({
        trigger: area,
        start: () => `top ${navH()}px`,
        end: () => `+=${Math.round(window.innerHeight * 0.5)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      ScrollTrigger.refresh();
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

/** Sobre de la invitación: flota con el nombre del invitado; al abrirlo se da la vuelta, se rompe el lacre
 *  y la tarjeta (el formulario) sale de dentro. */
function initEnvelope(card: HTMLElement, steps: HTMLElement[], sayText: (t: string) => void, name: string) {
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
