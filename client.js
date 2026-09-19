/* Progressive enhancement only: countdown + section reveal. */
(() => {
  const bn = (n) => String(n).padStart(2, '0').replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

  /* Countdown */
  const el = document.getElementById('countdown');
  if (el) {
    const q = (u) => el.querySelector(`[data-u="${u}"]`);
    const parsed = Date.parse(el.dataset.deadline || '');
    const end = () => (Number.isNaN(parsed) ? new Date().setHours(23, 59, 59, 999) : parsed);
    const paint = () => {
      const left = Math.max(0, end() - Date.now());
      q('h').textContent = bn(Math.floor(left / 3.6e6));
      q('m').textContent = bn(Math.floor(left / 6e4) % 60);
      q('s').textContent = bn(Math.floor(left / 1e3) % 60);
    };
    paint();
    setInterval(() => { if (!document.hidden) paint(); }, 1000);
  }

  /* Reveal */
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((i) => io.observe(i));
})();
