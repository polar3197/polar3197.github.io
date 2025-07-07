---
layout: post
title: My Spark Adventure
permalink: /blog/overview
date: 2025-05-23 22:18:00
description: "project overview"
tags: spark rpi
categories: tech
noncreative: true
order: 1
thumbnail: assets/img/rpis.jpg
featured: true
---
### Overview
This project was inspired by conversations with Matei Zaharia while I was in his operating systems class at UC Berkeley. [GitHub Project Repo](https://github.com/polar3197/rpi-spark-cluster).

### Post Table of Contents
- [Part 1: Setup — Ethernet, IPs, SSH](/blog/one)
- [Part 2: Docker Conatainers](/blog/two)
- [Part 3: Configuring Spark workers, coordinator and executors](/blog/three)

### Goals
The concepts/tools I'm getting hands-on with in this project:
* Distributed systems
* SSH
* Apache Spark (PySpark)
* Docker
* Webscraping and data processing
* Apache Airflow
* CI/CD

### Filetree
```
├── README.md
├── compose.yml
├── conf
│   └── spark-env.sh
├── master
│   ├── Dockerfile
│   └── start-master.sh
├── scripts
│   ├── git-autopilot.sh
│   ├── pyspark.sh
│   └── start_spark_cluster.sh
├── spark
│   ├── bin
│   ├── include
│   ├── lib
│   ├── pyvenv.cfg
│   └── share
└── worker
    ├── Dockerfile
    └── start-worker.sh
```



