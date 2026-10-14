---
project: buni
title: "real arrival predictions"
---

what is a transit app without accurate vehicle arrival times?

the published static schedule is weak. i have a plan for predictions using 5 years of historical data on arrival times from 511's api.

i aim to predict the time it takes a vehicle to travel a single segment of its route. the method I will be testing is decision trees, specifically XGBoost and LightGBM. What the problem then boils down to is defining a function, $$/phi$$, s.t.
$$travel_time_{(s_1, s_2)} = /phi(s_1, s_2, d, t, r)$$
