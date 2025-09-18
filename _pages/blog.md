---
layout: default
permalink: /blog/
title: blog
nav: true 
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  sort_field: order
  sort_reverse: false
  trail:
    before: 1
    after: 3
---

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}
  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
{% endif %}

{% if site.display_tags and site.display_tags.size > 0 or site.display_categories and site.display_categories.size > 0 %}
  <div class="tag-category-list">
    <ul class="p-0 m-0">
      {% for tag in site.display_tags %}
        <li>
          <i class="fa-solid fa-hashtag fa-sm"></i> <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
      {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
        <p>&bull;</p>
      {% endif %}
      {% for category in site.display_categories %}
        <li>
          <i class="fa-solid fa-tag fa-sm"></i> <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>
{% endif %}

<!-- Filter buttons -->
<div class="blog-filter-buttons">
  <button class="filter-btn active" data-filter="all">
    <i class="fas fa-list"></i> All Posts
  </button>
  <button class="filter-btn" data-filter="muni-project">
    <i class="fas fa-subway"></i> Muni Project
  </button>
  <button class="filter-btn" data-filter="general-tech">
    <i class="fas fa-code"></i> General Tech
  </button>
  <button class="filter-btn" data-filter="thoughts">
    <i class="fas fa-lightbulb"></i> Thoughts
  </button>
</div>

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
<br>

<div class="container featured-posts" id="featured-posts-container">
{% assign is_even = featured_posts.size | modulo: 2 %}
<div class="row row-cols-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
{% for post in featured_posts %}
<div class="col mb-4 featured-post-item" data-tags="{{ post.tags | join: ' ' | downcase }}" data-categories="{{ post.categories | join: ' ' | downcase }}">
<a href="{{ post.url | relative_url }}">
<div class="card hoverable">
<div class="row g-0">
<div class="col-md-12">
<div class="card-body">
<div class="float-right">
<i class="fa-solid fa-thumbtack fa-xs"></i>
</div>
<h3 class="card-title text-lowercase">{{ post.title }}</h3>
<p class="card-text">{{ post.description }}</p>

                    {% if post.external_source == blank %}
                      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                    {% else %}
                      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                    {% endif %}
                    {% assign year = post.date | date: "%Y" %}

                    <p class="post-meta">
                      {{ read_time }} min read &nbsp; &middot; &nbsp;
                      <a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">
                        <i class="fa-solid fa-calendar fa-sm"></i> {{ year }} </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      {% endfor %}
      </div>
    </div>
    <hr id="featured-hr">

{% endif %}

  <ul class="post-list" id="regular-posts">

    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts | where: "noncreative", true %}
    {% else %}
      {% assign postlist = site.posts | where: "noncreative", true %}
    {% endif %}

    <!-- Hidden complete post list for filtering -->
    {% assign all_posts = site.posts | where: "noncreative", true %}
    {% for post in all_posts %}
      {% assign post_tags = post.tags | join: ' ' | downcase %}
      {% assign post_categories = post.categories | join: ' ' | downcase %}
      <div class="all-posts-data" style="display: none;" 
           data-url="{{ post.url | relative_url }}"
           data-title="{{ post.title }}"
           data-description="{{ post.description }}"
           data-date="{{ post.date | date: '%B %d, %Y' }}"
           data-year="{{ post.date | date: '%Y' }}"
           data-tags="{{ post_tags }}"
           data-categories="{{ post_categories }}"
           data-redirect="{{ post.redirect }}"
           data-external-source="{{ post.external_source }}"
           data-thumbnail="{{ post.thumbnail }}"
           data-read-time="{% if post.external_source == blank %}{{ post.content | number_of_words | divided_by: 180 | plus: 1 }}{% else %}{{ post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 }}{% endif %}">
      </div>
    {% endfor %}

    {% for post in postlist %}

    {% if post.external_source == blank %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    {% else %}
      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
    {% endif %}
    {% assign year = post.date | date: "%Y" %}
    {% assign tags = post.tags | join: "" %}
    {% assign categories = post.categories | join: "" %}

    <li class="regular-post-item" data-tags="{{ post.tags | join: ' ' | downcase }}" data-categories="{{ post.categories | join: ' ' | downcase }}">

{% if post.thumbnail %}

<div class="row">
          <div class="col-sm-9">
{% endif %}
        <h3>
        {% if post.redirect == blank %}
          <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% elsif post.redirect contains '://' %}
          <a class="post-title" href="{{ post.redirect }}" target="_blank">{{ post.title }}</a>
          <svg width="2rem" height="2rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        {% else %}
          <a class="post-title" href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
        {% endif %}
      </h3>
      <p>{{ post.description }}</p>
      <p class="post-meta">
        {{ read_time }} min read &nbsp; &middot; &nbsp;
        {{ post.date | date: '%B %d, %Y' }}
        {% if post.external_source %}
        &nbsp; &middot; &nbsp; {{ post.external_source }}
        {% endif %}
      </p>
      <p class="post-tags">
        <a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">
          <i class="fa-solid fa-calendar fa-sm"></i> {{ year }} </a>

          {% if tags != "" %}
          &nbsp; &middot; &nbsp;
            {% for tag in post.tags %}
            <a href="{{ tag | slugify | prepend: '/blog/tag/' | prepend: site.baseurl}}">
              <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}

          {% if categories != "" %}
          &nbsp; &middot; &nbsp;
            {% for category in post.categories %}
            <a href="{{ category | slugify | prepend: '/blog/category/' | prepend: site.baseurl}}">
              <i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}
    </p>

