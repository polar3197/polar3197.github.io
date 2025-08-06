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

## Motivation
There is a real-time stream of rich data collected and published by San Francisco's MTA through a GTFS API. I use SFMTA a lot and so I started playing with using my Raspberry Pis for data collection to see what is available. I am now moving to analyze trends in the data with state of the art models. 

The best part is that I can employ my [RPi Spark Cluster](/blog/overview) to handle the data processing.

## Goals
* Reduce cloud costs by pushing as much computation as possible to edge devices.

* Keep cloud S3 usage limited to enriched, ML-ready data.

* Learn orchestration tools like Apache Airflow to replace cron-based triggering and better manage dependencies between ingest and transform jobs.

* Build toward a reproducible, self-contained training pipeline using Spark and scikit-learn.

## Structure
The structure is as follows, and it is conceived around two constraints:
1. To limit cost overhead, I don't want a constant EC2 instance running;
2. To cut out unneccessary IO to S3 buckets (hence use of MinIO)

- **Extract**:
  
  - RPi_1 (Caddy) fetches from SFMTA API every ten minutes and stores it as a Parquet file in a local MinIO S3 bucket (`s3a://local_bucket`) on a USB attached to Caddy.
  - RPi_2 (Quentin) fetches weather data every hour and stores it in `s3a://local_bucket` over the LAN.

- **Transform**:

  - At the end of every day, a Spark job is triggered on my [RPi Spark Cluster](/blog/overview) that:
    - Joins real-time MUNI data with weather data and MUNI static arrival estimates.
    - Tokenizes the resulting data.
    - Writes that day's data to S3 bucket `s3a://model_training_data`.
  - The local bucket is then cleared.

- **Load**:

  - Future work includes loading tokenized data into a classification pipeline (e.g., scikit-learn or PySpark ML).

## Stages
1. Enabling Spark-Cluster IO with S3 buckets (done, to be written up);
2. Configuring MinIO bucket on USB storage device;
3. Configuring cron jobs for fetch and transform/push (potentially jump straight to Airflow).












