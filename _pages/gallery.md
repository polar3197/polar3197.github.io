---
layout: page
title: Gallery
permalink: /gallery/
nav: true
nav_order: 2
---

# My Paintings

<div class="gallery">
  {% for image in site.static_files %}
    {% if image.path contains 'assets/img/paintings' %}
      <img src="{{ image.path | relative_url }}" alt="{{ image.name }}" style="width: 200px; margin: 10px;"/>
    {% endif %}
  {% endfor %}
</div>