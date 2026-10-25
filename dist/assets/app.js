const headerBrand = document.querySelector('.site-header .brand');
if (headerBrand) {
  headerBrand.innerHTML = '<img src="/assets/orgvia-logo.png" alt="OrgVia">';
  const logoStyles = document.createElement('style');
  logoStyles.textContent = '.site-header .brand{width:150px;height:48px;display:block}.site-header .brand img{display:block;width:100%;height:100%;object-fit:contain;object-position:left center}';
  document.head.append(logoStyles);
}
const button = document.querySelector('.menu'); const nav = document.querySelector('.navlinks');
if (button && nav) button.addEventListener('click', () => { const open = nav.classList.toggle('open'); button.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('form[data-enquiry]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); const message = form.querySelector('.form-message'); if (!form.checkValidity()) { form.reportValidity(); message.textContent = 'Please complete the required fields before continuing.'; message.className = 'form-message error'; return; } message.textContent = 'Requests cannot be sent yet: an approved sales-enquiry destination has not been connected.'; message.className = 'form-message error'; }));
