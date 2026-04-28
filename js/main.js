/* ============================================================
   MAIN.JS — Navigation, Cart, Toast Notifications
   ============================================================ */

/* ─── NAVIGATION ─────────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.nav__mobile');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu toggle
  burger?.addEventListener('click', () => {
    mobileNav?.classList.toggle('open');
    const isOpen = mobileNav?.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─── CART ───────────────────────────────────────────────────── */
const CART_KEY = 'mandala_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(painting) {
  const cart = getCart();
  // Each original is 1-of-1, so only allow once
  if (cart.find(item => item.id === painting.id)) {
    showToast('This painting is already in your cart');
    return;
  }
  cart.push({ ...painting, addedAt: Date.now() });
  saveCart(cart);
  updateCartCount();
  renderCartItems();
  showToast(`"${painting.title}" added to cart`);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCartItems();
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.dataset.count = count;
  });
}

function renderCartItems() {
  const cartItemsEl = document.querySelector('.cart-items');
  if (!cartItemsEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">◯</div>
        <p>Your cart is empty.<br>Add a painting you love.</p>
      </div>`;
    updateCartFooter(0);
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__img">
        <div class="cart-item__img-bg" style="background:${item.gradient}"></div>
      </div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.title}</div>
        <div class="cart-item__meta">${item.size} · ${item.medium}</div>
        <span class="cart-item__remove" data-id="${item.id}">Remove</span>
      </div>
      <div class="cart-item__price">£${item.price}</div>
    </div>
  `).join('');

  // Remove listeners
  cartItemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  updateCartFooter(total);
}

function updateCartFooter(total) {
  const totalEl = document.querySelector('.cart-total__amount');
  const subtotalEl = document.querySelector('.cart-subtotal span:last-child');
  if (totalEl) totalEl.textContent = `£${total}`;
  if (subtotalEl) subtotalEl.textContent = `£${total}`;
}

function initCart() {
  const overlay = document.querySelector('.cart-overlay');
  const sidebar = document.querySelector('.cart-sidebar');
  const closeBtn = document.querySelector('.cart-close-btn');

  function openCart() {
    overlay?.classList.add('open');
    sidebar?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    overlay?.classList.remove('open');
    sidebar?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.nav__cart-btn, [data-open-cart]').forEach(btn => {
    btn.addEventListener('click', openCart);
  });

  overlay?.addEventListener('click', closeCart);
  closeBtn?.addEventListener('click', closeCart);

  updateCartCount();
  renderCartItems();
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

/* ─── NEWSLETTER FORM ────────────────────────────────────────── */
function initNewsletter() {
  const form = document.querySelector('.newsletter__form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter__input');
    if (input?.value) {
      showToast('You\'re on the list — thank you!');
      input.value = '';
    }
  });
}

/* ─── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCart();
  initNewsletter();
});

// Expose globally for inline handlers
window.addToCart = addToCart;
window.showToast = showToast;
