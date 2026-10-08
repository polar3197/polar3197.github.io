import { clearedCookie } from "./_lib.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  res.setHeader("Set-Cookie", clearedCookie);
  return res.status(200).json({ admin: false });
}
