import { layout } from "../lib/render";
import { getApps } from "../lib/api";
import { canonical, escapeHTML, sanitizeSlug, imageUrl } from "../lib/config";

export async function onRequest(context) {
  try {
    const apps = await getApps();
    const cards = apps.map((app) => {
      const slug = sanitizeSlug(app.slug || "");
      if (!slug) return "";
      const name = app.name || app.title || slug;
      const title = app.title || name;
      const description = app.description || "Explore this app and learn more about its features.";
      const category = app.category || "Featured";
      const icon = app.icon
        ? `<img src="${escapeHTML(imageUrl(app.icon))}" alt="${escapeHTML(name)}" loading="lazy" decoding="async">`
        : `<span class="template-placeholder">${escapeHTML((name || "T").slice(0, 1).toUpperCase())}</span>`;
      const searchText = `${name} ${title} ${description} ${category}`.toLowerCase();
      return `
<article class="template-card" data-category="${escapeHTML(category)}" data-search="${escapeHTML(searchText)}">
  <a class="template-card-link" href="/aplikasi/${encodeURIComponent(slug)}" aria-label="View ${escapeHTML(title)} details">
    <div class="template-preview">
      <div class="preview-top"><span class="preview-brand">${icon}<b>${escapeHTML(name)}</b></span><span class="preview-pill">Explore ↗</span></div>
      <div class="preview-copy"><span class="preview-kicker">${escapeHTML(category)}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div>
      <div class="preview-orb"></div>
      <span class="preview-bottom">DESIGNED FOR YOUR NEXT IDEA</span>
    </div>
    <div class="template-card-body">
      <div class="template-title-row"><span class="template-category">${escapeHTML(category)}</span><span class="template-arrow" aria-hidden="true">↗</span></div>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
      <span class="details-link">View details <span aria-hidden="true">→</span></span>
    </div>
  </a>
</article>`;
    }).filter(Boolean).join("");

    const categorySet = [...new Set(apps.map(app => String(app.category || "Featured").trim()).filter(Boolean))].slice(0, 8);
    const categoryButtons = ["All", ...categorySet].map((category, i) =>
      `<button class="category-chip${i === 0 ? " is-active" : ""}" type="button" data-category-filter="${escapeHTML(category)}" aria-pressed="${i === 0 ? "true" : "false"}">${escapeHTML(category === "All" ? "All templates" : category)}</button>`
    ).join("");

    const cardsHTML = cards || `<div class="empty-state"><span class="empty-icon">✦</span><h3>Your collection starts here</h3><p>Add your first item to the connected data source and it will appear here.</p></div>`;

    return layout({
      title: "Explore Templates & Creative Resources",
      description: "Discover a curated collection of useful apps and creative resources. Browse categories, search the collection, and explore each item in detail.",
      canonical: canonical("/"),
      content: `
<section class="templates-hero">
  <div class="hero-copy">
    <span class="hero-eyebrow"><span class="eyebrow-dot"></span> DISCOVER · EXPLORE · CREATE</span>
    <h1>Find the right tools<br>for your <span class="gradient-text">next big idea.</span></h1>
    <p class="hero-description">A carefully curated collection to inspire your next project. Browse the collection, explore categories, and find something great to build with.</p>
    <form class="template-search" id="templateSearch" role="search">
      <span class="search-symbol" aria-hidden="true">⌕</span>
      <input id="templateSearchInput" type="search" placeholder="Search by name, category, or keyword..." aria-label="Search the collection">
      <button type="submit">Search <span aria-hidden="true">↗</span></button>
    </form>
    <div class="hero-benefits"><span>✦ Curated collection</span><span>◫ Easy to explore</span><span>↗ Direct details</span></div>
  </div>
  <div class="hero-art" aria-hidden="true">
    <div class="hero-art-glow"></div>
    <div class="floating-window window-back"><div class="window-dots"><i></i><i></i><i></i></div><div class="window-skeleton wide"></div><div class="window-skeleton"></div><div class="window-blocks"><i></i><i></i><i></i></div></div>
    <div class="floating-window window-front"><div class="window-head"><span class="window-logo">✦</span><span>COLLECTION / 001</span></div><div class="window-abstract"></div><div class="window-skeleton wide"></div><div class="window-skeleton short"></div><div class="window-cta"></div></div>
    <div class="hero-sticker">Made for<br><b>creators ✳</b></div>
  </div>
</section>

<section class="collection-section" id="templates">
  <div class="collection-heading"><div><span class="section-eyebrow">THE COLLECTION</span><h2>Explore the collection</h2><p>Find something that fits your next project.</p></div><span class="collection-count" id="collectionCount">${apps.length} item${apps.length === 1 ? "" : "s"}</span></div>
  <div class="category-bar" id="categoryBar">${categoryButtons}</div>
  <div class="template-grid" id="templateGrid">${cardsHTML}</div>
  <div class="no-results" id="noResults" hidden><span>⌕</span><h3>No matching items</h3><p>Try another search or choose a different category.</p><button type="button" id="clearFilters">Clear filters</button></div>
</section>

<section class="submit-banner" id="submit-work">
  <div class="submit-banner-mark">✳</div><div class="submit-banner-copy"><span class="section-eyebrow">MADE SOMETHING GREAT?</span><h2>Share your work with the community.</h2><p>Have a resource to contribute? Get in touch and tell us about your project.</p></div>
  <a class="submit-banner-button" href="mailto:hello@framertemplate.example?subject=Submit%20my%20work">Submit your work <span>↗</span></a>
</section>
<script>
(() => {
  const search = document.getElementById('templateSearchInput');
  const form = document.getElementById('templateSearch');
  const cards = [...document.querySelectorAll('.template-card')];
  const chips = [...document.querySelectorAll('[data-category-filter]')];
  const noResults = document.getElementById('noResults');
  const count = document.getElementById('collectionCount');
  let activeCategory = 'All';
  function filter() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const text = (card.dataset.search || '') + ' ' + card.innerText.toLowerCase();
      const categoryMatch = activeCategory === 'All' || category.toLowerCase() === activeCategory.toLowerCase();
      const searchMatch = !query || text.includes(query);
      const visible = categoryMatch && searchMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    noResults.hidden = shown !== 0;
    count.textContent = shown + ' item' + (shown === 1 ? '' : 's');
  }
  chips.forEach(chip => chip.addEventListener('click', () => {
    activeCategory = chip.dataset.categoryFilter;
    chips.forEach(item => {
      const active = item === chip;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filter();
  }));
  search.addEventListener('input', filter);
  form.addEventListener('submit', event => {
    event.preventDefault();
    filter();
    document.getElementById('templates').scrollIntoView({behavior:'smooth', block:'start'});
  });
  document.getElementById('clearFilters').addEventListener('click', () => {
    search.value = '';
    activeCategory = 'All';
    chips.forEach(chip => {
      const active = chip.dataset.categoryFilter === 'All';
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    filter();
  });
})();
</script>`
    });
  } catch (error) {
    return new Response("Unable to load collection. Please try again later.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  }
}
