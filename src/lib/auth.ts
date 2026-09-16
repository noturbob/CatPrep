/**
 * Single-user auth. One password in an env var, one signed cookie.
 * There is exactly one user of this app, so a user table, an identity
 * provider and a session store would all be furniture nobody sits on.
 *
 * Web Crypto only, so this runs unchanged in the proxy runtime.
 */

export const SESSION_COOKIE = 'catprep_session';
const TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days — past CAT day

function secret(): string {
  const s = process.env.AUTH_SECRET || process.env.APP_PASSWORD;
  if (!s) throw new Error('AUTH_SECRET or APP_PASSWORD must be set');
  return s;
}

const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Buffer.from(new Uint8Array(sig)).toString('base64url');
}

/** Constant-time compare so a wrong token can't be probed byte by byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp));
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  // Hash both sides first so the compare is length-independent.
  return safeEqual(await hmac(input), await hmac(expected));
}
