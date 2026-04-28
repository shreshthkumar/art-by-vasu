/* ============================================================
   SHOP.JS — Product rendering, filtering, sorting
   ============================================================ */

let allPaintings = [];
let activeFilters = { collection: 'all', size: 'all', color: 'all', availability: 'all' };
let activeSort = 'newest';

async function loadPaintings() {
  const res = await fetch('data/paintings.json');
  const data = await res.json();
  allPaintings = data.paintings;
  return allPaintings;
}

function paintingMatchesFilters(p) {
  const { collection, size, color, availability } = activeFilters;
  if (collection !== 'all' && p.collection !== collection) return false;
  if (size !== 'all' && p.sizeCategory !== size) return false;
  if (color !== 'all' && !p.colors.includes(color)) return false;
  if (availability === 'available' && !p.available) return false;
  if (availability === 'sold' && p.available) return false;
  return true;
}

function sortPaintings(paintings) {
  const sorted = [...paintings];
  switch (activeSort) {
    case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'newest':     return sorted.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
    default:           return sorted;
  }
}

function buildPaintingCard(p) {
  const tags = [];
  if (p.new && p.available) tags.push(`<span class="tag tag--new">New</span>`);
  if (!p.available) tags.push(`<span class="tag tag--sold">Sold</span>`);
  tags.push(`<span class="tag tag--collection">${p.collection}</span>`);

  const cartBtn = p.available
    ? `<button class="btn btn-teal painting-card__btn" onclick="handleAddToCart(${p.id})">Add to Cart</button>`
    : `<button class="btn btn-outline-teal painting-card__btn" onclick="showToast('Commission something similar →')">Commission Similar</button>`;

  const imgEl = p.image
    ? `<img src="${p.image}" alt="${p.title}" class="painting-card__img-photo">`
    : `<div class="painting-card__img-bg" style="background:${p.gradient}"></div>`;

  return `
    <div class="painting-card ${!p.available ? 'painting-card--sold' : ''}" data-id="${p.id}">
      <div class="painting-card__image">
        <a href="painting.html?id=${p.id}" class="painting-card__link">${imgEl}</a>
        <div class="painting-card__tags">${tags.join('')}</div>
      </div>
      <div class="painting-card__body">
        <a href="painting.html?id=${p.id}" class="painting-card__title-link">${p.title}</a>
        <div class="painting-card__meta">${p.size} · ${p.medium}</div>
        <div class="painting-card__inspiration">${p.inspiration}</div>
        <div class="painting-card__footer">
          <div class="painting-card__price">£${p.price}</div>
          ${cartBtn}
        </div>
      </div>
    </div>`;
}

function handleAddToCart(id) {
  const painting = allPaintings.find(p => p.id === id);
  if (painting && painting.available) {
    window.addToCart(painting);
  }
}
window.handleAddToCart = handleAddToCart;

function renderGrid(paintings) {
  const grid = document.querySelector('.shop-paintings-grid');
  const countEl = document.querySelector('.shop-results-count');
  if (!grid) return;

  if (paintings.length === 0) {
    grid.innerHTML = `<div class="no-results">
      <p>No paintings match your filters. <button onclick="resetFilters()" style="color:var(--terra);text-decoration:underline;cursor:pointer;">Clear filters</button></p>
    </div>`;
  } else {
    grid.innerHTML = paintings.map(buildPaintingCard).join('');
  }

  if (countEl) countEl.textContent = `Showing ${paintings.length} painting${paintings.length !== 1 ? 's' : ''}`;
}

function applyFiltersAndRender() {
  const filtered = allPaintings.filter(paintingMatchesFilters);
  const sorted = sortPaintings(filtered);
  renderGrid(sorted);
}

function resetFilters() {
  activeFilters = { collection: 'all', size: 'all', color: 'all', availability: 'all' };
  document.querySelectorAll('.filter-select').forEach(s => s.value = 'all');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-availability="all"]')?.classList.add('active');
  applyFiltersAndRender();
}
window.resetFilters = resetFilters;

function populateCollectionFilter() {
  const select = document.querySelector('.filter-select[data-filter="collection"]');
  if (!select) return;
  const collections = [...new Set(allPaintings.map(p => p.collection))];
  collections.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function initShopFilters() {
  // Select filters
  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', () => {
      activeFilters[select.dataset.filter] = select.value;
      applyFiltersAndRender();
    });
  });

  // Availability toggle buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.availability = btn.dataset.availability;
      applyFiltersAndRender();
    });
  });

  // Sort
  document.querySelector('.sort-select')?.addEventListener('change', e => {
    activeSort = e.target.value;
    applyFiltersAndRender();
  });
}

async function initShop() {
  await loadPaintings();
  populateCollectionFilter();
  initShopFilters();
  applyFiltersAndRender();
}

document.addEventListener('DOMContentLoaded', initShop);
