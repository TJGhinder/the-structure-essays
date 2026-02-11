// backlinks.js
/* ── Blog post registry for backlink previews ── */
export const POSTS = {
  '/the-structure-origins/': {
  title: 'The Structure Origins',
  sub: 'From possibility to reality, from collapse to creation',
  excerpt: 'Anything could be. Anything at all. Mind can construct anything—but the real question is: can those constructions cool down into reality? Three major lines of inquiry converge on a shared philosophical truth: Possibility is the fundamental unit of existence. What we consider "real" is simply the subset of possibilities that have stabilized enough for us to perceive them.',
  datePublished: '2025-08-27',
},
  '/the-power-of-stories/': {
    title: 'The Power of Stories',
    sub: 'Why the narratives that bind us matter more than their truth',
    excerpt:
      'The mathematics of evolution reveal an uncomfortable truth: species survive not by perceiving reality as it is, but by perceiving it in whatever way maximizes their reproductive fitness. We are not truth-seeking machines. We are survival machines that use whatever stories work. By the laws of evolution, the oldest stories that remain with us endure not because they are true, but because they are useful.',
    datePublished: '2025-10-08',
  },
  '/the-first-lesson/': {
    title: 'The First Lesson',
    sub: 'If you only remember one thing, let it be this',
    excerpt:
      'The capital-T Truth is: There is no capital-T Truth. This is the central, most important lesson. Be humble, for you are limited in what you can know. There is no capital-T Truth, because as a living, breathing, medium-sized 3-dimensional creature who thinks and moves at medium-speeds through time–you know nothing.',
    datePublished: '2026-02-01', // <-- add dates so index can sort + render
  },
  '/the-examined-life/': {
    title: 'The Examined Life',
    sub: 'Why Socrates was right — and why we keep forgetting',
    excerpt:
      'Self-reflection is not a luxury of the leisured class. It is the minimum requirement for moral agency. Without it, we act on inherited impulse and call it conviction.',
    datePublished: '2026-01-15',
  },
  '/social-contract-reimagined/': {
    title: 'The Social Contract, Reimagined',
    sub: 'Consent, coercion, and the state we never chose',
    excerpt:
      'Rousseau asked us to imagine a contract none of us signed. Perhaps the more honest question is: what obligations survive the absence of consent?',
    datePublished: '2025-12-10',
  },
  '/on-moral-luck/': {
    title: 'On Moral Luck',
    sub: 'The uncomfortable truth about praise and blame',
    excerpt:
      'We praise the surgeon whose hand was steady and blame the one whose hand trembled — yet neither chose their nerves. Moral luck haunts every judgment we make.',
    datePublished: '2025-11-18',
  },
  '/virtue-in-the-digital-age/': {
    title: 'Virtue in the Digital Age',
    sub: 'Aristotle never had a Twitter account',
    excerpt:
      'The virtues were forged for the agora, not the algorithm. Can courage, temperance, and justice survive a world optimized for engagement?',
    datePublished: '2025-10-22',
  },
  '/the-obligation-to-dissent/': {
    title: 'The Obligation to Dissent',
    sub: 'When silence becomes complicity',
    excerpt:
      'There are moments when obedience is the greater sin. The history of moral progress is, in large part, a history of principled refusal.',
    datePublished: '2025-09-05',
  },
};

/* ── Detect touch device ── */
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* ── Desktop: Hover preview tooltip ── */
let tooltip = null;
let activeLink = null;
let hideTimeout = null;

function createTooltip() {
  tooltip = document.createElement('div');
  tooltip.className = 'preview-tooltip';
  document.body.appendChild(tooltip);
}

function showTooltip(link) {
  if (isTouchDevice()) return;
  if (!tooltip) createTooltip();
  clearTimeout(hideTimeout);

  const href = link.getAttribute('href');
  const path = href.endsWith('/') ? href : href + '/';
  const post = POSTS[path];
  if (!post) return;

  tooltip.innerHTML = `
    <div class="preview-title">${post.title}</div>
    <div class="preview-sub">${post.sub}</div>
    <div class="preview-excerpt">${post.excerpt}</div>
    <a class="preview-cta" href="${href}" target="_blank" rel="noopener">Read essay →</a>
  `;

  const rect = link.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top = rect.bottom + scrollY + 10;
  let left = rect.left + scrollX + rect.width / 2 - 160;

  left = Math.max(12, Math.min(left, window.innerWidth - 332));

  if (rect.bottom + 220 > window.innerHeight) {
    top = rect.top + scrollY - 10;
    tooltip.style.transform = 'translateY(-100%)';
  } else {
    tooltip.style.transform = '';
  }

  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';

  requestAnimationFrame(() => tooltip.classList.add('visible'));
  activeLink = link;
}

function hideTooltip() {
  if (!tooltip) return;
  hideTimeout = setTimeout(() => {
    tooltip.classList.remove('visible');
    activeLink = null;
  }, 120);
}

/* ── Mobile: Bottom sheet overlay ── */
let overlay = null;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  overlay.innerHTML = `
    <div class="mobile-preview-card" style="position:relative;">
      <button class="mobile-close" aria-label="Close">×</button>
      <div class="preview-title"></div>
      <div class="preview-sub"></div>
      <div class="preview-excerpt"></div>
      <a class="preview-cta" href="#" target="_blank" rel="noopener">Read essay →</a>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.mobile-close').addEventListener('click', closeMobilePreview);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMobilePreview();
  });
}

function showMobilePreview(href) {
  if (!overlay) createOverlay();
  const path = href.endsWith('/') ? href : href + '/';
  const post = POSTS[path];
  if (!post) return;

  overlay.querySelector('.preview-title').textContent = post.title;
  overlay.querySelector('.preview-sub').textContent = post.sub;
  overlay.querySelector('.preview-excerpt').textContent = post.excerpt;
  overlay.querySelector('.preview-cta').href = href;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobilePreview() {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Exported initializer ── */
export function initBacklinks() {
  document.querySelectorAll('.backlink').forEach((link) => {
    link.addEventListener('mouseenter', () => showTooltip(link));
    link.addEventListener('mouseleave', hideTooltip);

    link.addEventListener('click', (e) => {
      if (isTouchDevice()) {
        e.preventDefault();
        showMobilePreview(link.getAttribute('href'));
      }
    });
  });

  document.addEventListener(
    'mouseenter',
    (e) => {
      if (e.target.closest && e.target.closest('.preview-tooltip')) {
        clearTimeout(hideTimeout);
      }
    },
    true
  );
  document.addEventListener(
    'mouseleave',
    (e) => {
      if (e.target.closest && e.target.closest('.preview-tooltip')) {
        hideTooltip();
      }
    },
    true
  );
}
