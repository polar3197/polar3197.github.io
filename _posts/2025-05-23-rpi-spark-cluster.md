---
layout: post
title: Beginning of My Spark Adventure
date: 2025-5-23 22:18:00
description: setup part 1: Ethernet! IP addresses! SSH! 
tags: spark rpi
categories: coding-project
thumbnail: assets/img/rpis.jpg
featured: false
---
### Overview

This post is the beginning of a series documenting my progress, brainstorming and fumbles in setting up a distributed network for data-processing, model-finetuning and performance-logging. 

This project was inspired by conversations with Matei Zaharia while I was in his operating systems class at UC Berkeley.

### Goals
The concepts/tools I am interested in getting hands-on with in this project are,
* Distributed systems
* SSH
* Apache Spark (PySpark)
* Docker
* Webscraping (potentially switching to camera as cts data feed)
* HuggingFace finetuning (using EC2 cloud machines)
* CI/CD (either with Jenkins or GitHub Actions)


### 1. Getting equipment

- For my experimental purposes, I decided two **Raspberry Pi 4Bs** w/ 4GB would suffice as the worker nodes. 
- For faster/more reliable message passing, I wired my RPis through through Ethernet using an **Archer AX21** router.
- These choices were cheap and still allow for incremental scaling of the system.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/rpis.jpg" class="img-fluid d-block mx-auto w-50 rounded z-depth-1" %}
    </div>
</div>

<!-- <div class="caption">
    A simple, elegant caption looks good between image rows, after each row, or doesn't have to be there at all.
</div> -->

### 2. Set up the RPis
You will need a microSD card to install the Debian OS onto the RPi. While doing this, choose to customize the OS.
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/rpi-os-setup.png" class="img-fluid d-block mx-auto w-50 rounded z-depth-1" %}
    </div>
</div>

This will allow you to choose a username, an RPi specific name and a password.

Lastly, go to "options" and click "enable SSH".

### 3. Setting Up SSH into RPis
To set up an SSH connection you will need your pi-name, username, password and the IP address of the RPi on your local network. Because I am using an Archer router, I could monitor WiFi connections and find my RPi's IP address using the Tether app.

To connect to the shell, run
```zsh
ssh name@IP
```
and enter the password you chose when setting up the RPi OS when prompted.

For quicker access I recommend setting up an SSH authentication key in your terminal,
```zsh
ssh-keygen -f ~/.ssh/rpi1_key
```
where "-f" indicates the file to store the key in. Then copy the public key into the shell of the RPi,
```zsh
scp ~/.ssh/rpi1_key.pub username@<rpi-IP>:/
```
The destination for the public key on the RPi is not critical.

Then, on your local machine, edit ~/.ssh/config by adding
```zsh
Host pi-name                                                                       
     HostName <rpi-IP>                                                       
     User username                                                               
     IdentityFile ~/.ssh/rpi1_key 
```
And now you can ssh into your raspberry pi without a password by running
```zsh
ssh pi-name
```