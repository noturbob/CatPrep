# CatPrep

A personal, targeted preparation app for **CAT 2026** (Sunday 29 November 2026).

Daily practice, a faithful CAT test interface with the on-screen calculator,
timed mocks, per-question time tracking, an error log, and a dashboard that
files IIM admission mail into categories so nothing gets missed.

## The strategy this is built around

QA is deliberately narrowed to **Arithmetic and easy-to-mid Algebra only**,
skipping Geometry, Mensuration, Coordinate Geometry, Number System, P&C,
Probability and Set Theory.

That is not a gap, it is a trade. Across recent papers Arithmetic is 8–10
questions and Algebra 5–6, together **60–70% of the 22-question QA section** — so
the whitelist covers 14–16 of 22, and a 95th-percentile QA sectional needs only
about **30 raw marks ≈ 10 net correct**.

Because the skips are deliberate, mock scoring reports **attemptable accuracy**
(correct ÷ in-scope attempted) as the headline and counts out-of-scope questions
separately, so a correct strategy never reads as failure.

Daily target: **20 QA · 3 DILR sets · 3 RC passages**, with a mock most Sundays.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · Drizzle ORM · Postgres ·
single-password auth via an HMAC-signed cookie.

## Setup

```bash
pnpm install
cp .env.example .env.local        # fill in APP_PASSWORD, AUTH_SECRET, DATABASE_URL
pnpm db:push                      # create the schema
pnpm seed                         # topics, 21 IIMs, the 74-day plan, percentile anchors
pnpm seed:questions               # 150 verified practice questions
pnpm dev
```

Works against a local Postgres or a hosted one (Neon) — same driver, just swap
`DATABASE_URL`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | development server |
| `pnpm db:push` | apply the Drizzle schema |
| `pnpm seed` | topics, institutes, 74-day plan, percentile map |
| `pnpm seed:questions` | verify and load the authored question bank |
| `pnpm test:parser` | regression tests for the PYQ import parser |
| `pnpm lint` | ESLint, including the React compiler rules |

## Content, and what is trustworthy

The bank ships with **150 original CAT-pattern questions**, stored as
`source: 'original'`. They are **not** real previous-year questions.

Every one carries a `verify()` function that recomputes its answer from first
principles, and `pnpm seed:questions` **refuses to load the bank if any answer
disagrees** — so an authoring slip fails at seed time rather than quietly
teaching a wrong method. It also rejects MCQs without four options, answers
missing from their options, and solutions under 40 characters.

Real previous-year questions, RC passages and DILR sets come in through
`/admin/ingest`, which parses pasted dumps **deterministically** — no model, no
cost, and every field traceable to a line you can point at. Imported questions
land unverified and are invisible to practice until approved.

## Mock integrity

The section clock is **server state only**:

- expiry is resolved on read, so an abandoned mock auto-submits
- returning late does not reset the clock — five minutes late leaves 35 in the
  next section, not a fresh 40
- every answer write is checked against the deadline and the current section
- the browser trusts the server's clock, not the machine's

Answers and solutions are never sent to the browser before a question is
submitted.

Scorecards also report how representative the paper was. A mock drawn from a
bank that is mostly TITA and entirely in-scope **overstates** the score, and says
so, rather than letting a flattering percentile stand unqualified.

## Layout

```
src/
  app/(app)/      dashboard, practice, drill, bank, mock, tracker, errors, mail, admin
  components/     question player, mock player, CAT calculator, charts
  data/           topic whitelist with concept notes, the question bank, IIM list
  lib/            daily generator, mock engine, scoring, ingest parser, mail rules
  db/             Drizzle schema
scripts/          seeding and tests
```

## Status

Working: daily practice loop, tracker, error log, question ingest, mock engine,
topic drill, bank browser.

Not built yet: the IIM mail dashboard (its classification rules and the 21 IIM
domains are written and tested; the Gmail OAuth, sync route and cron job are
not wired).
