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

  // Start on the slide named in the URL hash (e.g. /projects/#sec-tagger), else where this visitor left off.
  const linked = [...track.children].findIndex((slide) => slide.dataset.slug && slide.dataset.slug === location.hash.slice(1).split("/")[0]);
  let target = linked >= 0 ? linked : clamp(loadPosition());  // where we're heading, so quick repeat presses each count

  const updateControls = () => {
    prev.disabled = target === 0;
    next.disabled = target === slideCount - 1;
    segments.forEach((segment, index) => segment.setAttribute("aria-current", index === target));
    carousel.style.setProperty("--index", target);
    savePosition();
    // Slides with a slug (projects) keep the URL hash on the current one, so links and reloads land there.
    const slug = track.children[target]?.dataset.slug;
    if (slug && location.hash.slice(1).split("/")[0] !== slug) history.replaceState(null, "", `#${slug}`);
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

  carousel.goTo = goTo;  // used by the journal router below

  document.addEventListener("keydown", (event) => {
    if (!isPlainKeypress(event)) return;
    if (event.key === "h") goTo(target - 1);
    if (event.key === ";") goTo(target + 1);
  });
});

// Dropdowns (progress journals): a toggle smoothly opens the panel below it.
// The hash mirrors what's open so it can be linked:
//   #<slug>/journal → that project's entry list · #<slug>/journal/<entry> → one entry open
const journals = [...document.querySelectorAll("[data-journal]")];

if (journals.length) {
  const setOpen = (dropdown, open) => {
    dropdown.classList.toggle("is-open", open);
    dropdown.querySelector(":scope > .dropdown__toggle").setAttribute("aria-expanded", open);
  };

  const hashFor = (journal) => {
    const slug = journal.dataset.journal;
    if (!journal.classList.contains("is-open")) return `#${slug}`;
    const entry = journal.querySelector(".journal__entry.is-open");
    return entry ? `#${slug}/journal/${entry.dataset.entry}` : `#${slug}/journal`;
  };

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".journal .dropdown__toggle");
    if (!toggle) return;
    const dropdown = toggle.closest(".dropdown");
    const journal = toggle.closest(".journal");
    setOpen(dropdown, !dropdown.classList.contains("is-open"));
    history.replaceState(null, "", hashFor(journal));
  });

  // Open whatever the URL points at (on load, and when a link changes the hash).
  const route = () => {
    const [slug, section, entrySlug] = decodeURIComponent(location.hash.slice(1)).split("/");
    const journal = section === "journal" && journals.find((j) => j.dataset.journal === slug);
    if (!journal) return;
    setOpen(journal, true);
    const entry = entrySlug && [...journal.querySelectorAll(".journal__entry")].find((e) => e.dataset.entry === entrySlug);
    if (entry) setOpen(entry, true);
  };

  addEventListener("hashchange", route);
  route();
}
