import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  date,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/* ------------------------------------------------------------------ */
/* Unions kept as text columns rather than pg enums: this is a single- */
/* user app and adding a mail category or error tag should never need  */
/* an ALTER TYPE migration.                                            */
/* ------------------------------------------------------------------ */

export type Section = 'QA' | 'DILR' | 'VARC';
export type QuestionType = 'MCQ' | 'TITA';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SourceKind = 'original' | 'pyq' | 'imported';
export type ContextKind = 'rc_passage' | 'dilr_set';
export type SessionKind = 'daily' | 'drill' | 'mock';
export type AttemptStatus = 'correct' | 'wrong' | 'skipped' | 'unseen';
export type ErrorTag =
  | 'conceptual'
  | 'calculation'
  | 'misread'
  | 'timeout'
  | 'guess';

export type MailCategory =
  | 'cat_admin'
  | 'shortlist'
  | 'interview'
  | 'application'
  | 'documents'
  | 'offer'
  | 'fees'
  | 'info'
  | 'promo'
  | 'review';

/* ------------------------------- content ------------------------------- */

export const topics = pgTable(
  'topics',
  {
    id: serial('id').primaryKey(),
    section: text('section').$type<Section>().notNull(),
    area: text('area').notNull(), // Arithmetic | Algebra | DI | LR | RC | VA | ...
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    /** average questions per CAT paper, from historical analysis */
    catWeightAvg: real('cat_weight_avg').default(0).notNull(),
    /** false = deliberately outside the prep strategy (Geometry, NumSys, ...) */
    inScope: boolean('in_scope').default(false).notNull(),
    /** 1 = study first. Drives the daily generator and the 74-day plan. */
    priority: integer('priority').default(99).notNull(),
    conceptNotes: text('concept_notes'),
  },
  (t) => [uniqueIndex('topics_slug_idx').on(t.slug)],
);

/** Shared parent for RC passages and DILR caselets. */
export const contexts = pgTable('contexts', {
  id: serial('id').primaryKey(),
  kind: text('kind').$type<ContextKind>().notNull(),
  title: text('title'),
  body: text('body').notNull(),
  source: text('source').$type<SourceKind>().default('original').notNull(),
  sourceYear: integer('source_year'),
  sourceSlot: text('source_slot'),
  genre: text('genre'),
  wordCount: integer('word_count'),
  difficulty: text('difficulty').$type<Difficulty>().default('medium').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),
    topicId: integer('topic_id')
      .references(() => topics.id)
      .notNull(),
    contextId: integer('context_id').references(() => contexts.id),
    section: text('section').$type<Section>().notNull(),
    type: text('type').$type<QuestionType>().notNull(),
    stem: text('stem').notNull(),
    /** null for TITA */
    options: jsonb('options').$type<string[] | null>(),
    /** MCQ: the exact option text. TITA: the numeric answer as a string. */
    answer: text('answer').notNull(),
    solution: text('solution').notNull(),
    difficulty: text('difficulty')
      .$type<Difficulty>()
      .default('medium')
      .notNull(),
    source: text('source').$type<SourceKind>().default('original').notNull(),
    sourceYear: integer('source_year'),
    sourceSlot: text('source_slot'),
    tags: text('tags').array().$type<string[]>().default([]).notNull(),
    ingestBatchId: integer('ingest_batch_id').references(
      () => ingestBatches.id,
    ),
    /** human-approved. AI-parsed questions land false until reviewed. */
    verified: boolean('verified').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('questions_topic_idx').on(t.topicId),
    index('questions_section_idx').on(t.section),
    index('questions_context_idx').on(t.contextId),
  ],
);

/* ------------------------------- practice ------------------------------ */

export const sessions = pgTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    kind: text('kind').$type<SessionKind>().notNull(),
    /** local date (YYYY-MM-DD) this session belongs to; one daily per date */
    day: date('day').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    config: jsonb('config').$type<Record<string, unknown>>().default({}).notNull(),
  },
  (t) => [index('sessions_day_idx').on(t.day)],
);

export const attempts = pgTable(
  'attempts',
  {
    id: serial('id').primaryKey(),
    questionId: integer('question_id')
      .references(() => questions.id)
      .notNull(),
    sessionId: integer('session_id')
      .references(() => sessions.id)
      .notNull(),
    /** what the user entered/selected; null when never answered */
    selected: text('selected'),
    isCorrect: boolean('is_correct'),
    /** accumulated across every visit to the question */
    timeMs: integer('time_ms').default(0).notNull(),
    visitCount: integer('visit_count').default(0).notNull(),
    status: text('status').$type<AttemptStatus>().default('unseen').notNull(),
    markedForReview: boolean('marked_for_review').default(false).notNull(),
    errorTag: text('error_tag').$type<ErrorTag>(),
    note: text('note'),
    /** display order inside the session */
    orderIdx: integer('order_idx').default(0).notNull(),
    attemptedAt: timestamp('attempted_at', { withTimezone: true }),
  },
  (t) => [
    index('attempts_session_idx').on(t.sessionId),
    index('attempts_question_idx').on(t.questionId),
    uniqueIndex('attempts_session_question_idx').on(t.sessionId, t.questionId),
  ],
);

/* -------------------------------- mocks -------------------------------- */

