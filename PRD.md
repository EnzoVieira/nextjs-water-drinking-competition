# PRD — Habit Competition Platform

# 1. Overview

## Summary

The product will evolve from a **water-only competition tracker** into a **general-purpose habit competition platform**.

Users will be able to create competitions for **any measurable habit**, such as:

- Drinking water
- Studying
- Running
- Reading
- Exercising
- Meditating
- Any other habit with measurable progress

Each competition will define **one clear metric**, and participants will compete based on that metric.

The system will rank users via leaderboard, visualize consistency via heatmaps, and encourage habit formation via competition.

---

# 2. WHY — Purpose

## Problem

The current product is limited to water intake tracking.

This creates several constraints:

- Limits audience to people interested in water tracking
- Prevents broader habit tracking use cases
- Reduces engagement potential
- Reduces long-term retention

However, the core mechanic — competitive tracking with leaderboard and heatmap — is universally applicable to many habits.

---

## Vision

Transform the product into:

> A competitive habit tracking platform where users can create competitions for any habit and compete with others.

---

## Goals

### Primary goal

Allow users to create competitions for **any measurable habit**, not just water.

---

### Secondary goals

Increase:

- User engagement
- Daily active usage
- Retention
- Competition creation
- Social participation

---

## Non-Goals

This version will NOT support:

- Multiple metrics per competition
- Complex scoring formulas configurable by users
- Team competitions
- Private metrics per user
- Custom leaderboard formulas beyond predefined options

---

# 3. Core Concept

## Fundamental Rule

Each competition measures exactly ONE metric.

A competition answers one question:

> "Who did more of X?"

Examples:

- Who drank more water?
- Who studied more minutes?
- Who ran more distance?
- Who exercised more times?
- Who was consistent for more days?

---

# 4. Core Definitions

## Competition

A competition represents a challenge between users over a time period.

Each competition defines:

- What habit is being tracked
- How progress is measured
- How winner is determined

---

## Metric

A metric defines how progress is measured.

Each competition has exactly one metric.

Examples:

- Minutes studied
- Distance ran
- Pages read
- Number of sessions
- Daily completion (yes/no)

---

## Entry

An entry represents progress made by a user on a specific day.

Examples:

- 60 minutes studied
- 3 km ran
- Completed habit today

---

# 5. Supported Metric Types

The system will support exactly 3 metric types.

These types cover nearly all habit tracking scenarios while keeping UX simple.

---

## Type 1 — Quantity

User records a numeric value.

User answers:

> "How much did I do?"

Examples:

- 60 minutes studied
- 2000 ml water
- 5 km ran
- 30 pages read

---

## Type 2 — Count

User records number of times an activity was performed.

User answers:

> "How many times did I do it?"

Examples:

- 3 study sessions
- 2 workouts
- 4 meditation sessions

---

## Type 3 — Check

User records whether they completed the habit.

User answers:

> "Did I do it today?"

Examples:

- Studied today
- Exercised today
- Read today

This is binary: yes or no.

---

# 6. Competition Creation UX

This section defines the exact expected user experience.

This is the most critical part of the product.

---

# Step 1 — Start Creation

User clicks:

Create Competition

---

# Step 2 — Enter Basic Information

Screen displays:

Title field:

Name
Input example:

Study Challenge

Description field:

Description
Input example:

Study every day to prepare for exams

User clicks:

Continue

---

# Step 3 — Select Metric Type

Screen displays:

How will this competition be measured?

User sees 3 options:

Option 1:

Quantity total
Description: Track measurable amounts like minutes, distance, or volume

Examples shown:

minutes studied
liters of water
kilometers ran

---

Option 2:

Number of times
Description: Track how many times you performed the activity

Examples shown:

study sessions
workouts
meditation sessions

---

Option 3:

Daily completion
Description: Track whether you completed the habit each day

Examples shown:

studied today
exercised today
read today

---

User selects one option.

User clicks Continue.

---

# Step 4 — Define Unit (Only for Quantity and Count)

If user selected Quantity or Count:

Screen displays:

What unit will be tracked?

Input field:

Examples shown inside input:

minutes
meters
pages
sessions
liters

User types custom unit.

Example:

minutes

User clicks Continue.

---

If user selected Check:

This step is skipped.

---

# Step 5 — Select Ranking Method

Screen displays:

How should the winner be determined?

Options:

Option 1 — Total amount

Description:

User with highest total wins

---

Option 2 — Consistency

Description:

User with longest daily streak wins

---

Option 3 — Combined

Description:

Total amount plus consistency bonus

Recommended option.

---

User selects one option.

User clicks Continue.

---

# Step 6 — Select Date Range

Screen displays:

Start date
End date

User selects range.

User clicks:

Create Competition

---

# Step 7 — Competition Created

System creates competition.

System generates invite code.

User sees:

Competition created successfully

Invite code displayed.

User can share code.

---

# 7. Joining Competition UX

User enters invite code.

User joins competition.

User appears in leaderboard.

---

# 8. Recording Progress UX

This experience depends on metric type.

This is critical.

Must be extremely simple.

---

# Case 1 — Quantity

Example:

Study minutes

User sees:

Add entry

Input field:

60

Unit label:

minutes

Button:

Save

---

User mental model:

"How many minutes did I study?"

---

# Case 2 — Count

Example:

Workout sessions

User sees:

Add session

Button:

Add

Each click adds one.

---

User mental model:

"Add one session"

---

# Case 3 — Check

Example:

Studied today

User sees:

Did you complete this today?

Button:

Mark as completed

---

User mental model:

"I did it today"

---

# 9. Leaderboard UX

User sees ranked list.

Example:

1. John — 520 minutes
2. Anna — 480 minutes
3. Mike — 320 minutes

---

If Check competition:

Example:

1. John — 18 days
2. Anna — 15 days
3. Mike — 10 days

---

# 10. Heatmap UX

Heatmap remains core feature.

Shows daily activity.

Each day shows:

Quantity competitions:

Amount per day

Count competitions:

Number per day

Check competitions:

Completed or not completed

---

Purpose:

Visualize consistency.

---

# 11. Competition Details UX

Competition page displays:

Competition name

Description

Leaderboard

Heatmap

Entry input section

Members

Invite code

---

# 12. User Mental Model

System must always feel like answering one simple question.

For Quantity:

How much did I do?

For Count:

How many times did I do it?

For Check:

Did I do it today?

---

The system must never require complex input.

Simplicity is critical.

---

# 13. Examples

Example 1 — Water

Metric type:

Quantity

Unit:

ml

---

Example 2 — Study

Metric type:

Quantity

Unit:

minutes

---

Example 3 — Running

Metric type:

Quantity

Unit:

meters

---

Example 4 — Gym

Metric type:

Count

Unit:

sessions

---

Example 5 — Reading habit

Metric type:

Check

---

# 14. Success Criteria

Feature is successful if users can:

Create competitions for habits other than water

Understand immediately how to log progress

Log progress daily

Understand leaderboard

Understand heatmap

---

# 15. Expected Outcome

After implementation, product becomes:

Habit competition platform

instead of

Water tracker

---

# 16. Guiding Principles

Priority order:

Clarity

Simplicity

Speed

Low friction

---

# 17. Critical Rule

Each competition tracks exactly one metric.

This must never be violated.

---

# END OF DOCUMENT
