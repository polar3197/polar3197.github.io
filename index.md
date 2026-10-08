---
---
{% comment %}The bio text lives in _includes/bio.md (plain Markdown, editable in admin mode).{% endcomment %}
{% capture bio %}{% include bio.md %}{% endcapture %}
<div class="intro">
  <div class="bio">
    {{ bio | markdownify }}
    <p class="links">
      <a href="https://github.com/polar3197" target="_blank" rel="noopener">github ↗</a>
      <a href="https://www.linkedin.com/in/charlie-w-cooper/" target="_blank" rel="noopener">linkedin ↗</a>
      <button class="edit" type="button" data-edit="_includes/bio.md">edit</button>
    </p>
  </div>
  <img class="portrait" src="/assets/img/profile.jpg" alt="Charlie Cooper">
</div>
