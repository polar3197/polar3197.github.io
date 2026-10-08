---
title: "PDF extraction score function"
description: "how to best score LLM output?"
tags: [AI, Stanford Law]
---

## overview
The goal of evaluating an LLM's extractions from legal documents is to compare models and potentially use DSPy/GEPA to optimize the prompt.

## creating the validation dataset
There are a supposed **46570 human-labeled examples** of desireable extraction outputs. This is way more than is useful or practical for evaluation.

Some documents are pure image pdfs, not text-layered pdfs (those tend to be the old ones). **24949** of the original amount have a text-layer.

The distribution of the **24949** events by event type is attached at the bottom of the post.

I will only stratify my sampling by event type, but one could stratify by document complexity and timestamp as well.

This leads to the next step, the score function.

## designing the score function

A **score function** is needed to assess the quality of extracted_fields.json.

**We want to reward the following**:
 - completeness: how many of the target fields were found
 - accuracy: if a field is found, how close is the match? 
    - Do we want to reward partial accuracy for nested fields? Yes. 

This idea is formalized in an **F1 score**, where recall corresponds to completeness and precision corresponds to accuracy. F1 uses the "harmonic mean" to consolidate precision and recall because it penalizes inbalance between the two metrics, where as a standard mean can appear good via hallucinations or accurately identifying a small subset
```
Recall = TP / (TP + FN) 
       = "number of fields found" / "number of fields to be found"
Precision = TP / (TP + FP) 
          = "number of correctly identified fields" / "all identified fields"
F1 = harmonic_mean(recall, precision) 
   = 2 * (precision * recall) / (recall + precision)
```

So how do we utilize F1 to accomplish these goals?

First let us look at the anatomy of the json file. There are 
1. shallow fields (e.g. case_nid, case_title, ...),
2. nested fields (e.g. disclosures, violations, ...)
    - these are fields with lists of entities

It is worth noting that **we do not want to penalize over-extraction** for nested fields. The reason for this is two-fold:
1. the project manager indicated a potential 2-3% accuracy error in human labeling
2. we are using human-in-the-loop approval, and it is easier to flag and remove false positives than to locate missing true positives.

F1 does this slightly, but to bring over-extraction scores closer to perfect scores, we have to **incentivize recall slightly more than precision**. Which leads to using F-1.5, where 1.5 indicates how much more weight is given to recall over precision.
```
F-1.5 = harmonic_mean(recall, precision) 
      = (1 + 1.5^2) * (precision * recall) / 
                    (recall + precision * 1.5^2)
```

```
Variables
–––––––––
S          - # shallow fields
S_null     - # non-identified shallow fields (LLM returned null)
N          - # nested fields
N_null     - # non-identified nested fields (LLM returned null)
N[f].count - # elements in a given nested field f
  
S_id       - # correctly identified shallow fields
N_id       - # 
```

#### completeness
assume there are S shallow fields and N nested fields
- shallow fields will be scored by fields identified
    - (S - S_null) / S
- nested fields will be scored by fields identified and number of subfields identified
    - (N - N_null) / N
    - N[f].count / N[f].target_count (incentivizes extra credit for more fields identified)

#### accuracy
- shallow fields will be scored by percentage of identified fields that are correct
    - S_id / (S - S_null)
- nested fields will be scored by the average accuracy of the entities in the list. And the entities in the list are scored in the same way as the shallow fields.
    - #non-null nested fields / #total nested fields
    - #elements per nesteted field / #elements per nested field in target

###

---
---
---
---
---
Apendix

---

