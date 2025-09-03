---
layout: post
title: MUNI Transit ML Pipeline Overview
permalink: /blog/muni-overview
date: 2025-05-23 22:18:00
description: "Making use of continuous transit data"
tags: spark rpi
categories: tech
noncreative: true
order: 2
thumbnail: assets/img/muni2.jpg
featured: true
---

## Overview
There is a real-time stream of rich data collected and published by San Francisco's MTA through a GTFS API. As a big public transit fan and user, I was excited to find this API. I want to serve this data in a more transparent and accessible way than what can be found on the city's web apps or other maps providers.

[Github Repo](https://github.com/polar3197/muni-map)

## Project Table of Contents
* [Continuous data integration](/blog/kafka)
* [Containerization](/blog/docker)
* [Database interaction](/blog/postgres)

## Deliverable Goals
* Display live map of vehicle locations in SF
* Collect records of vehicles every 60s in order to train ML models
* Build graph representations of routes that have weighted edges based on travel time. This would enable route suggestion via graph traversal algorithms.

## Learning Goals
* Docker: more advanced use of Docker containers for each part of the data pipeline
* Kafka: streaming of MUNI API polls so one consumer can use the data for live map and one for historical records
* PostgreSQL: building efficient schema to allow quick and smooth delivery of analytics

## Structure
The structure is as follows,

- **Extract**:
  
  - RPi_1 (Caddy) fetches from SFMTA API every 60s via cron job,
    - stores in json format locally 
    - inserts into PostgreSQL database on local ssd












