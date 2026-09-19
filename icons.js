/* Inline SVG icons + operator marks.
   OPERATOR MARKS ARE NEUTRAL PLACEHOLDERS drawn to match the reference
   composition. Swap `logo()` output for the official brand SVGs when supplied. */

const svg = (vb, body, extra = '') =>
  `<svg viewBox="${vb}" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;
const stroke = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

const icons = {
  bolt: svg('0 0 24 24', '<path d="M13.6 1.8 4.6 13.6h6.1l-1.4 8.6 9.6-12.6h-6.2z"/>'),
  shield: svg('0 0 24 24', '<path d="M12 1.9 4.2 5v6.2c0 4.8 3.2 8.7 7.8 10.9 4.6-2.2 7.8-6.1 7.8-10.9V5z"/><path d="m8.4 12 2.5 2.5 4.7-5.1" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  users: svg('0 0 24 24', '<circle cx="9" cy="7.6" r="3.6"/><path d="M2 20.2c0-3.9 3-6.4 7-6.4s7 2.5 7 6.4z"/><circle cx="17.4" cy="8.6" r="2.8" opacity=".7"/><path d="M16.6 13.4c3.2.1 5.4 2.1 5.4 5.6h-4.3c0-2.1-.3-3.8-1.1-5.6z" opacity=".7"/>'),
  check: svg('0 0 24 24', '<circle cx="12" cy="12" r="11" fill="#12a150"/><path d="m6.8 12.4 3.4 3.4 7-7.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  checkPlain: svg('0 0 24 24', `<path d="m5 12.6 4.4 4.4L19 7.4" ${stroke} stroke-width="3"/>`),
  arrow: svg('0 0 24 24', `<path d="M4.5 12h14m-5.5-6 6 6-6 6" ${stroke} stroke-width="2.6"/>`),
  clock: svg('0 0 24 24', `<circle cx="12" cy="12" r="9.2" ${stroke} stroke-width="2.2"/><path d="M12 6.6V12l3.6 2.2" ${stroke} stroke-width="2.2"/>`),
  thumb: svg('0 0 24 24', '<path d="M2.6 10.6h3.9V21H3.6a1 1 0 0 1-1-1z" fill="#f0a500"/><path d="M8 10.8 11.4 3.4a1.9 1.9 0 0 1 3.5 1.3l-.9 4.4h5a2.1 2.1 0 0 1 2.1 2.6l-1.5 7.2a2.1 2.1 0 0 1-2.1 1.7H8z" fill="#ffc928" stroke="#e39b00" stroke-width="1" stroke-linejoin="round"/><path d="M10.6 12.2h6.2" stroke="#fff3b0" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>'),
  grid: svg('0 0 24 24', '<rect x="3" y="3" width="4.6" height="4.6" rx="1.2"/><rect x="9.7" y="3" width="4.6" height="4.6" rx="1.2"/><rect x="16.4" y="3" width="4.6" height="4.6" rx="1.2"/><rect x="3" y="9.7" width="4.6" height="4.6" rx="1.2"/><rect x="9.7" y="9.7" width="4.6" height="4.6" rx="1.2"/><rect x="16.4" y="9.7" width="4.6" height="4.6" rx="1.2"/><rect x="3" y="16.4" width="4.6" height="4.6" rx="1.2"/><rect x="9.7" y="16.4" width="4.6" height="4.6" rx="1.2"/><rect x="16.4" y="16.4" width="4.6" height="4.6" rx="1.2"/>'),
  help: svg('0 0 24 24', '<circle cx="12" cy="12" r="10.5"/><path d="M9.1 9.4a3 3 0 1 1 4.3 2.7c-.9.5-1.4 1-1.4 2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.3" fill="#fff"/>'),
  chat: svg('0 0 24 24', '<path d="M4.2 3.5h15.6a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2H11l-5.4 4v-4H4.2a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z"/><circle cx="7.6" cy="10.3" r="1.4" fill="#fff"/><circle cx="12" cy="10.3" r="1.4" fill="#fff"/><circle cx="16.4" cy="10.3" r="1.4" fill="#fff"/>'),
  headset: svg('0 0 24 24', `<path d="M4.2 14.5v-2.6a7.8 7.8 0 0 1 15.6 0v2.6" ${stroke} stroke-width="2.4"/><rect x="2.6" y="13" width="4.4" height="6.8" rx="2"/><rect x="17" y="13" width="4.4" height="6.8" rx="2"/><path d="M19.2 19.8c0 1.4-1.6 2.2-4 2.2h-2" ${stroke} stroke-width="2"/>`),
  gift: svg('0 0 64 64', '<rect x="9" y="26" width="46" height="9" rx="2.5" fill="#ff8a00"/><rect x="12" y="35" width="40" height="21" rx="3" fill="#ff6a00"/><rect x="28" y="26" width="8" height="30" fill="#ffd33d"/><path d="M32 26c-6-1-13-3-13-9 0-4 3.5-6 7-5 4 1.200 6 8 6 14zM32 26c6-1 13-3 13-9 0-4-3.500-6-7-5-4 1.200-6 8-6 14z" fill="#ffb02e"/><rect x="9" y="26" width="46" height="4" rx="2" fill="#fff" opacity=".22"/>'),
  antenna: svg('0 0 32 32', `<path d="M16 13.2 11 28h10z" fill="currentColor"/><circle cx="16" cy="10.6" r="2.4" fill="currentColor"/><path d="M10.7 5.7a7.6 7.6 0 0 0 0 9.8M21.3 5.7a7.6 7.6 0 0 1 0 9.8M7.3 2.8a12.2 12.2 0 0 0 0 15.6M24.7 2.8a12.2 12.2 0 0 1 0 15.6" ${stroke} stroke-width="1.9"/>`),
  phone: svg('0 0 24 24', '<path d="M6.9 2.6 9.5 3c.6.1 1 .6 1.1 1.2l.5 3a1.5 1.5 0 0 1-.7 1.5l-1.700 1.100a12.500 12.500 0 0 0 5.400 5.400l1.100-1.700a1.500 1.500 0 0 1 1.500-.7l3 .5c.6.1 1.100.5 1.200 1.100l.4 2.600c.1 1-.6 1.900-1.600 2A17.500 17.500 0 0 1 3.800 4.500c.1-1 1-1.800 2-1.700z"/>'),
  wifi: svg('0 0 32 32', `<path d="M3.6 12.400a17.500 17.500 0 0 1 24.800 0M8.200 17.200a11 11 0 0 1 15.600 0M12.600 21.800a4.700 4.700 0 0 1 6.800 0" ${stroke} stroke-width="3"/><circle cx="16" cy="26" r="2.300"/>`),
  home: svg('0 0 24 24', '<path d="M12 2.800 2.400 11h2.500v9.200h5v-6h4.200v6h5V11h2.500z"/>'),
  tag: svg('0 0 24 24', '<path d="M3.200 4.600h9l8.800 8.800-7.600 7.600-8.800-8.800z" opacity=".9"/><circle cx="7.600" cy="8.800" r="1.500" fill="#fff"/>'),
  wallet: svg('0 0 24 24', '<path d="M4 6.200h13.800v3.400H20a1.500 1.500 0 0 1 1.500 1.500v7.300A1.500 1.500 0 0 1 20 20H5a2.500 2.500 0 0 1-2.500-2.500V7.700A1.500 1.500 0 0 1 4 6.200z" opacity=".9"/><path d="M4.500 3.800 16 2.600v3H4.500z"/>'),
  info: svg('0 0 24 24', '<circle cx="12" cy="12" r="9.800" opacity=".9"/><path d="M12 10.800v6" stroke="#fff" stroke-width="2.400" stroke-linecap="round"/><circle cx="12" cy="7.400" r="1.400" fill="#fff"/>'),
};

/* ---------- Operator marks (placeholders) ---------- */
function logo(id, tone = 'color') {
  const c = { color: null, light: '#fff', dark: '#3d1a00' }[tone];
  const F = 'font-family="var(--font-display)" font-weight="800" text-anchor="middle"';
  const open = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">';
  const marks = {
    banglalink: `${open}<path d="M32 56C9 40 5 25 13 15c7-8 16-4 19 4 3-8 12-12 19-4 8 10 4 25-19 41z" fill="${c || '#ff6a00'}"/>${c ? '' : '<path d="M22 24c7-2 12 2 10 8-1.500 4.500-6 5.500-9 3 6 1 11-1 12-6" fill="none" stroke="#fff" stroke-width="4.500" stroke-linecap="round"/>'}</svg>`,
    gp: `${open}<path d="M8 36C14 18 30 10 54 14c-8 3-13 9-14 17 6-5 12-6 18-4C52 42 40 52 26 52 14 52 6 46 8 36z" fill="${c || '#0a9be0'}"/>${c ? '' : '<path d="M22 32c8-8 18-8 28-4" fill="none" stroke="#fff" stroke-width="3.600" stroke-linecap="round" opacity=".9"/>'}</svg>`,
    robi: tone === 'color'
      ? `${open}<circle cx="32" cy="32" r="30" fill="#e3132f"/><text x="30" y="41" ${F} font-size="26" fill="#fff">রবি</text><path d="M44 12l10 4-4 10z" fill="#ffd33d"/></svg>`
      : `${open}<circle cx="32" cy="34" r="20" fill="none" stroke="${c}" stroke-width="7"/><path d="M40 6l14 5-5 14z" fill="#ffd33d"/></svg>`,
    airtel: `${open}<text x="32" y="43" ${F} font-size="21" letter-spacing="-.5" fill="${c || '#e4002b'}" style="font-family:var(--font-body);font-weight:700">airtel</text><path d="M26 22c4-9 15-8 16-1-3-3-9-4-16 1z" fill="${c || '#e4002b'}"/></svg>`,
  };
  return marks[id];
}

module.exports = { icons, logo };
