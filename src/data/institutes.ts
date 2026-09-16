export type InstituteSeed = {
  name: string;
  short: string;
  domains: string[];
  isIim: boolean;
  /** 0 = exam admin, 1 = BLACKI, 2 = older IIMs, 3 = newer IIMs */
  tier: number;
};

/**
 * All 21 IIMs plus the CAT exam body. `domains` is matched against the
 * sender domain, the reply-to domain, and (as a fallback) the sender
 * display name — these institutes mail through SendGrid / Amazon SES
 * relays, so the envelope domain is frequently not their own.
 */
export const INSTITUTES: InstituteSeed[] = [
  { name: 'CAT Exam (IIM CAT Centre)', short: 'CAT', domains: ['iimcat.ac.in'], isIim: false, tier: 0 },

  { name: 'IIM Ahmedabad', short: 'IIM-A', domains: ['iima.ac.in'], isIim: true, tier: 1 },
  { name: 'IIM Bangalore', short: 'IIM-B', domains: ['iimb.ac.in'], isIim: true, tier: 1 },
  { name: 'IIM Calcutta', short: 'IIM-C', domains: ['iimcal.ac.in'], isIim: true, tier: 1 },
  { name: 'IIM Lucknow', short: 'IIM-L', domains: ['iiml.ac.in'], isIim: true, tier: 1 },
  { name: 'IIM Kozhikode', short: 'IIM-K', domains: ['iimk.ac.in'], isIim: true, tier: 1 },
  { name: 'IIM Indore', short: 'IIM-I', domains: ['iimidr.ac.in'], isIim: true, tier: 1 },

  { name: 'IIM Mumbai', short: 'IIM-Mumbai', domains: ['iimmumbai.ac.in', 'nitie.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Shillong', short: 'IIM-Shillong', domains: ['iimshillong.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Rohtak', short: 'IIM-Rohtak', domains: ['iimrohtak.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Ranchi', short: 'IIM-Ranchi', domains: ['iimranchi.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Raipur', short: 'IIM-Raipur', domains: ['iimraipur.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Tiruchirappalli', short: 'IIM-Trichy', domains: ['iimtrichy.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Udaipur', short: 'IIM-U', domains: ['iimu.ac.in'], isIim: true, tier: 2 },
  { name: 'IIM Kashipur', short: 'IIM-Kashipur', domains: ['iimkashipur.ac.in'], isIim: true, tier: 2 },

  { name: 'IIM Nagpur', short: 'IIM-Nagpur', domains: ['iimnagpur.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Visakhapatnam', short: 'IIM-Vizag', domains: ['iimv.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Bodh Gaya', short: 'IIM-BodhGaya', domains: ['iimbg.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Amritsar', short: 'IIM-Amritsar', domains: ['iimamritsar.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Sambalpur', short: 'IIM-Sambalpur', domains: ['iimsambalpur.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Sirmaur', short: 'IIM-Sirmaur', domains: ['iimsirmaur.ac.in'], isIim: true, tier: 3 },
  { name: 'IIM Jammu', short: 'IIM-Jammu', domains: ['iimj.ac.in'], isIim: true, tier: 3 },
];

/** Gmail `q=` clause covering every domain above, used by the cron sync. */
export const GMAIL_QUERY = `(${INSTITUTES.flatMap((i) => i.domains)
  .map((d) => `from:${d}`)
  .join(' OR ')} OR from:cap2026.iimj.ac.in OR subject:"CAT 2026" OR subject:"CAT 2025")`;
