/* ============================================================
   CHECKOUT.JS — Stripe Checkout wiring
   ============================================================ */

function getRegion() {
  const select = document.querySelector('.cart-region');
  return select ? select.value : 'uk';
}

async function reconcileCart() {
  const cart = getCart();
  if (cart.length === 0) return;

  let paintings;
  try {
    const res = await fetch('data/paintings.json');
    paintings = (await res.json()).paintings;
  } catch {
    return; // Reconciliation is best-effort; the server still validates at checkout.
  }

  let changed = false;
  const reconciled = [];

  cart.forEach(item => {
    const live = paintings.find(p => p.id === item.id);
    if (!live || !live.available) {
      changed = true;
      return;
    }
    if (live.price !== item.price || live.title !== item.title || live.image !== item.image) {
      changed = true;
    }
    reconciled.push({ ...item, price: live.price, title: live.title, image: live.image, size: live.size, medium: live.medium });
  });

  if (changed) {
    saveCart(reconciled);
    updateCartCount();
    renderCartItems();
    showToast('Your cart was updated to reflect current availability.');
  }
}

async function handleCheckout(button) {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty.');
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Redirecting…';

  try {
    const res = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: cart.map(item => item.id), region: getRegion() }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = data.url;
      return;
    }

    if (res.status === 409) {
      const soldTitles = [];
      [...(data.unknown || []), ...(data.unavailable || [])].forEach(id => {
        const item = cart.find(c => c.id === id);
        if (item) soldTitles.push(item.title);
        removeFromCart(id);
      });
      showToast(soldTitles.length
        ? `"${soldTitles.join('", "')}" just sold — removed from your cart.`
        : 'Some items in your cart are no longer available.');
    } else if (res.status === 400) {
      showToast('Nothing available to check out.');
    } else {
      showToast('Could not reach checkout — please try again.');
    }
  } catch {
    showToast('Could not reach checkout — please try again.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function initCheckout() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.cart-checkout-btn');
    if (btn) handleCheckout(btn);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('checkout') === 'cancelled') {
    showToast('Checkout cancelled — your cart is saved.');
  }

  reconcileCart();
}

document.addEventListener('DOMContentLoaded', initCheckout);
