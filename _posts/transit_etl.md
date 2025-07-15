---
layout: post
title: Transit ETL
permalink: /blog/overview
date: 2025-05-23 22:18:00
description: "putting Spark to work"
tags: spark rpi kafka S3
categories: tech
noncreative: true
order: 7
thumbnail: assets/img/rpis.jpg
featured: true
---

I have decided to use my RPi cluster to function as a local data pipeline.

The data source is near-realtime SFMTA MUNI data fetched from the 511.org API.

The structure is:

Extract (RPi) --> Kafka (my RPi cluster) --> Spark (my RPi cluster) --> Storage (S3) --> Postgres DB (on EC2)

You can refer to the RPi Spark-cluster series of blog posts to understand how I setup a standalone Spark cluster on Raspberry Pis. 

I will shortly be releasing blog posts on how I set up a Kafka cluster on my Raspberry Pis.