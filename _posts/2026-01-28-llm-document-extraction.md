---
title: "LLM document extraction for Stanford Security Litigations Analytics"
description: "Legal document parsing tool."
tags: [AI, prompt-engineering, Stanford Law]
---

### overview 
In this post I sketch out a flowchart for this project.

If you are interested in 
- the *score function* for evaluating pdf extraction, or
- *AI pipeline design choices*,

refer to blog posts "pdf extraction score function" or "single vs. compound ai pipeline", respectively

### 1. start
Document in pdf form

### 2. preparing document
**input**: doc.pdf

**output**: 4llm.txt, 4regex.txt

The process is defined by the assumption that there are fields which can be found by simple RegEx, and we dont need to waste compute on feeding those to the LLM.

**process**: 
- simple extraction. if image, optimal character recognition (OCR), but this is more of an early 2000s phenomenon
- chop off exclusively RegEx pages --> use regex (simple to do)


### 3. evaluation loop
0. curate the previously labeled documents into a validation dataset
1. pick "good enough" prompt
2. establish list of models for testing
3. for each model, run 3.1 -> 3.2 -> accuracy score 
4. establish these scores as baseline accuracy to compare models

#### 3.1. send to LLM (this the part that cost money $$$)
**input**:
- 4llm.txt
- prompt

**output**: extracted_fields.json

#### 3.2. evaluate output
**input**: 
- extracted_fields.json
- human_extraction.json

**output**: score (0-100)

### 4. assess
**input**: model performance

**output**: model to use in "production"

If there is a clear winner then pick that one.

Additionally pick the best performing smaller model.

Run GEPA on both of them. 

Compare accuracy to cost --> allows easy tradeoff decision.

### 5. finish
Scaffold the prompt and SDK call in an API call and add to React app. Build easy to use human-in-the-loop features.





















