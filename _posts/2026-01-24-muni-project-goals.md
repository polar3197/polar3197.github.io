---
title: "Defining the Goals of the MUNI Project"
description: "This project has a million avenues. Bringing it over the finish line will require a clear delineation of goals."
tags: [MUNI, Planning]
---

## Looking Back
This project began for the purpose of gathering interesting data to train ML models. I was in Anant Sahai's Deep Learning Class at the time and I wanted to get my hands dirty with real world training.

In a frustratingly drawn out learning period, I settled on my datapipeline stack and set it running. It effectively automated the process of fetching, storing and cleaning GTFS vehicle data every 60 seconds.

Not long after setting up the data pipeline I decided it was important to build a map that displays the positions of these vehicles as they arrive. For this I had to learn HTML/CSS/JS and then weeks later, after learning those basics, React.

Most recently I optimized queries and set in place caching mechanisms to minimize data travel time.

## Looking Around
I have come face to face with the question "Why?". Why do any of this? 
- Google does route finding. 
- CityMapper does city specific details and route mapping.
- Swiftly does public transportation analytics.

So what do I have to offer? 
1. A live map.
2. A more intuitive interface that combines simple route finding with internal transit info
3. The possibility of many novel features:
    - replay at high speed movement of vehicles
    - display buses locations from previous time/day
    - display route paths without needing to pick a destination
    - LLM query questions about bus cost, schedules and hours of operation
    - Spotify wrapped style monthly reports on ridership

## Looking Ahead
An undeniable first step to creating this app is to convert it to iPhone compatability. I will have to learn React Native. So I will put a momentary pin in this MUNI project and build a small "voice memo+" app I've had on my mind and use that as a breather from MUNI and a way to get acquainted with React Native.

The second undeniable step for releasing any beta for the MUNI app is to give it user auth and a users database to track usage stats so I know when people are using it.