---
layout: post
title: PostgreSQL Database Setup
permalink: /blog/muni-infra-ds/
date: 2025-09-03
description: "How the thing runs"
tags: design
categories: [muni-project]
noncreative: true
order: 5
thumbnail: assets/img/muni2.jpg
featured: false
---

## Context

My PostgreSQL database is instantiated on a 128GB SSD mounted to a Raspberry Pi.

On this database I have a growing record of vehicle positions which, as of 9/24/2025, contains > 20 million records. Querying is slow. The data is there but uniterpretted. This post explores my journey in designing a schema for efficient queries to allow the map features I outline in this [post](/blog/muni-map).

## Schema

# Entities of Interest

1. **routes**
2. **vehicles**
3. **stops**
4. **trips**

## Goal 1
Serve routes as defined by stops {stop_sequence, stop_name, lat_lon}. I need to establish a relationship between routes and stops. This is a many-to-many relation, so I will need a junction table route_stops.

routes.txt → trips.txt → shapes.txt
     ↓           ↓
     └─── stop_times.txt → stops.txt