export const mocks = pgTable('mocks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  blueprint: jsonb('blueprint')
    .$type<{ VARC: number; DILR: number; QA: number }>()
    .notNull(),
  source: text('source').$type<SourceKind>().default('original').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const mockQuestions = pgTable(
  'mock_questions',
  {
    id: serial('id').primaryKey(),
    mockId: integer('mock_id')
      .references(() => mocks.id)
      .notNull(),
    questionId: integer('question_id')
      .references(() => questions.id)
      .notNull(),
    section: text('section').$type<Section>().notNull(),
    orderIdx: integer('order_idx').notNull(),
  },
  (t) => [index('mock_questions_mock_idx').on(t.mockId)],
);

/**
 * A single sitting of a mock. The section clock lives here, server-side:
 * `sectionEndsAt` is authoritative so a refresh or a crash cannot buy time.
 */
export const mockRuns = pgTable('mock_runs', {
  id: serial('id').primaryKey(),
  mockId: integer('mock_id')
    .references(() => mocks.id)
    .notNull(),
  sessionId: integer('session_id')
    .references(() => sessions.id)
    .notNull(),
  startedAt: timestamp('started_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  /** 0=VARC, 1=DILR, 2=QA — CAT's fixed order */
  currentSection: integer('current_section').default(0).notNull(),
  sectionEndsAt: timestamp('section_ends_at', { withTimezone: true }).notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  score: jsonb('score').$type<Record<string, unknown> | null>(),
});

/** Seeded score -> percentile lookup, per section and overall. */
export const percentileMap = pgTable(
  'percentile_map',
  {
    id: serial('id').primaryKey(),
    scope: text('scope').notNull(), // 'QA' | 'DILR' | 'VARC' | 'OVERALL'
    score: integer('score').notNull(),
    percentile: real('percentile').notNull(),
  },
  (t) => [index('percentile_scope_idx').on(t.scope, t.score)],
);

/* ------------------------------ the 74 days ---------------------------- */

export const dailyPlan = pgTable('daily_plan', {
  day: date('day').primaryKey(),
  dayNum: integer('day_num').notNull(),
  daysLeft: integer('days_left').notNull(),
  phase: text('phase').notNull(), // A | B | C | D
  phaseLabel: text('phase_label').notNull(),
  focusTopicIds: integer('focus_topic_ids')
    .array()
    .$type<number[]>()
    .default([])
    .notNull(),
  qaTarget: integer('qa_target').default(20).notNull(),
  dilrTarget: integer('dilr_target').default(3).notNull(),
  varcTarget: integer('varc_target').default(3).notNull(),
  isMockDay: boolean('is_mock_day').default(false).notNull(),
  note: text('note'),
});

/* ------------------------------ ingestion ------------------------------ */

export const ingestBatches = pgTable('ingest_batches', {
  id: serial('id').primaryKey(),
  label: text('label'),
  rawText: text('raw_text'),
  parsedCount: integer('parsed_count').default(0).notNull(),
  approvedCount: integer('approved_count').default(0).notNull(),
  model: text('model'),
  status: text('status').default('parsed').notNull(), // parsed | approved | discarded
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* --------------------------------- mail -------------------------------- */

export const institutes = pgTable(
  'institutes',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    short: text('short').notNull(),
    domains: text('domains').array().$type<string[]>().notNull(),
    isIim: boolean('is_iim').default(true).notNull(),
    /** rough tier for sorting the inbox: 1=BLACKI, 2=older, 3=newer, 0=admin */
    tier: integer('tier').default(3).notNull(),
  },
  (t) => [uniqueIndex('institutes_short_idx').on(t.short)],
);

export const mailMessages = pgTable(
  'mail_messages',
  {
    id: serial('id').primaryKey(),
    gmailId: text('gmail_id').notNull(),
    threadId: text('thread_id'),
    fromEmail: text('from_email').notNull(),
    fromName: text('from_name'),
    fromDomain: text('from_domain').notNull(),
    replyTo: text('reply_to'),
    subject: text('subject').notNull(),
    snippet: text('snippet'),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull(),
    instituteId: integer('institute_id').references(() => institutes.id),
    category: text('category').$type<MailCategory>().default('review').notNull(),
    confidence: real('confidence').default(0).notNull(),
    classifiedBy: text('classified_by').default('rule').notNull(), // rule | ai | manual
    deadlineAt: timestamp('deadline_at', { withTimezone: true }),
    isActionRequired: boolean('is_action_required').default(false).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex('mail_gmail_id_idx').on(t.gmailId),
    index('mail_category_idx').on(t.category),
    index('mail_received_idx').on(t.receivedAt),
  ],
);

export const cronRuns = pgTable('cron_runs', {
  id: serial('id').primaryKey(),
  ranAt: timestamp('ran_at', { withTimezone: true }).defaultNow().notNull(),
  fetched: integer('fetched').default(0).notNull(),
  newCount: integer('new_count').default(0).notNull(),
  aiCalls: integer('ai_calls').default(0).notNull(),
  durationMs: integer('duration_ms').default(0).notNull(),
  error: text('error'),
});

/** Single-row-per-key store: daily targets, gmail historyId, etc. */
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').$type<unknown>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
