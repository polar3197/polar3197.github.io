---
layout: cv
permalink: /cv/
title: cv
nav: true
nav_order: 2
cv_pdf: Charlie_Cooper_Resume.pdf # you can also use external links here
description: This is a description of the page. You can modify it in '_pages/cv.md'. You can also change or remove the top pdf download button.
---
<div class="pdf-container" style="width: 100%; height: 800px; margin-top: 2rem;">
  <iframe 
    src="{{ 'assets/pdf/Charlie_Cooper_Resume.pdf' | relative_url }}" 
    width="100%" 
    height="100%" 
    style="border: 1px solid #ccc;">
    <p>Your browser does not support PDFs. 
       <a href="{{ 'assets/pdf/Charlie_Cooper_Resume.pdf' | relative_url }}">Download the PDF</a>.
    </p>
  </iframe>
</div>