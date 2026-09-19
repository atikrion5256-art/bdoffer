const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const MAX_BODY_BYTES = 32 * 1024;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();
const ALLOWED_ORIGINS = new Set(['https://atik336666-sketch.github.io', 'http://localhost:8080', 'http://127.0.0.1:8080']);
const DEFAULT_LINKS = [
  { linkKey: 'banglalink', label: 'Banglalink', url: 'https://www.banglalink.net/', isActive: true, sortOrder: 10 },
  { linkKey: 'gp', label: 'Grameenphone', url: 'https://www.grameenphone.com/', isActive: true, sortOrder: 20 },
  { linkKey: 'robi', label: 'Robi', url: 'https://www.robi.com.bd/', isActive: true, sortOrder: 30 },
  { linkKey: 'airtel', label: 'Airtel', url: 'https://www.bd.airtel.com/', isActive: true, sortOrder: 40 },
];

function headers(res, origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); res.setHeader('Expires', '0'); res.setHeader('Vary', 'Origin, Authorization');
  if (allowed) { res.setHeader('Access-Control-Allow-Origin', allowed); res.setHeader('Access-Control-Allow-Credentials', 'true'); }
}
function json(res, status, payload, origin) { headers(res, origin); res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(payload)); }
function validText(value, max) { return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max; }
function validHttps(value) { try { const url = new URL(value); return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password; } catch { return false; } }
async function readBody(req) {
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > MAX_BODY_BYTES) throw new Error('payload_too_large'); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new Error('invalid_json'); }
}
async function readJson(file, fallback) { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; } }
async function writeJson(file, value) { await fs.mkdir(DATA_DIR, { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 }); }
async function getLinks() { const links = await readJson(LINKS_FILE, DEFAULT_LINKS); if (!Array.isArray(links)) throw new Error('invalid_links_store'); return links; }
function tokenFrom(req) { const value = req.headers.authorization || ''; return value.startsWith('Bearer ') ? value.slice(7) : ''; }
function authenticated(req) { const token = tokenFrom(req); const session = sessions.get(token); if (!session || session.expiresAt < Date.now()) { if (session) sessions.delete(token); return null; } return session; }
function requireAdmin(req, res, origin) { const session = authenticated(req); if (!session) { json(res, 401, { ok: false, error: 'unauthorized' }, origin); return null; } return session; }
function normalizeLink(input, fallback) { return { linkKey: input.linkKey ?? input.link_key ?? fallback.linkKey, label: input.label ?? input.display_label ?? fallback.label, url: input.url ?? input.link_url ?? fallback.url, isActive: input.isActive ?? input.is_active ?? fallback.isActive, sortOrder: input.sortOrder ?? input.sort_order ?? fallback.sortOrder }; }
async function serveStatic(res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(ROOT, `.${requested}`);
  if (!filePath.startsWith(ROOT + path.sep)) { res.statusCode = 404; return res.end('Not found'); }
  try { const body = await fs.readFile(filePath); const ext = path.extname(filePath); const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }; res.statusCode = 200; res.setHeader('Content-Type', types[ext] || 'application/octet-stream'); res.setHeader('Cache-Control', ext === '.html' ? 'no-store' : 'public, max-age=3600'); res.end(body); } catch (error) { res.statusCode = error.code === 'ENOENT' ? 404 : 500; res.end(error.code === 'ENOENT' ? 'Not found' : 'Internal server error'); }
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin; const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/') && req.method === 'OPTIONS') { headers(res, origin); res.statusCode = 204; res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); return res.end(); }
  try {
    if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true, service: 'bdoffer-admin-inquiries' }, origin);
    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return json(res, 503, { ok: false, error: 'admin_not_configured' }, origin);
      const body = await readBody(req); if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) return json(res, 401, { ok: false, error: 'invalid_credentials' }, origin);
      const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, { username: ADMIN_USERNAME, expiresAt: Date.now() + SESSION_TTL_MS });
      return json(res, 200, { ok: true, token }, origin);
    }
    if (url.pathname === '/api/admin/session' && req.method === 'GET') return json(res, 200, { authenticated: Boolean(authenticated(req)) }, origin);
    if (url.pathname === '/api/admin/logout' && req.method === 'POST') { sessions.delete(tokenFrom(req)); return json(res, 200, { ok: true }, origin); }
    if (url.pathname === '/api/public-links' && req.method === 'GET') { const links = await getLinks(); return json(res, 200, { links: Object.fromEntries(links.filter(link => link.isActive).map(link => [link.linkKey, { url: link.url, label: link.label }])) }, origin); }
    if (url.pathname === '/api/admin/links' && req.method === 'GET') { if (!requireAdmin(req, res, origin)) return; return json(res, 200, { links: await getLinks() }, origin); }
    if (url.pathname === '/api/admin/links' && req.method === 'POST') {
      if (!requireAdmin(req, res, origin)) return;
      const body = await readBody(req); const links = await getLinks();
      const record = normalizeLink(body, { linkKey: '', label: '', url: '', isActive: true, sortOrder: 999 });
      if (!/^[a-z0-9_-]{2,50}$/.test(record.linkKey) || links.some(link => link.linkKey === record.linkKey) || !validText(record.label, 100) || !validHttps(record.url) || typeof record.isActive !== 'boolean' || !Number.isInteger(record.sortOrder)) return json(res, 400, { ok: false, error: 'invalid_or_duplicate_link' }, origin);
      links.push(record); links.sort((a, b) => a.sortOrder - b.sortOrder); await writeJson(LINKS_FILE, links); return json(res, 201, record, origin);
    }
    const linkMatch = url.pathname.match(/^\/api\/admin\/links\/([^/]+)$/);
    if (linkMatch && req.method === 'PUT') {
      if (!requireAdmin(req, res, origin)) return; const key = decodeURIComponent(linkMatch[1]); const body = await readBody(req); const links = await getLinks(); const index = links.findIndex(link => link.linkKey === key); if (index < 0) return json(res, 404, { ok: false, error: 'link_not_found' }, origin);
      const record = normalizeLink(body, links[index]); if (record.linkKey !== key || !validText(record.label, 100) || !validHttps(record.url) || typeof record.isActive !== 'boolean' || !Number.isInteger(record.sortOrder)) return json(res, 400, { ok: false, error: 'invalid_link' }, origin);
      links[index] = record; await writeJson(LINKS_FILE, links); return json(res, 200, record, origin);
    }
    if (linkMatch && req.method === 'DELETE') {
      if (!requireAdmin(req, res, origin)) return;
      const key = decodeURIComponent(linkMatch[1]); const links = await getLinks(); const next = links.filter(link => link.linkKey !== key);
      if (next.length === links.length) return json(res, 404, { ok: false, error: 'link_not_found' }, origin);
      await writeJson(LINKS_FILE, next); return json(res, 200, { ok: true, deleted: key }, origin);
    }
    if (url.pathname === '/api/admin/inquiries' && req.method === 'GET') { if (!requireAdmin(req, res, origin)) return; const inquiries = await readJson(INQUIRIES_FILE, []); return json(res, 200, { inquiries: Array.isArray(inquiries) ? inquiries.slice().reverse() : [] }, origin); }
    if (url.pathname === '/api/inquiries' && req.method === 'POST') {
      const body = await readBody(req); const record = { id: crypto.randomUUID(), name: String(body.name || '').trim(), contact: String(body.contact || '').trim(), topic: String(body.topic || '').trim(), message: String(body.message || '').trim(), createdAt: new Date().toISOString() };
      if (!validText(record.name, 80) || !validText(record.contact, 120) || !validText(record.topic, 80) || !validText(record.message, 500)) return json(res, 400, { ok: false, error: 'invalid_input', message: 'Please provide valid inquiry details.' }, origin);
      const inquiries = await readJson(INQUIRIES_FILE, []); inquiries.push(record); await writeJson(INQUIRIES_FILE, inquiries); return json(res, 201, { ok: true, inquiryId: record.id, message: 'Inquiry received.' }, origin);
    }
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(res, url.pathname);
    return json(res, 404, { ok: false, error: 'not_found' }, origin);
  } catch (error) { const client = ['invalid_json', 'payload_too_large'].includes(error.message); return json(res, client ? 400 : 500, { ok: false, error: client ? error.message : 'server_error' }, origin); }
});
server.listen(PORT, HOST, () => console.log(`bdoffer site listening on http://${HOST}:${PORT}`));
