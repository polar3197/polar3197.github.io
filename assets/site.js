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
    if (!isPlainKeypress(event) || carousel.classList.contains("is-post-open")) return;
    if (event.key === "h") goTo(target - 1);
    if (event.key === ";") goTo(target + 1);
  });
});

// Progress journals (projects page). The journal list is a dropdown under each project's
// description; a row opens that post in the full content area, in place of the slides and arrows
// (the position bar stays). The URL hash picks the view, so views can be linked and Back works:
//   #<slug> → the project · #<slug>/journal → its list open · #<slug>/journal/<entry> → that post
const journals = [...document.querySelectorAll("[data-journal]")];

if (journals.length) {
  const carousel = document.querySelector(".carousel");
  const posts = [...carousel.querySelectorAll("[data-post]")];
  const postArea = carousel.querySelector(".carousel__posts");
  const slugs = [...carousel.querySelectorAll(".slide")].map((slide) => slide.dataset.slug);

  const setOpen = (dropdown, open) => {
    dropdown.classList.toggle("is-open", open);
    dropdown.querySelector(":scope > .dropdown__toggle").setAttribute("aria-expanded", open);
  };

  // Toggling a list keeps the hash in step without adding history entries.
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".journal > .dropdown__toggle");
    if (!toggle) return;
    const journal = toggle.closest(".journal");
    const open = !journal.classList.contains("is-open");
    setOpen(journal, open);
    history.replaceState(null, "", `#${journal.dataset.journal}${open ? "/journal" : ""}`);
  });

  const route = () => {
    const [slug, section, entry] = decodeURIComponent(location.hash.slice(1)).split("/");
    const post = section === "journal" && entry && posts.find((p) => p.dataset.post === `${slug}/${entry}`);

    carousel.classList.toggle("is-post-open", Boolean(post));
    posts.forEach((p) => { p.hidden = p !== post; });
    if (post) postArea.scrollTop = 0;

    if (slugs.includes(slug)) carousel.goTo(slugs.indexOf(slug));
    const journal = section === "journal" && journals.find((j) => j.dataset.journal === slug);
    if (journal) setOpen(journal, true);
  };

  // Picking a project on the position bar while a post is open goes back to the slides. (The
  // carousel has already set the hash to that project, so no hashchange fires; route directly.)
  carousel.querySelectorAll("[data-carousel-segment]").forEach((segment, index) =>
    segment.addEventListener("click", () => {
      if (!carousel.classList.contains("is-post-open")) return;
      history.replaceState(null, "", `#${slugs[index]}`);
      route();
    }));

  addEventListener("hashchange", route);
  route();
}
