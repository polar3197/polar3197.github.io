---
project: buni
title: "soothsaying"
---

**what's a transit map without arrival time prediction?**

## plan

it's a good excuse for me to dig up my CS189 notes and brush up on decision trees, random forests and gradient boosting.

i have very rich data on historical arrival times of buses; if I build a decision tree on that data to classify travel time between stops (referring to these as route segments), then I will achieve two things:

1. give people estimates of when their bus is arriving that differs from the 511-published static schedule,

2. be able to plot extrapolated vehicle locations in-between API polls with more accuracy than physics + route-snapping estimates.

**measurable outcomes:**

1. how do my predictions of arrival time compare to the ones 511 publishes? how do those compare to the actual arrival times?
- compare pure accuracy across routes and time of day between the two guesses and the ground truth

2. how do position extrapolation improve from pure physics + route-snapping?
- run a small experiment after both are built. pause all polling and use the api to grab live real positions every second 
- compare these real results to the positions of each extrapolation method

## experiment

## findings

## application to the map
