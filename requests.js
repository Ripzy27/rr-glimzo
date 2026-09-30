(() => {
  'use strict';
  const panels = [...document.querySelectorAll('.request-panel')];
  const forms = [...document.querySelectorAll('form[data-kind]')];

  function openRequest(kind, focus = false) {
    const panel = document.getElementById(`${kind}-request`);
    if (!panel) return;
    panels.forEach(item => { item.open = item === panel; });
    if (focus) panel.querySelector('summary').focus({ preventScroll: true });
  }

  panels.forEach(panel => panel.addEventListener('toggle', () => {
    if (panel.open) panels.forEach(other => { if (other !== panel) other.open = false; });
  }));

  document.querySelectorAll('[data-request]').forEach(link => {
    link.addEventListener('click', () => {
      openRequest(link.dataset.request, true);
      const target = link.dataset.service
        ? document.getElementById('domestic-service')
        : link.dataset.sector ? document.getElementById('commercial-sector') : null;
      if (target) {
        target.value = link.dataset.service || link.dataset.sector;
        target.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  function followHash() {
    const kind = location.hash === '#commercial-request' ? 'commercial'
      : location.hash === '#domestic-request' ? 'domestic' : null;
    if (kind) openRequest(kind);
  }
  window.addEventListener('hashchange', followHash);
  followHash();

  function requestText(form) {
    const data = new FormData(form);
    const get = key => String(data.get(key) || '').trim();
    const commercial = form.dataset.kind === 'commercial';
    const lines = [commercial ? 'R&R Glimzo — Commercial site visit request' : 'R&R Glimzo — Domestic quote request', ''];
    const fields = [
      ['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'],
      ...(commercial ? [['Organisation', 'organisation'], ['Building type', 'sector'], ['Approximate size', 'size']]
        : [['Service', 'service'], ['Property type', 'property'], ['Bedrooms', 'bedrooms']]),
      ['Town or postcode', 'location'], ['Cleaning frequency', 'frequency'],
      [commercial ? 'Preferred visit date' : 'Preferred cleaning date', 'date'],
      ...(commercial ? [['Preferred visit time', 'visit_time']] : []),
      ['Details', 'details']
    ];
    fields.forEach(([label, key]) => {
      let value = get(key);
      if (key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) value = value.split('-').reverse().join('/');
      if (value) lines.push(`${label}: ${value}`);
    });
    lines.push('', 'Please contact me to discuss this request. Dates are subject to confirmation.');
    return lines.join('\n');
  }

  forms.forEach(form => {
    const result = form.querySelector('.request-result');
    const summary = form.querySelector('.request-summary');
    const status = form.querySelector('.copy-status');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      summary.value = requestText(form);
      result.hidden = false;
      status.textContent = 'Request prepared on this device. It has not been sent.';
      summary.focus({ preventScroll: true });
      result.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    });
    ['input', 'change'].forEach(type => form.addEventListener(type, event => {
      if (event.target === summary) return;
      result.hidden = true;
      summary.value = '';
      status.textContent = '';
    }));
    form.querySelector('.copy-request').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(summary.value);
        status.textContent = 'Request copied. Paste it into your message to R&R Glimzo. Nothing has been sent automatically.';
      } catch {
        summary.focus();
        summary.select();
        status.textContent = 'Automatic copying is unavailable. Your request is selected; use your device’s Copy command.';
      }
    });
    form.querySelectorAll('[data-enable-on-load]').forEach(control => { control.disabled = false; });
  });
})();