{% if post.thumbnail %}

</div>

  <div class="col-sm-3">
    <img class="card-img" src="{{ post.thumbnail | relative_url }}" style="object-fit: cover; height: 90%" alt="image">
  </div>
</div>
{% endif %}
    </li>

    {% endfor %}

  </ul>

<div id="pagination-container">
{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}
</div>

</div>

<style>
/* Smaller blog title with less padding */
.header-bar h1 {
  font-size: 2.5rem !important;
  margin-bottom: 0.5rem !important;
  padding: 0 !important;
}

.header-bar h2 {
  margin-bottom: 1rem !important;
}

.header-bar {
  margin-bottom: 1.5rem !important;
  padding: 1rem 0 !important;
}

.blog-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-bottom: 1px solid var(--global-divider-color);
  justify-content: center;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--global-theme-color);
  background: transparent;
  color: var(--global-theme-color);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--global-theme-color);
  color: white;
  transform: translateY(-2px);
}

.regular-post-item.hidden,
.featured-post-item.hidden {
  display: none !important;
}

@media (max-width: 768px) {
  .blog-filter-buttons {
    justify-content: center;
  }
  
  .filter-btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
  
  .header-bar h1 {
    font-size: 2rem !important;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const regularPostItems = document.querySelectorAll('.regular-post-item');
  const featuredPostItems = document.querySelectorAll('.featured-post-item');
  const paginationContainer = document.getElementById('pagination-container');
  const postList = document.getElementById('regular-posts');
  const allPostsData = document.querySelectorAll('.all-posts-data');
  
  let isFiltered = false;
  
  function createPostElement(postData) {
    const li = document.createElement('li');
    li.className = 'regular-post-item';
    li.setAttribute('data-tags', postData.getAttribute('data-tags'));
    li.setAttribute('data-categories', postData.getAttribute('data-categories'));
    
    const tags = postData.getAttribute('data-tags').split(' ').filter(tag => tag.length > 0);
    const categories = postData.getAttribute('data-categories').split(' ').filter(cat => cat.length > 0);
    const thumbnail = postData.getAttribute('data-thumbnail');
    
    let tagsHtml = '';
    if (tags.length > 0) {
      tagsHtml = '&nbsp; &middot; &nbsp;' + tags.map(tag => 
        `<a href="/blog/tag/${tag.replace(/\s+/g, '-').toLowerCase()}/">
          <i class="fa-solid fa-hashtag fa-sm"></i> ${tag}
        </a>`
      ).join('&nbsp;');
    }
    
    let categoriesHtml = '';
    if (categories.length > 0) {
      categoriesHtml = '&nbsp; &middot; &nbsp;' + categories.map(cat => 
        `<a href="/blog/category/${cat.replace(/\s+/g, '-').toLowerCase()}/">
          <i class="fa-solid fa-tag fa-sm"></i> ${cat}
        </a>`
      ).join('&nbsp;');
    }
    
    const externalSource = postData.getAttribute('data-external-source');
    const externalHtml = externalSource ? `&nbsp; &middot; &nbsp; ${externalSource}` : '';
    
    li.innerHTML = `
      ${thumbnail ? '<div class="row"><div class="col-sm-9">' : ''}
      <h3>
        <a class="post-title" href="${postData.getAttribute('data-url')}">${postData.getAttribute('data-title')}</a>
      </h3>
      <p>${postData.getAttribute('data-description')}</p>
      <p class="post-meta">
        ${postData.getAttribute('data-read-time')} min read &nbsp; &middot; &nbsp;
        ${postData.getAttribute('data-date')}
        ${externalHtml}
      </p>
      <p class="post-tags">
        <a href="/blog/${postData.getAttribute('data-year')}/">
          <i class="fa-solid fa-calendar fa-sm"></i> ${postData.getAttribute('data-year')}
        </a>
        ${tagsHtml}
        ${categoriesHtml}
      </p>
      ${thumbnail ? `</div><div class="col-sm-3"><img class="card-img" src="${thumbnail}" style="object-fit: cover; height: 90%" alt="image"></div></div>` : ''}
    `;
    
    return li;
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      if (filter === 'all') {
        // Show all posts and restore pagination
        isFiltered = false;
        regularPostItems.forEach(post => post.classList.remove('hidden'));
        featuredPostItems.forEach(post => post.classList.remove('hidden'));
        paginationContainer.style.display = 'block';
      } else {
        // Filter posts and show all matching posts (disable pagination)
        isFiltered = true;
        paginationContainer.style.display = 'none';
        
        // Clear current posts and add all matching posts
        postList.innerHTML = '';
        
        allPostsData.forEach(postData => {
          const postTags = postData.getAttribute('data-tags');
          const postCategories = postData.getAttribute('data-categories');
          
          if (postTags.includes(filter) || postCategories.includes(filter)) {
            const postElement = createPostElement(postData);
            postList.appendChild(postElement);
          }
        });
        
        // Filter featured posts
        featuredPostItems.forEach(post => {
          const postTags = post.getAttribute('data-tags');
          const postCategories = post.getAttribute('data-categories');
          
          if (postTags.includes(filter) || postCategories.includes(filter)) {
            post.classList.remove('hidden');
          } else {
            post.classList.add('hidden');
          }
        });
      }
    });
  });
});
</script>


