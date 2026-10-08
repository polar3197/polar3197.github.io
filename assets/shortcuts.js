// Loaded in <head> (not deferred) so key presses during page load still count.

// Ignore shortcuts while typing or when a modifier is held (so ⌘L etc. still work).
const isPlainKeypress = (event) =>
  !(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) &&
  !event.target.closest?.("input, textarea, select, [contenteditable]");

// Nav shortcuts: each link's data-shortcut key navigates to it. Track where we're
// headed (not where we are) so rapid presses always land on the last key pressed.
let destination = location.href;

document.addEventListener("keydown", (event) => {
  if (!isPlainKeypress(event)) return;
  const link = document.querySelector(`[data-shortcut="${CSS.escape(event.key.toLowerCase())}"]`);
  if (!link || link.href === destination) return;
  destination = link.href;
  location.href = destination;
});
