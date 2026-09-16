import type { MailCategory } from '@/db/schema';

export const CATEGORY_META: Record<
  MailCategory,
  { label: string; blurb: string; order: number }
> = {
  offer: { label: 'Offers & Waitlist', blurb: 'Converts, waitlist movement, acceptance deadlines', order: 1 },
  shortlist: { label: 'Shortlists & Calls', blurb: 'WAT-PI shortlists and interview calls', order: 2 },
  interview: { label: 'Interview Logistics', blurb: 'Slot booking, dates, venues, panels, WAT', order: 3 },
  fees: { label: 'Fees & Payment', blurb: 'Acceptance deposits, admission fees, receipts', order: 4 },
  documents: { label: 'Documents', blurb: 'Marksheets, certificates, verification', order: 5 },
  application: { label: 'Applications & Forms', blurb: 'Application windows, forms, deadlines', order: 6 },
  cat_admin: { label: 'CAT Admin', blurb: 'Admit card, slot, response sheet, answer key, result', order: 7 },
  info: { label: 'Info & Updates', blurb: 'Announcements, brochures, newsletters', order: 8 },
  promo: { label: 'Promotions', blurb: 'Non-IIM B-school marketing', order: 9 },
  review: { label: 'Needs Review', blurb: 'Unclassified — check these manually', order: 10 },
};

type Rule = { category: MailCategory; re: RegExp; confidence: number };

/**
 * Ordered most-consequential first: a mail that is both a shortlist and a
 * slot-booking instruction should file under Shortlists, not Logistics.
 * First match wins.
 */
const RULES: Rule[] = [
  {
    category: 'offer',
    confidence: 0.95,
    re: /\b(offer of admission|admission offer|letter of offer|final (?:merit list|result|selection|list)|merit list|wait ?list|waitlisted|converted|seat (?:confirm|accept|allot)|accept(?:ance)? of (?:the )?offer|provisional admission)\b/i,
  },
  {
    category: 'shortlist',
    confidence: 0.95,
    re: /\b(short ?list(?:ed|ing)?|call for (?:interview|pi|wat|gd)|interview call|selected for (?:the )?(?:wat|pi|gd|personal interview)|candidature .*short|stage[- ]?(?:1|2|i|ii) (?:short|call))\b/i,
  },
  {
    category: 'interview',
    confidence: 0.9,
    re: /\b(slot ?book|book(?:ing)? your slot|interview (?:schedule|date|venue|panel|link|reschedul)|pi (?:schedule|date|venue|slot)|wat[- ]?pi|written ability test|reporting time|panel (?:details|allocation)|video interview|zoom link|cap (?:process|interview|pi))\b/i,
  },
  {
    category: 'fees',
    confidence: 0.9,
    re: /\b(fee (?:payment|receipt|due|structure|reminder)|payment (?:link|receipt|confirm|failed|success)|acceptance (?:fee|deposit|amount)|tuition fee|instal?lment|remit(?:tance)?|transaction (?:id|receipt)|pay (?:the )?(?:fee|amount))\b/i,
  },
  {
    category: 'documents',
    confidence: 0.85,
    re: /\b(document (?:upload|submission|verification|required)|mark ?sheet|transcript|provisional certificate|degree certificate|category certificate|caste certificate|(?:ews|nc-?obc|obc|sc\/st|pwd|dap) certificate|attest(?:ed|ation)|verification of (?:document|credential)|upload your|work ?ex(?:perience)? (?:proof|certificate))\b/i,
  },
  {
    category: 'application',
    confidence: 0.85,
    re: /\b(application (?:form|window|portal|fee|deadline|status|submitted|received)|apply (?:now|online)|registration (?:open|clos|window|successful)|last date to apply|submit (?:your )?application|complete your (?:application|profile))\b/i,
  },
  {
    category: 'promo',
    confidence: 0.8,
    re: /\b(webinar|admissions? open|scholarship (?:program|offer)|why choose|rank(?:ed|ing) \d|placement (?:report|highlights)|download (?:the )?brochure|limited seats|apply before|our mba program)\b/i,
  },
];