<!-- ---
layout: default
permalink: /blog/
title: blog
nav: true 
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 20
  sort_field: order
  sort_reverse: false
  trail:
    before: 1
    after: 3
---

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
  {% endif %}

{% if site.display_tags and site.display_tags.size > 0 or site.display_categories and site.display_categories.size > 0 %}

  <div class="tag-category-list">
    <ul class="p-0 m-0">
      {% for tag in site.display_tags %}
        <li>
          <i class="fa-solid fa-hashtag fa-sm"></i> <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
      {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
        <p>&bull;</p>
      {% endif %}
      {% for category in site.display_categories %}
        <li>
          <i class="fa-solid fa-tag fa-sm"></i> <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>
  {% endif %}

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
<br>

<div class="container featured-posts">
{% assign is_even = featured_posts.size | modulo: 2 %}
<div class="row row-cols-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
{% for post in featured_posts %}
<div class="col mb-4">
<a href="{{ post.url | relative_url }}">
<div class="card hoverable">
<div class="row g-0">
<div class="col-md-12">
<div class="card-body">
<div class="float-right">
<i class="fa-solid fa-thumbtack fa-xs"></i>
</div>
<h3 class="card-title text-lowercase">{{ post.title }}</h3>
<p class="card-text">{{ post.description }}</p>

                    {% if post.external_source == blank %}
                      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                    {% else %}
                      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                    {% endif %}
                    {% assign year = post.date | date: "%Y" %}

                    <p class="post-meta">
                      {{ read_time }} min read &nbsp; &middot; &nbsp;
                      <a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">
                        <i class="fa-solid fa-calendar fa-sm"></i> {{ year }} </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      {% endfor %}
      </div>
    </div>
    <hr>

{% endif %}

  <ul class="post-list">

    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts | where: "noncreative", true %}
    {% else %}
      {% assign postlist = site.posts | where: "noncreative", true %}
    {% endif %}

    {% for post in postlist %}

    {% if post.external_source == blank %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    {% else %}
      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
    {% endif %}
    {% assign year = post.date | date: "%Y" %}
    {% assign tags = post.tags | join: "" %}
    {% assign categories = post.categories | join: "" %}

    <li>

{% if post.thumbnail %}

<div class="row">
          <div class="col-sm-9">
{% endif %}
        <h3>
        {% if post.redirect == blank %}
          <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% elsif post.redirect contains '://' %}
          <a class="post-title" href="{{ post.redirect }}" target="_blank">{{ post.title }}</a>
          <svg width="2rem" height="2rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        {% else %}
          <a class="post-title" href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
        {% endif %}
      </h3>
      <p>{{ post.description }}</p>
      <p class="post-meta">
        {{ read_time }} min read &nbsp; &middot; &nbsp;
        {{ post.date | date: '%B %d, %Y' }}
        {% if post.external_source %}
        &nbsp; &middot; &nbsp; {{ post.external_source }}
        {% endif %}
      </p>
      <p class="post-tags">
        <a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">
          <i class="fa-solid fa-calendar fa-sm"></i> {{ year }} </a>

          {% if tags != "" %}
          &nbsp; &middot; &nbsp;
            {% for tag in post.tags %}
            <a href="{{ tag | slugify | prepend: '/blog/tag/' | prepend: site.baseurl}}">
              <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}

          {% if categories != "" %}
          &nbsp; &middot; &nbsp;
            {% for category in post.categories %}
            <a href="{{ category | slugify | prepend: '/blog/category/' | prepend: site.baseurl}}">
              <i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}
    </p>

{% if post.thumbnail %}

</div>

  <div class="col-sm-3">
    <img class="card-img" src="{{ post.thumbnail | relative_url }}" style="object-fit: cover; height: 90%" alt="image">
  </div>
</div>
{% endif %}
    </li>

    {% endfor %}

  </ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div> -->
