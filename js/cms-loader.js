/* ============================================================
   CMS-LOADER.JS — Loads site-wide content from data/site.json
   Runs on every page to populate footer, brand, and social links.
   ============================================================ */

(function () {
  // Resolve correct path to data/ regardless of current page directory
  const base = document.querySelector('base')?.href || '';

  fetch('data/site.json')
    .then(r => r.json())
    .then(d => {
      // Footer tagline
      document.querySelectorAll('.footer__tagline').forEach(el => {
        el.textContent = d.footer_tagline;
      });

      // Footer copyright & credit
      const bottom = document.querySelector('.footer__bottom');
      if (bottom) {
        const spans = bottom.querySelectorAll('span');
        if (spans[0]) spans[0].textContent = d.footer_copyright;
        if (spans[1]) spans[1].textContent = d.footer_credit;
      }

      // Instagram links & handles — update all anchors pointing to instagram
      document.querySelectorAll('a.footer__social-link, a.contact-social-btn, a.instagram-strip__link').forEach(el => {
        el.href = d.instagram_url;
      });

      // Instagram handle text spans
      document.querySelectorAll('.instagram-strip__handle').forEach(el => {
        el.textContent = d.instagram_handle;
      });

      // Contact social button text
      document.querySelectorAll('a.contact-social-btn').forEach(el => {
        el.textContent = 'Instagram ' + d.instagram_handle;
      });
    })
    .catch(() => {}); // Fail silently — fallback to hardcoded HTML
}());
