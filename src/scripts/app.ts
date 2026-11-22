import { gsap, ScrollTrigger, getLenis, scrollToId, reduce, isFine } from './motion';
import { runLoader } from './modules/loader';
import { initNav } from './modules/nav';
import { initCursor } from './modules/cursor';
import { initPeek } from './modules/peek';
import { initReveals, heroIntro } from './modules/reveals';
import { initCountdown } from './modules/countdown';
import { initSections } from './modules/sections';
import { initMap } from './modules/map';
import { initTabs, initFaq } from './modules/ui';
import { initRsvp } from './modules/rsvp';
import { initBus } from './modules/bus';
import { initHeroApprove } from './modules/hero';

getLenis();

// Enlaces internos con scroll suave
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>('[data-scroll]');
  if (!a) return;
  e.preventDefault();
  document.dispatchEvent(new CustomEvent('menu:close'));
  scrollToId(a.dataset.scroll!);
  history.replaceState(null, '', `#${a.dataset.scroll}`);
});

initNav();
if (isFine && !reduce) initCursor();
initPeek();
initCountdown();
initReveals();
initSections();
initMap();
initTabs();
initFaq();
initRsvp();
initBus();
initHeroApprove();

runLoader().then(() => {
  heroIntro();
  document.dispatchEvent(new CustomEvent('app:ready'));
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
export { gsap };