```
event type                                                      | count
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––|–––––––
(13, 'First Identified Complaint')                              | 2205
(21, 'Motion for Consolidation')                                | 493
(22, 'Motion for Appointment of Lead Plaintiff')                | 1942
(23, 'Motion for Appointment of Lead Counsel')                  | 1906
(24, 'Order of Consolidation')                                  | 679
(25, 'Order Appointing Lead Plaintiff')                         | 1766
(26, 'Order Appointing Lead Counsel')                           | 1728
(27, 'Consolidated Complaint Filed')                            | 3157
(29, 'Notice of Voluntary Dismissal')                           | 415
(30, 'Motion to Dismiss')                                       | 2377
(31, 'Order on Motion to Dismiss')                              | 2055
(32, 'Motion for Summary Judgment')                             | 130
(33, 'Order on Motion for Summary Judgment')                    | 68
(35, 'Motion for Class Certification')                          | 489
(36, 'Order on Motion for Class Certification')                 | 269
(37, 'Notice of Settlement')                                    | 132
(38, 'Stipulation of Settlement')                               | 438
(39, 'Motion for Preliminary Approval of Settlement')           | 212
(40, 'Order on Motion for Preliminary Approval of Settlement')  | 534
(41, 'Settlement Fairness Hearing')                             | 1
(42, 'Motion for Final Approval of Settlement')                 | 523
(43, 'Order on Motion for Final Approval of Settlement')        | 222
(44, "Motion for Attorneys' Fees & Expenses")                   | 510
(45, "Order on Motion for Attorneys' Fees & Expenses")          | 229
(47, 'Appeal Filed')                                            | 369
(48, 'Appeal Ruled On')                                         | 318
(50, 'Jury Selection')                                          | 1
(51, 'Trial Begins')                                            | 1
(53, 'Jury Verdict')                                            | 2
(55, 'Notice of Bankruptcy')                                    | 49
(56, 'Notice / Order of Recusal')                               | 26
(57, 'Notice / Order of Case Reassignment')                     | 113
(58, 'Notice / Order of Transfer to Different Court')           | 38
(59, 'Order Assigning Case to Multi-District Litigation')       | 4
(60, "Motion to Substitute Plaintiffs' Counsel")                | 2
(61, "Order on Motion to Substitute Plaintiffs' Counsel")       | 1
(485, 'Non-Consolidated Complaint')                             | 110
(486, 'Order of Dismissal absent a Motion')                     | 19
(623, 'Notice of removal from state court')                     | 21
(624, 'Order on motion to remand')                              | 20
(625, 'Motion for preliminary injunction')                      | 4
(626, 'Order on motion for preliminary injunction')             | 2
(629, 'Voluntarily Dismissed')                                  | 3
(631, 'Motion to Dismiss')                                      | 53
(632, 'Order on Motion to Dismiss')                             | 29
(633, 'Motion for Summary Judgment')                            | 18
(634, 'Order on Motion for Summary Judgment')                   | 11
(635, 'Motion for Default Judgment')                            | 28
(636, 'Order on Motion for Default Judgment')                   | 22
(640, 'Motion for Entry of Consent Judgment')                   | 107
(641, 'Order on Motion for Entry of Consent Judgment')          | 139
(644, 'Notice / Order of Recusal')                              | 1
(645, 'Notice / Order of Case Reassignment')                    | 6
(646, 'Notice / Order of Transfer to Different Court')          | 3
(648, 'Motion to Stay')                                         | 18
(649, 'Order on Motion to Stay')                                | 18
(650, 'Motion to Lift Stay')                                    | 4
(651, 'Order on Motion to Lift Stay')                           | 5
(652, 'Initial Complaint')                                      | 141
(653, 'Amended Complaint')                                      | 26
(655, 'Appeal Filed')                                           | 1
(656, 'Appeal Ruled On')                                        | 1
(664, 'Motion for Default Judgment')                            | 21
(665, 'Order on Motion for Default Judgment')                   | 19
(666, 'Judgment Entered')                                       | 2
(667, 'Motion to Stay')                                         | 147
(668, 'Order on Motion to Stay')                                | 137
(669, 'Motion to Lift Stay')                                    | 17
(670, 'Order on Motion to Lift Stay')                           | 23
(671, 'Appeal Withdrawn')                                       | 59
(1146, 'Change in Docket Tracking')                             | 11
(1149, 'First Identified Complaint')                            | 53
(1150, 'Non-Consolidated Complaint')                            | 7
(1152, 'Motion for Consolidation')                              | 9
(1153, 'Motion for Appointment of Lead Plaintiff')              | 6
(1154, 'Motion for Appointment of Lead Counsel')                | 7
(1155, 'Order of Consolidation')                                | 9
(1156, 'Order Appointing Lead Plaintiff')                       | 3
(1157, 'Order Appointing Lead Counsel')                         | 7
(1158, 'Consolidated Complaint Filed')                          | 21
(1160, 'Voluntarily Dismissed')                                 | 11
(1162, 'Motion to Dismiss')                                     | 40
(1163, 'Order on Motion to Dismiss')                            | 29
(1164, 'Motion for Summary Judgment')                           | 3
(1165, 'Order on Motion for Summary Judgment')                  | 2
(1171, 'Notice of Settlement')                                  | 2
(1172, 'Stipulation of Settlement')                             | 1
(1173, 'Motion for Preliminary Approval of Settlement')         | 9
(1174, 'Order on Motion for Preliminary Approval of Settlement')| 4
(1176, 'Motion for Final Approval of Settlement')               | 4
(1177, 'Order on Motion for Final Approval of Settlement')      | 6
(1178, "Motion for Attorneys' Fees & Expenses")                 | 2
(1179, "Order on Motion for Attorneys' Fees & Expenses")        | 2
(1183, 'Appeal Ruled On')                                       | 2
(1194, 'Notice / Order of Transfer to Different Court')         | 3
(1195, 'Change in Docket Tracking')                             | 6
(1199, 'Notice of removal from state court')                    | 1
(1200, 'Order remanding case to state court')                   | 1
(1203, 'Motion to Stay')                                        | 6
(1204, 'Order on Motion to Stay')                               | 13
(1210, 'Motion to remand case to state court')                  | 17
(2004, 'Motion for Judgment on the Pleadings')                  | 9
(2005, 'Order on Motion for Judgment on the Pleadings')         | 4
```