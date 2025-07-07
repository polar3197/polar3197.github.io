---
layout: default
title: creative writing
permalink: /creative/
nav: true
nav_order: 3
category: creative
---

<ul class="post-list">
  {% assign creative_posts = site.posts | where_exp: "post", "post.categories contains 'creative'" %}
  {% for post in creative_posts %}
    <li>
      <h3><a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.description }}</p>
      <p class="post-meta">
        {{ post.date | date: '%B %d, %Y' }}
        {% if post.read_time %}
          &nbsp; &middot; &nbsp; {{ post.read_time }} min read
        {% endif %}
      </p>
    </li>
  {% endfor %}

  {% if creative_posts.size == 0 %}
    <p>No posts so far…</p>
  {% endif %}
</ul>