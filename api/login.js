import { configured, passwordMatches, sameOrigin, sessionCookie } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  if (!configured()) return res.status(503).json({ error: "Admin isn't set up on this deployment." });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Wrong origin." });

  if (!passwordMatches(req.body?.password ?? "")) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // slows down guessing
    return res.status(401).json({ error: "Wrong password." });
  }

  res.setHeader("Set-Cookie", sessionCookie());
  return res.status(200).json({ admin: true });
}
