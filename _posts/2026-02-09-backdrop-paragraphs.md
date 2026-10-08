---
title: "Documenting experience with new CMS Backdrop Paragraph Layout"
description: "a novice trying to use them"
tags: [Web Dev, CMS Backdrop]
---

# Backdrop Layout Paragraphs Setup

### Create project directory
```
mkdir test_paragraphs && cd test_paragraphs
```

### Configure DDEV
```
ddev config --project-type=backdrop --database=mariadb:10.11
ddev add-on get backdrop-ops/ddev-backdrop-bee
ddev start
```

### Install Backdrop
```
ddev bee download-core
ddev bee si --username=admin --password=Password123 --db-name=db --db-user=db --db-pass=db --db-host=db --auto
```

### Install Layout Paragraphs branch
```
ddev bee dl paragraphs:branch:2.x-layout-paragraphs
ddev bee en paragraphs -y
ddev launch
```

### Set up git for development on Paragraphs module
```
ddev ssh
cd modules/paragraphs
git init
git remote add origin https://github.com/backdrop-contrib/paragraphs.git
git fetch origin
git add .
git commit -m "Initial commit of downloaded 2.x-layout-paragraphs code"
git checkout 2.x-layout-paragraphs
git checkout -b my-layout-work
exit
```

### Database credentials
- Host: `db`
- Database: `db`
- Username: `db`
- Password: `db`

### Creating a new paragraph
thoughts:
1. in creating a paragraph layout, there is a page for adding rows. The rows dont visualize in that config page and that makes it difficult to keep track of the configuration
2. why does the header, content, footer stay in place?
3. paragraph inside of paragraph?