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

On this database I have a growing record of vehicle positions which, as of 9/24/2025, contains > 20 million records. This post explores my journey in designing a schema for efficient queries to allow the map features I outline in this [post](/blog/muni-map).

## Goal 1
With over 617K rows being added to my vehicle records table daily, it quickly became sluggish to query the table. After some digging I found that this calls for partitioning. I am partitioning my table into month-long segments. 

## Goal 2
Enable quick querying **to serve route data and historical stats** on API endpoint '/routes/{route_id}'

The GTFS API provided by SFMTA MUNI deals in routes, stops and shapes. 

To make use of these, I run a croon job to fetch seasonal updates (every month) of static GTFS data and update my Postgres tables that connect route ids to shapes and allow them to be plotted on my map.

Each route can have multiple shapes. Some are shortened versions, some are just distinguished by inbound and outbound.

To find all relavent shapes I query:

'''
SELECT DISTINCT ON (route_id, shape_id)
route_id, trip_id, direction_id, shape_id
FROM trips;
'''

routes.txt → trips.txt → shapes.txt
     ↓           ↓
     └─── stop_times.txt → stops.txt

# Goal 2
Create an expected arrival time table to run cross checks on for delay updates