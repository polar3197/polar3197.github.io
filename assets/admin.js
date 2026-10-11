// Admin mode. "/" opens a command box: "admin" asks for the password (checked by /api/login on
// Vercel), "admin-off" (or "logout" / "exit") ends the session. In admin mode, edit buttons appear on written content;
// saving commits the source file to GitHub through /api/save, and Vercel redeploys in ~a minute.
// (isPlainKeypress comes from shortcuts.js.)
const root = document.documentElement;
const command = document.querySelector(".command");
const commandInput = command.querySelector(".command__input");
const commandHint = command.querySelector(".command__hint");
const editor = document.querySelector(".editor");
const editorPath = editor.querySelector(".editor__path");
const editorTitle = editor.querySelector(".editor__title");
const editorText = editor.querySelector(".editor__text");
const editorStatus = editor.querySelector(".editor__status");
const note = document.querySelector(".admin-note");

// Remember (per browser) that admin was used, so ordinary visitors never call the session API.
const hint = {
  get() { try { return localStorage.getItem("admin-hint") === "1"; } catch { return false; } },
  set(on) { try { on ? localStorage.setItem("admin-hint", "1") : localStorage.removeItem("admin-hint"); } catch {} },
};

async function api(path, { method = "GET", body } = {}) {
  try {
    const res = await fetch(`/api/${path}`, {
      method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body && JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({
      error: res.status === 404 ? "Admin only works on charlie-cooper.vercel.app." : `Error ${res.status}.`,
    }));
    return { ok: res.ok, status: res.status, ...data };
  } catch {
    return { ok: false, status: 0, error: "Couldn't reach the server." };
  }
}

const isAdmin = () => root.classList.contains("is-admin");
const setAdmin = (on) => { root.classList.toggle("is-admin", on); hint.set(on); };

if (hint.get()) api("session").then((session) => setAdmin(Boolean(session.admin)));

// ---------- Command box ----------
let awaitingPassword = false;

function openCommand() {
  awaitingPassword = false;
  commandInput.type = "text";
  commandInput.placeholder = "type a command";
  commandInput.value = "";
  commandHint.textContent = "";
  command.showModal();
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || !isPlainKeypress(event) || command.open || editor.open) return;
  event.preventDefault();
  openCommand();
});

command.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = commandInput.value.trim();

  if (awaitingPassword) {
    commandHint.textContent = "checking…";
    const result = await api("login", { method: "POST", body: { password: value } });
    commandInput.value = "";
    if (!result.ok) { commandHint.textContent = result.error; return; }
    setAdmin(true);
    command.close();
    return;
  }

  switch (value.toLowerCase()) {
    case "admin":
      if (isAdmin()) { commandHint.textContent = "Already in admin mode. (admin-off to leave)"; return; }
      awaitingPassword = true;
      commandInput.type = "password";
      commandInput.placeholder = "password";
      commandInput.value = "";
      commandHint.textContent = "";
      return;
    case "admin-off":
    case "logout":
    case "exit":
      await api("logout", { method: "POST" });
      setAdmin(false);
      command.close();
      return;
    default:
      commandHint.textContent = value ? `Unknown command: ${value}` : "";
  }
});

// ---------- Editor ----------
let current = null;      // { path, sha } for an existing file, or { project, isNew: true }
let loadedText = "";     // what the editor started with, to detect unsaved changes
let discardArmed = false; // first cancel/Esc with unsaved text only warns; the second discards
let pageBefore = null;   // this page's HTML when the editor opened, to tell when the edit is live

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchPage = () =>
  fetch(`${location.pathname}?fresh=${Date.now()}`, { cache: "no-store" }).then((r) => r.text()).catch(() => null);

const isDirty = () =>
  editor.open && (editorText.value !== loadedText || (current?.isNew && editorTitle.value.trim() !== ""));

