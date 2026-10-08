// Carousel: one slide per view; arrow buttons, position-bar segments and h / ; keys step through.
// (isPlainKeypress comes from shortcuts.js, loaded first.)
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const prev = carousel.querySelector("[data-carousel=prev]");
  const next = carousel.querySelector("[data-carousel=next]");
  const segments = [...carousel.querySelectorAll("[data-carousel-segment]")];
  const slideCount = track.children.length;

  const clamp = (index) => Math.max(0, Math.min(slideCount - 1, index));
  const indexFromScroll = () => Math.round(track.scrollLeft / track.clientWidth);

  // Remember the position per page for this browser session, so leaving and coming back keeps it.
  const storageKey = `carousel:${location.pathname}`;
  const loadPosition = () => { try { return Number(sessionStorage.getItem(storageKey)) || 0; } catch { return 0; } };
  const savePosition = () => { try { sessionStorage.setItem(storageKey, target); } catch {} };

  let target = clamp(loadPosition());  // where we're heading, so quick repeat presses each count

  const updateControls = () => {
    prev.disabled = target === 0;
    next.disabled = target === slideCount - 1;
    segments.forEach((segment, index) => segment.setAttribute("aria-current", index === target));
    carousel.style.setProperty("--index", target);
    savePosition();
  };
  const goTo = (index) => {
    target = clamp(index);
    track.scrollTo({ left: target * track.clientWidth });
    updateControls();
  };

  prev.addEventListener("click", () => goTo(target - 1));
  next.addEventListener("click", () => goTo(target + 1));
  segments.forEach((segment, index) => segment.addEventListener("click", () => goTo(index)));

  // Clicking a control shouldn't park focus on it (which later shows a focus ring on key presses).
  [prev, next, ...segments].forEach((control) =>
    control.addEventListener("mousedown", (event) => event.preventDefault()));

  // After any scroll settles (including a trackpad swipe), resync to where we landed.
  let settle;
  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => { target = indexFromScroll(); updateControls(); }, 120);
  }, { passive: true });

  // Restore the saved position instantly (no slide, no bar animation), then enable motion.
  track.scrollTo({ left: target * track.clientWidth, behavior: "instant" });
  updateControls();
  requestAnimationFrame(() => requestAnimationFrame(() => carousel.classList.add("is-ready")));

  document.addEventListener("keydown", (event) => {
    if (!isPlainKeypress(event)) return;
    if (event.key === "h") goTo(target - 1);
    if (event.key === ";") goTo(target + 1);
  });
});
