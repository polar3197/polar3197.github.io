// Shared helpers for the admin API. Files starting with "_" are not deployed as endpoints.
//
// Required Vercel environment variables:
//   ADMIN_PASSWORD  the password typed after "/admin"
//   GITHUB_TOKEN    fine-grained token with Contents read/write on this repo only
import crypto from "node:crypto";

const REPO = "polar3197/polar3197.github.io";
const BRANCH = "main";
const COOKIE = "admin_session";
const SESSION_HOURS = 12;

// Only content files can be read or written through the admin API.
const EDITABLE = [
  /^_includes\/bio\.md$/,
  /^_data\/(projects|paintings)\.yml$/,
  /^_journal\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/,
];

export const isEditable = (path) => typeof path === "string" && EDITABLE.some((re) => re.test(path));

export const configured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.GITHUB_TOKEN);

const sha256 = (value) => crypto.createHash("sha256").update(value).digest();

export function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export const passwordMatches = (password) =>
  safeEqual(sha256(String(password)), sha256(process.env.ADMIN_PASSWORD));

// Sessions are "<expiry>.<signature>". The signing key comes from the secrets themselves,
// so changing the password (or token) logs every session out.
const sign = (value) =>
  crypto
    .createHmac("sha256", sha256(`session:${process.env.ADMIN_PASSWORD}:${process.env.GITHUB_TOKEN}`))
    .update(value)
    .digest("base64url");

export function sessionCookie() {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return `${COOKIE}=${expires}.${sign(expires)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
}

export const clearedCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isAdmin(req) {
  if (!configured()) return false;
  const pair = (req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!pair) return false;
  const [expires, signature] = pair.slice(COOKIE.length + 1).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

// Writes must come from this site (cookies are SameSite=Strict too; this is belt and braces).
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

async function github(path, init = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });
}

const contentsPath = (path) => `contents/${path.split("/").map(encodeURIComponent).join("/")}`;

export async function readFile(path) {
  const res = await github(`${contentsPath(path)}?ref=${BRANCH}`);
  if (res.status === 404) return { content: "", sha: null };
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const json = await res.json();
  return { content: Buffer.from(json.content, "base64").toString("utf8"), sha: json.sha };
}

// sha = the version that was loaded (null to create a new file). GitHub rejects the write
// if the file has changed since, which we report as a conflict instead of overwriting.
export async function writeFile(path, content, sha, message) {
  const res = await github(contentsPath(path), {
    method: "PUT",
    body: JSON.stringify({
      message,
      branch: BRANCH,
      content: Buffer.from(content, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (res.status === 409 || res.status === 422) return { conflict: true };
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
  const json = await res.json();
  return { commit: json.commit.sha };
}
