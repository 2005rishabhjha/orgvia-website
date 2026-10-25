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
  const localApiUrl = ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://localhost:8000' : '';
  const publicApiUrl = String(window.__ORGVIA_PUBLIC_API_URL__ || localApiUrl).replace(/\/+$/, '');
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
        // Local static serving has no /api serverless route.  Development can
        // call FastAPI directly; deployed sites retain the same-origin Vercel
        // function so the ingest key is never exposed to browsers.
        const endpoint = publicApiUrl ? `${publicApiUrl}/public/enquiries` : form.action;
        const values = Object.fromEntries(new FormData(form));
        const selectedPlan = String(values.plan || '').trim().toLowerCase();
        const billing = String(values.billing || '').trim().toLowerCase();
        const employeeCount = Number.parseInt(String(values.employees || ''), 10);
        const pricingContext = Number.isInteger(employeeCount) && employeeCount > 0 && employeeCount <= 1_000_000
          ? `Pricing calculator headcount: ${employeeCount} employees.` : '';
        const payload = {
          name: values.name,
          email: values.email,
          organization: values.organization,
          teamSize: values.teamSize,
          phone: values.phone || null,
          message: [values.message, pricingContext].filter(Boolean).join('\n\n') || null,
          website: values.website || null,
          ts: Number(values.ts),
          kind: values.kind || 'demo',
          ...(selectedPlan ? { selectedPlan } : {}),
          ...(billing ? { billingCycle: billing } : {}),
        };
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          form.reset();
          msg.textContent = 'Your demo request has been received. Our team will contact you using the details provided.';
          msg.className = 'form-msg ok';
        } else if (res.status === 429) fail('Too many requests from this connection. Please try again in a few minutes.');
        else if (res.status === 503) fail('Enquiries are not being accepted online right now, so your message was not sent. Please try again later.');
        else fail(data.error || 'Your request could not be sent. Please check the details and try again.');
      } catch {
        fail('We could not reach the server, so your message was not sent. Please check your connection and try again.');
      } finally { btn.disabled = false; label.textContent = 'Send request'; }
    });
  });
  // Pricing: billing view, headcount estimate and CTA context.
  const pricingPlans = {
    starter: { monthly: 999, annual: 9990, included: 10, additional: 79, name: 'Starter' },
    growth: { monthly: 2499, annual: 24990, included: 50, additional: 59, name: 'Growth' },
    business: { monthly: 4999, annual: 49990, included: 100, additional: 49, name: 'Business' },
  };
  const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const billingButtons = $$('[data-billing]');
  const setBilling = (billing) => {
    billingButtons.forEach((button) => { const current = button.dataset.billing === billing; button.classList.toggle('active', current); button.setAttribute('aria-pressed', String(current)); });
    $$('.price-card[data-plan]').forEach((card) => {
      const plan = pricingPlans[card.dataset.plan]; if (!plan) return;
      card.querySelector('[data-price]').innerHTML = billing === 'annual' ? `${money(plan.annual)}<small>/year</small>` : `${money(plan.monthly)}<small>/month</small>`;
      card.querySelector('[data-price-sub]').textContent = billing === 'annual' ? 'Billed annually' : `${money(plan.annual)} billed annually`;
    });
    $$('[data-pricing-cta]').forEach((cta) => { const url = new URL(cta.href, location.origin); url.searchParams.set('billing', billing); cta.href = url.pathname + url.search; });
    const estimate = document.getElementById('estimate-cta'); if (estimate) { const url = new URL(estimate.href, location.origin); url.searchParams.set('billing', billing); estimate.href = url.pathname + url.search; }
  };
  billingButtons.forEach((button) => button.addEventListener('click', () => setBilling(button.dataset.billing)));
  const count = document.getElementById('employee-count'); const planSelect = document.getElementById('estimate-plan');
  const updateEstimate = () => {
    if (!count || !planSelect) return;
    const plan = pricingPlans[planSelect.value]; const employees = Math.max(1, Number.parseInt(count.value, 10) || 1); const extra = Math.max(0, employees - plan.included); const total = plan.monthly + extra * plan.additional;
    document.getElementById('estimate-total').textContent = money(total);
    document.getElementById('estimate-breakdown').textContent = extra ? `${plan.name}: ${money(plan.monthly)} + ${extra} additional employee${extra === 1 ? '' : 's'} × ${money(plan.additional)} / month.` : `${employees} employees are within the ${plan.name} allowance.`;
    const link = document.getElementById('estimate-cta'); const url = new URL(`/demo/?plan=${planSelect.value}&billing=monthly&employees=${employees}`, location.origin); link.href = url.pathname + url.search;
  };
  if (count && planSelect) { count.addEventListener('input', updateEstimate); planSelect.addEventListener('change', updateEstimate); updateEstimate(); }
  const params = new URLSearchParams(location.search); const selectedPlan = params.get('plan');
  if (selectedPlan && document.querySelector('[data-pricing-context]')) {
    const label = pricingPlans[selectedPlan]?.name || selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1); const billing = params.get('billing') === 'annual' ? 'Annual' : 'Monthly'; const employees = params.get('employees');
    $$('form[data-enquiry]').forEach((form) => {
      form.elements.plan.value = label; form.elements.billing.value = billing; form.elements.employees.value = employees || '';
      const context = form.querySelector('[data-pricing-context]'); context.hidden = false; context.textContent = `Pricing enquiry: ${label} · ${billing}${employees ? ` · ${employees} employees` : ''}.`;
    });
  }
})();
