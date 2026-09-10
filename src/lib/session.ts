export const SESSION_COOKIE = "farmdirect_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionData {
  sub: string;
  role: string;
  exp: number;
}

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.SESSION_SECRET || "farm-direct-dev-secret-change-in-production";
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(data: Omit<SessionData, "exp">): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({ ...data, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })
    )
  );
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionData | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = await sign(payload);
  if (!safeEqual(encoder.encode(sig), encoder.encode(expected))) {
    return null;
  }

  try {
    const data = JSON.parse(new TextDecoder().decode(toBytes(payload)));
    if (
      typeof data?.sub !== "string" ||
      typeof data?.role !== "string" ||
      typeof data?.exp !== "number"
    ) {
      return null;
    }
    if (Date.now() > data.exp) return null;
    return data as SessionData;
  } catch {
    return null;
  }
}

function toBytes(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}