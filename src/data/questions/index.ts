import type { QSeed } from './types';
import { TSD } from './tsd';
import { TIME_WORK } from './time-work';
import { PERCENTAGES } from './percentages';
import { PROFIT_LOSS } from './profit-loss';
import { RATIO } from './ratio-proportion';
import { AVERAGES } from './averages-mixtures';
import { SI_CI } from './si-ci';
import { WORD_PROBLEMS } from './word-problems';
import { EQUATIONS } from './equations';
import { INEQUALITIES } from './inequalities';
import { FUNCTIONS } from './functions';
import { LOGARITHMS } from './logarithms';
import { PROGRESSIONS } from './progressions';
import { MAXIMA } from './maxima-minima';
import { POLYNOMIALS } from './polynomials';

/**
 * Original CAT-pattern questions authored for this app. Every one carries a
 * `verify` function that recomputes the answer independently; the seed
 * script runs all of them and refuses to insert on any mismatch.
 *
 * These are labelled source: 'original' in the database — they are NOT real
 * previous-year questions. Genuine PYQs enter through /admin/ingest.
 */
export const SEED_QUESTIONS: QSeed[] = [
  ...TSD, ...TIME_WORK, ...PERCENTAGES, ...PROFIT_LOSS,
  ...RATIO, ...AVERAGES, ...SI_CI, ...WORD_PROBLEMS,
  ...EQUATIONS, ...INEQUALITIES, ...FUNCTIONS, ...LOGARITHMS,
  ...PROGRESSIONS, ...MAXIMA, ...POLYNOMIALS,
];

export type { QSeed };
