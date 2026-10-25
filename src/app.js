(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Header: scrolled state + mobile menu
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const menu = document.querySelector('.menu');
  const nav = document.getElementById('site-nav');
  const setMenu = (open) => { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // Scroll reveals (transform/opacity only)
  const targets = $$('[data-reveal],.rail');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));

  // Product tour tabs
  $$('[data-tabs]').forEach((root) => {
    const tabs = $$('[role=tab]', root);
    const panels = $$('[role=tabpanel]', root);
    const select = (i, focus) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach((p, j) => p.classList.toggle('on', i === j));
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    select(0);
  });

  // FAQ: keep one open at a time within a group
  $$('.faq').forEach((g) => g.addEventListener('toggle', (e) => {
    if (e.target.open) $$('details', g).forEach((d) => { if (d !== e.target) d.open = false; });
  }, true));

  // Enquiry forms
  const renderTime = Date.now();
  $$('form[data-enquiry]').forEach((form) => {
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type=submit]');
    const label = btn.querySelector('.btn-label');
    const fail = (t) => { msg.textContent = t; msg.className = 'form-msg bad'; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      $$('.err', form).forEach((n) => n.remove());
      $$('[aria-invalid]', form).forEach((n) => n.removeAttribute('aria-invalid'));
      msg.className = 'form-msg'; msg.textContent = '';
      let first = null;
      $$('[required]', form).forEach((f) => {
        const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim()));
        if (!bad) return;
        f.setAttribute('aria-invalid', 'true');
        const s = document.createElement('span');
        s.className = 'err'; s.id = f.id + '-err';
        s.textContent = f.type === 'email' ? 'Enter a valid work email address.' : 'This field is required.';
        f.setAttribute('aria-describedby', s.id);
        f.parentNode.append(s);
        first = first || f;
      });
      if (first) { first.focus(); return; }
      form.elements.ts.value = String(Date.now() - renderTime);
      btn.disabled = true; label.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          form.reset();
          msg.textContent = 'Thank you. Your request has reached the OrgVia team and we will reply to your work email.';
          msg.className = 'form-msg ok';
        } else if (res.status === 429) fail('Too many requests from this connection. Please try again in a few minutes.');
        else if (res.status === 503) fail('Enquiries are not being accepted online right now, so your message was not sent. Please try again later.');
        else fail(data.error || 'Your request could not be sent. Please check the details and try again.');
      } catch {
        fail('We could not reach the server, so your message was not sent. Please check your connection and try again.');
      } finally { btn.disabled = false; label.textContent = 'Send request'; }
    });
  });
})();
