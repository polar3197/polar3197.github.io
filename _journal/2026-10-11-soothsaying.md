---
project: buni
title: "predictions"
---

I built the frontend and backend of this app while searching for a job as a fullstack engineer at a startup in SF. Since working at that start up, vibe-engineering has significantly usurped this space.

I returned to the project, rebooted it on my raspberry pi and had opus 5.5 give it a once over — which resulted mostly in updated polling frequencies, polish on UX and porting it to RN for ios. It looks basically the same.

The problem with coding nowadays is the speed expectation. You can go lightning fast, so why haven't you pushed several new fullstack features this week? It's a wonderful time to be alive, but it takes away the joy, the sense of accomplishment and the learning of slowly wrestling an amorphous idea into effective lines of code.

So, in my long-winded way, I am saying that I am rebooting this project as a place to slowly explore something that interests me: **training small ML models to serve accurate arrival-time predictions of SF's public transit vehicles**.

The goal now is to use the public data available every day since 2022 to train some different decision tree variants, with the aim of predicting travel times between each bus stop, respective of route, time of day, other features, etc.