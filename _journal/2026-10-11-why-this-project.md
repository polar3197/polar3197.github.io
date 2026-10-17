---
project: buni
title: "day 1"
---

I haven't used pandas since college ML classes, so I had to shake off the dust first. 

I imported all of the observed vehicle stop times from September 2026 (about 10 million records), and then narrowed in on only the N on 09/24/2026.

Initial hurdles:
1. the calculated time ($$arrival\_at\_next\_stop - departure\_at\_previous\_stop$$) contained a significant amount of negative numbers... as in negative travel times from stop A to stop B. It wasn't terribly widespread, but did account for ~4% of the data,

2. sometimes 511 sends the hour of the day as 24:MM:SS when it is past midnight on the same trip originatingthe day before, sometimes they send it as 00:MM:SS. It is unpredictable. This messed with segment_travel_time calculations when, for example, stop A says 24:05:00 and stop B says 24:07:00.

I dropped the negative values and made the after-midnight times uniform using the latest time recorded in the trip. then I called it a day.
