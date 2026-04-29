/* ============================================================
   PAINTING.JS — Product page loader, carousel, related paintings
   URL: painting.html?id=3
   ============================================================ */

let currentSlide = 0;
let totalSlides = 0;

/* ─── CAROUSEL ────────────────────────────────────────────── */
function goToSlide(index) {
  const track = document.querySelector('.carousel__track');
  if (!track) return;
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel__dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function initCarousel(images) {
  totalSlides = images.length;
  if (totalSlides <= 1) return;

  document.querySelector('.carousel__arrow--prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.querySelector('.carousel__arrow--next')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Dot clicks
  document.querySelectorAll('.carousel__dot').forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  const viewport = document.querySelector('.carousel__viewport');
  viewport?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goToSlide(currentSlide + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

/* ─── GALLERY RENDER ──────────────────────────────────────── */
function buildGallery(painting) {
  const allImages = [];
  if (painting.image) allImages.push(painting.image);
  if (Array.isArray(painting.images)) allImages.push(...painting.images.filter(Boolean));

  if (allImages.length === 0) {
    // Gradient fallback
    return `
      <div class="carousel__viewport">
        <div class="carousel__track">
          <div class="carousel__slide carousel__slide--gradient" style="background:${painting.gradient}"></div>
        </div>
      </div>`;
  }

  const slides = allImages.map(src => `
    <div class="carousel__slide">
      <img src="${src}" alt="${painting.title}" loading="lazy">
    </div>`).join('');

  const arrows = allImages.length > 1 ? `
    <button class="carousel__arrow carousel__arrow--prev" aria-label="Previous">&#8249;</button>
    <button class="carousel__arrow carousel__arrow--next" aria-label="Next">&#8250;</button>` : '';

  const dots = allImages.length > 1
    ? `<div class="carousel__dots">${allImages.map((_, i) => `<button class="carousel__dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>`
    : '';

  return `
    <div class="carousel">
      <div class="carousel__viewport">
        <div class="carousel__track">${slides}</div>
      </div>
      ${arrows}
    </div>
    ${dots}`;
}

/* ─── PRODUCT DETAIL RENDER ───────────────────────────────── */
function buildProductDetail(p) {
  const statusTag = p.available
    ? `<span class="tag tag--new">Available</span>`
    : `<span class="tag tag--sold">Sold</span>`;

  const cartBtn = p.available
    ? `<button class="btn btn-teal product-detail__cart-btn" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Cart</button>`
    : `<button class="btn btn-outline-teal product-detail__cart-btn" onclick="showToast('Commission something similar →')">Commission a Similar Piece</button>`;

  const colorTags = (p.colors || []).map(c =>
    `<span class="product-color-tag">${c}</span>`).join('');

  return `
    <div class="product-detail__gallery">
      ${buildGallery(p)}
    </div>
    <div class="product-detail__info">
      <div class="product-detail__tags">
        <span class="tag tag--collection">${p.collection}</span>
        ${statusTag}
      </div>
      <h1 class="product-detail__title">${p.title}</h1>
      <p class="product-detail__subtitle">${p.subtitle}</p>
      <div class="product-detail__price">£${p.price}</div>
      <hr class="product-detail__divider">
      <div class="product-detail__meta-grid">
        <div class="product-detail__meta-item">
          <div class="product-detail__meta-label">Size</div>
          <div class="product-detail__meta-value">${p.size}</div>
        </div>
        <div class="product-detail__meta-item">
          <div class="product-detail__meta-label">Medium</div>
          <div class="product-detail__meta-value">${p.medium}</div>
        </div>
      </div>
      ${colorTags ? `<div class="product-detail__colors">${colorTags}</div>` : ''}
      ${cartBtn}
      <hr class="product-detail__divider">
      <p class="product-detail__inspiration-label">About this painting</p>
      <p class="product-detail__inspiration-text">${p.inspiration}</p>
    </div>`;
}

/* ─── RELATED PAINTINGS ───────────────────────────────────── */
function buildRelatedCard(p) {
  const img = p.image
    ? `<img src="${p.image}" alt="${p.title}" class="painting-card__img-photo">`
    : `<div class="painting-card__img-bg" style="background:${p.gradient}"></div>`;

  const tags = [];
  if (p.new && p.available) tags.push(`<span class="tag tag--new">New</span>`);
  if (!p.available) tags.push(`<span class="tag tag--sold">Sold</span>`);
  tags.push(`<span class="tag tag--collection">${p.collection}</span>`);

  const cartBtn = p.available
    ? `<button class="btn btn-teal painting-card__btn" onclick="handleRelatedCart(${p.id})">Add to Cart</button>`
    : `<button class="btn btn-outline-teal painting-card__btn" onclick="showToast('Commission something similar →')">Commission Similar</button>`;

  return `
    <div class="painting-card ${!p.available ? 'painting-card--sold' : ''}" data-id="${p.id}">
      <div class="painting-card__image">
        <a href="painting.html?id=${p.id}" class="painting-card__link">${img}</a>
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

// Store all paintings so related cart buttons work
let _allPaintings = [];
function handleRelatedCart(id) {
  const p = _allPaintings.find(x => x.id === id);
  if (p && p.available) window.addToCart(p);
}
window.handleRelatedCart = handleRelatedCart;

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  const detail = document.getElementById('product-detail');

  let data;
  try {
    const res = await fetch('data/paintings.json');
    data = await res.json();
  } catch {
    detail.innerHTML = `<div class="product-not-found" style="grid-column:1/-1"><p>Could not load painting data.</p><a href="shop.html" class="btn btn-primary" style="margin-top:1rem">Back to Shop</a></div>`;
    return;
  }

  _allPaintings = data.paintings;
  const painting = _allPaintings.find(p => p.id === id);

  if (!painting) {
    detail.innerHTML = `<div class="product-not-found" style="grid-column:1/-1"><h2>Painting not found</h2><p>This painting may have been removed.</p><a href="shop.html" class="btn btn-primary" style="margin-top:1rem">Browse All Paintings</a></div>`;
    return;
  }

  // Update page title and breadcrumb
  document.title = `${painting.title} — Art Vasu`;
  document.getElementById('breadcrumb-title').textContent = painting.title;

  // Render product detail
  detail.innerHTML = buildProductDetail(painting);

  // Init carousel
  const allImages = [];
  if (painting.image) allImages.push(painting.image);
  if (Array.isArray(painting.images)) allImages.push(...painting.images.filter(Boolean));
  initCarousel(allImages);

  // Related paintings
  const related = _allPaintings
    .filter(p => p.collection === painting.collection && p.id !== painting.id)
    .slice(0, 4);

  if (related.length > 0) {
    document.getElementById('related-grid').innerHTML = related.map(buildRelatedCard).join('');
    document.getElementById('related-section').style.display = '';
  }
});
