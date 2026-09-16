import type { Difficulty, QuestionType } from '@/db/schema';

export type QSeed = {
  /** topic slug from src/data/topics.ts */
  topic: string;
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  /** MCQ only */
  options?: string[];
  answer: string;
  solution: string;
  tags?: string[];
  /**
   * Independent recomputation of the answer from first principles.
   * The seed script runs this and refuses to insert the question if it
   * disagrees with `answer` — so an authoring slip fails loudly at seed
   * time instead of quietly teaching the wrong method at 6am.
   */
  verify: () => number | string;
};

/** Round to 4dp so float noise never fails a correct question. */
export const r = (n: number) => Math.round(n * 10000) / 10000;
