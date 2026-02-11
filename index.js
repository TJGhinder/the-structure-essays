// index.js
import { POSTS, initBacklinks } from './backlinks.js';

function formatMonthYear(isoDate) {
  // isoDate: "YYYY-MM-DD"
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getSiteUrl() {
  // Prefer your canonical link if you set it correctly
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) return canonical.replace(/\/$/, '');
  return window.location.origin;
}

function renderIndexList() {
  const list = document.getElementById('post-list');
  if (!list) return;

  const postsArray = Object.entries(POSTS).map(([path, post]) => ({
    path,
    ...post,
  }));

  // Sort newest first if datePublished exists
  postsArray.sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''));

  list.innerHTML = postsArray
    .map((p) => {
      const href = p.path; // your keys already include trailing slash
      const dateLabel = p.datePublished ? formatMonthYear(p.datePublished) : '';
      return `
        <li>
          <a href="${href}" class="post-link">
            <h2>${p.title}</h2>
            <span class="post-sub">${p.sub ?? ''}</span>
            ${dateLabel ? `<span class="post-date">${dateLabel}</span>` : ''}
          </a>
        </li>
      `;
    })
    .join('');
}

function injectJsonLd() {
  const siteUrl = getSiteUrl();

  const blogPost = Object.entries(POSTS)
    .map(([path, post]) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.sub || post.excerpt || '',
      url: `${siteUrl}${path}`,
      ...(post.datePublished ? { datePublished: post.datePublished } : {}),
    }))
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Structure',
    description: 'Slow essays on philosophy, morality, and governance.',
    url: `${siteUrl}/`,
    blogPost,
  };

  // Replace existing structured-data script if present
  const existing = document.getElementById('structured-data');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'structured-data';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  renderIndexList();
  injectJsonLd();
  initBacklinks(); // keeps your preview tooltips working sitewide
});
