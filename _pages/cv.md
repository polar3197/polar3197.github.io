---
layout: cv
permalink: /cv/
title: cv
nav: true
nav_order: 2
cv_pdf: Charlie_Cooper_Resume.pdf # you can also use external links here
---
<div class="post">
  <header class="post-header">
    <h1 class="post-title">
      {{ page.title }}
      <a href="{{ 'assets/pdf/Charlie_Cooper_Resume.pdf' | relative_url }}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="float-right">
        <i class="fa-solid fa-file-pdf"></i>
      </a>
    </h1>
    {% if page.description %}
      <p class="post-description">{{ page.description }}</p>
    {% endif %}
  </header>

  <article>
    <div class="pdf-container" style="width: 100%; height: 1000px; margin-top: 2rem; border: 1px solid #ddd;">
      <embed 
        src="{{ 'assets/pdf/Charlie_Cooper_Resume.pdf' | relative_url }}#toolbar=1&navpanes=0&scrollbar=1" 
        type="application/pdf" 
        width="100%" 
        height="100%">
    </div>
    
    <p style="margin-top: 1rem; text-align: center;">
      If the PDF doesn't display above, 
      <a href="{{ 'assets/pdf/Charlie_Cooper_Resume.pdf' | relative_url }}" target="_blank">click here to open it in a new tab</a>.
    </p>
  </article>
</div>