/** CAT exam-body subjects, only consulted for iimcat.ac.in mail. */
const CAT_ADMIN_RE =
  /\b(admit card|hall ticket|test (?:slot|city|centre|center)|response sheet|answer key|objection|scorecard|score card|result (?:declar|announc)|registration (?:number|confirm)|candidate login|mock test link)\b/i;

const DEADLINE_SIGNAL_RE =
  /\b(last date|deadline|due (?:by|on|date)|on or before|expires? on|within \d+ (?:day|hour|working day)|action required|immediate(?:ly)? (?:action|attention)|mandatory|must (?:submit|complete|confirm|pay|book)|failing which|will be forfeited|no further extension)\b/i;

const MONTHS =
  'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t)?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';

const DATE_PATTERNS: RegExp[] = [
  // 15th March 2027 / 15 Mar 2027
  new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTHS})\\.?,?\\s+(\\d{4})\\b`, 'i'),
  // March 15, 2027
  new RegExp(`\\b(${MONTHS})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b`, 'i'),
  // 15/03/2027 or 15-03-2027 (day-first, the Indian convention)
  /\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/,
];

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function extractDeadline(text: string): Date | null {
  for (const re of DATE_PATTERNS) {
    const m = text.match(re);
    if (!m) continue;
    let day: number, month: number, year: number;

    if (re === DATE_PATTERNS[2]) {
      day = Number(m[1]);
      month = Number(m[2]) - 1;
      year = Number(m[3]);
    } else if (re === DATE_PATTERNS[1]) {
      month = MONTH_INDEX[m[1].slice(0, 3).toLowerCase()];
      day = Number(m[2]);
      year = Number(m[3]);
    } else {
      day = Number(m[1]);
      month = MONTH_INDEX[m[2].slice(0, 3).toLowerCase()];
      year = Number(m[3]);
    }

    if (month === undefined || month < 0 || month > 11) continue;
    if (day < 1 || day > 31) continue;
    const d = new Date(year, month, day, 23, 59, 59);
    if (Number.isNaN(d.getTime())) continue;
    return d;
  }
  return null;
}

export type Classification = {
  category: MailCategory;
  confidence: number;
  isActionRequired: boolean;
  deadlineAt: Date | null;
};

/**
 * Rules first — cheap, deterministic, auditable. Anything that scores below
 * the AI threshold is handed to the model by the caller; anything the model
 * is also unsure about stays in `review` rather than being silently filed.
 */
export function classify(input: {
  subject: string;
  snippet?: string | null;
  fromDomain: string;
  isKnownInstitute: boolean;
  isCatAdmin: boolean;
}): Classification {
  const text = `${input.subject} ${input.snippet ?? ''}`;
  const deadlineAt = extractDeadline(text);
  const isActionRequired = DEADLINE_SIGNAL_RE.test(text) || deadlineAt !== null;

  const base = { isActionRequired, deadlineAt };

  if (input.isCatAdmin) {
    return {
      ...base,
      category: 'cat_admin',
      confidence: CAT_ADMIN_RE.test(text) ? 0.98 : 0.8,
    };
  }

  for (const rule of RULES) {
    if (rule.re.test(text)) {
      // Promo wording from a real IIM is far more likely a genuine update.
      if (rule.category === 'promo' && input.isKnownInstitute) {
        return { ...base, category: 'info', confidence: 0.6 };
      }
      return { ...base, category: rule.category, confidence: rule.confidence };
    }
  }

  if (input.isKnownInstitute) {
    return { ...base, category: 'info', confidence: 0.5 };
  }
  return { ...base, category: 'review', confidence: 0.2 };
}

/** Below this, the caller escalates to the AI classifier. */
export const AI_ESCALATION_THRESHOLD = 0.6;
