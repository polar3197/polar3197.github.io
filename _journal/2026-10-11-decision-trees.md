---
project: buni
title: "decision trees"
---

**the goal** - take tabular data and create a tree where columns' values decide the path an unclassified datapoint follows.

the tree ends in terminal nodes where the new data point is classified.

there are **two types of decision trees** - 

**classifiers** and **regression** trees.

these types are almost identical except for the way that they build the tree. the algorithm for each of them chooses which node to put next in each branch of the tree using a different **split scoring** method.

**classification trees **
- **def**: lead to nodes with discrete outcomes (e.g. occupancy: empty, sparse, busy, full)
- **the algorithm**: examine each column as a potential root node. **each node can only answer yes or no**, so it results in two child nodes in the tree. for our example of occupancy, it could split on a yes/no question like "is this route N?", "is the time >8am". we don't pick the split nodes, the algorithm does. and it does so by **split scoring** (almost) all possible splitting nodes (some options, especially in columns with many possible values, cannot check all - think "all possible splites of 70 routes into two sets = 2^69"). this process repeats again and again until reaching the **stopping condition.
- **split scoring**: 
- **stopping condition**:

**regression**
- **def**: lead to nodes with numeric outcomes (e.g. segment travel time: 10s, 20s, 23s, 70s, etc.)
- **the algorithm**: 
- **split scoring**: 
- **stopping condition**:
