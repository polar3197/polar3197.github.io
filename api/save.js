import { isAdmin, isEditable, sameOrigin, writeFile } from "./_lib.js";

const MAX_LENGTH = 200_000;

// POST /api/save { path, content, sha } → commits the file to main (Vercel then redeploys).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only." });
  if (!isAdmin(req)) return res.status(401).json({ error: "Not signed in." });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Wrong origin." });

  const { path, content, sha } = req.body ?? {};
  if (!isEditable(path)) return res.status(400).json({ error: "That file can't be edited here." });
  if (typeof content !== "string" || content.length > MAX_LENGTH) {
    return res.status(400).json({ error: "Missing or oversized content." });
  }

  try {
    const result = await writeFile(path, content, sha || null, `${sha ? "Edit" : "Add"} ${path} via admin`);
    if (result.conflict) {
      return res.status(409).json({ error: "This file changed since you opened it (or already exists). Reopen it to get the latest." });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