function prepare(pathLabel, isNew) {
  editorPath.textContent = pathLabel;
  editorTitle.hidden = !isNew;
  editorTitle.value = "";
  editorText.value = "";
  loadedText = "";
  discardArmed = false;
  editorStatus.textContent = "";
  fetchPage().then((html) => { pageBefore = html; });
  editor.showModal();
}

async function openEditor(path, find) {
  current = { path, sha: null };
  prepare(path, false);
  editorStatus.textContent = "loading…";

  const file = await api(`file?path=${encodeURIComponent(path)}`);
  if (!file.ok) { editorStatus.textContent = file.error; if (file.status === 401) setAdmin(false); return; }
  current.sha = file.sha;
  editorText.value = loadedText = file.content;
  editorStatus.textContent = "";

  // Put the cursor on the item that was clicked (e.g. one project in projects.yml).
  const at = find ? file.content.indexOf(find) : -1;
  editorText.focus();
  if (at >= 0) {
    editorText.setSelectionRange(at, at);
    const line = file.content.slice(0, at).split("\n").length - 1;
    editorText.scrollTop = Math.max(0, line * parseFloat(getComputedStyle(editorText).lineHeight) - 40);
  }
}

function openNewEntry(project) {
  current = { project, isNew: true, sha: null };
  prepare(`new journal entry · ${project}`, true);
  editorTitle.focus();
}

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "entry";
const today = () => {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
};

// Closing with unsaved text: the first cancel/Esc warns, the second discards.
function requestClose(event) {
  if (isDirty() && !discardArmed) {
    event?.preventDefault();
    discardArmed = true;
    editorStatus.textContent = "Unsaved changes. Cancel again to discard them.";
    return;
  }
  editor.close();
}

editor.querySelector("[data-editor=cancel]").addEventListener("click", () => requestClose());
editor.addEventListener("cancel", (event) => { if (isDirty() && !discardArmed) requestClose(event); });
editor.addEventListener("input", () => { discardArmed = false; });
addEventListener("beforeunload", (event) => { if (isDirty()) event.preventDefault(); });

// After a save: keep a note on screen, and reload once the rebuilt page is live.
async function showPublishing(destinationHash) {
  note.hidden = false;
  note.textContent = "saved · publishing…";
  const before = pageBefore ?? (await fetchPage());
  const started = Date.now();
  while (Date.now() - started < 3 * 60 * 1000) {
    await sleep(5000);
    const html = await fetchPage();
    if (html && before && html !== before) {
      note.textContent = "published · reloading…";
      if (destinationHash) location.hash = destinationHash;
      location.reload();
      return;
    }
  }
  note.textContent = "saved · still publishing. Refresh in a minute.";
}

editor.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  let { path } = current;
  let content = editorText.value;
  let destinationHash = null;

  if (current.isNew) {
    const title = editorTitle.value.trim();
    if (!title) { editorStatus.textContent = "Add a title first."; return; }
    const slug = slugify(title);
    path = `_journal/${today()}-${slug}.md`;
    content = `---\nproject: ${current.project}\ntitle: ${JSON.stringify(title)}\n---\n\n${content.trim()}\n`;
    destinationHash = `#${current.project}/journal/${slug}`;  // open the new post once it's live
  }

  editorStatus.textContent = "saving…";
  const result = await api("save", { method: "POST", body: { path, content, sha: current.sha } });
  if (!result.ok) { editorStatus.textContent = result.error; if (result.status === 401) setAdmin(false); return; }

  loadedText = editorText.value;   // nothing unsaved now
  if (current.isNew) editorTitle.value = "";
  editor.close();
  showPublishing(destinationHash);
});

document.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit]");
  if (edit) { event.preventDefault(); openEditor(edit.dataset.edit, edit.dataset.editFind); return; }
  const add = event.target.closest("[data-new-entry]");
  if (add) { event.preventDefault(); openNewEntry(add.dataset.newEntry); }
});
