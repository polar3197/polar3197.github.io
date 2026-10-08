import { isAdmin, isEditable, readFile } from "./_lib.js";

// GET /api/file?path=<repo path> → the file's current source and version, for the editor.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "GET only." });
  if (!isAdmin(req)) return res.status(401).json({ error: "Not signed in." });
  if (!isEditable(req.query.path)) return res.status(400).json({ error: "That file can't be edited here." });

  try {
    return res.status(200).json(await readFile(req.query.path));
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
