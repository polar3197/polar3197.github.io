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
thumbnail: assets/img/muni.jpeg
featured: true
---

## Motivation
There is a rich amount of data collected and published in real-time by San Francisco's MTA through its GTFS API. This data is great for building my first ML pipe-line/application, it is rich and personal, as I am a regular boarder of SFMTA public transportation.

## Goals
* Reduce cloud costs by pushing as much computation as possible to edge devices.

* Keep cloud S3 usage limited to enriched, ML-ready data.

* Learn orchestration tools like Apache Airflow to replace cron-based triggering and better manage dependencies between ingest and transform jobs.

* Build toward a reproducible, self-contained training pipeline using Spark and scikit-learn.

* (Aspirational) Publish a fast, lightweight Leaflet.js map on my website showing live MUNI locations and classification model inferences.


In this project I aim to put my Raspberry Pi Spark-cluster to work to fetch, enrich and tokenize this data to train an ML classification model.

## Structure
The structure is as follows, and it is conceived around two constraints:
1. To limit cost overhead, I don't want a constant EC2 instance running;
2. To cut out unneccessary IO to S3 buckets (hence use of MinIO)

Extract: 
    - RPi_1 (Caddy) fetches from SFMTA API, every ten minutes, and stores it as parquet file in local MinIO S3 bucket (s3a://local_bucket) on a USB attached to Caddy.
    - RPi_2 (Quentin) fetches weather data, every hour, and stores it in 's3a://local_bucket' over the LAN.
Transform: 
    - At the end of every day a Spark job will be triggered on my [RPi Spark Cluster](/blog/overview), that:
        a. joins real-time MUNI data with weather data and MUNI static arrival estimates,
        b. tokenizes the resulting data,
        c. writes that day's data to S3 bucket 's3a://model_training_data'
    - Local bucket is then cleared, keeping 
Load:
    - Future work includes loading tokenized data into a classification pipeline (e.g., scikit-learn or PySpark ML).

## Stages
1. Enabling Spark-Cluster IO with S3 buckets (done, to be written up);
2. Configuring MinIO bucket on USB storage device;
3. Configuring cron jobs for fetch and transform/push (potentially jump straight to Airflow).
