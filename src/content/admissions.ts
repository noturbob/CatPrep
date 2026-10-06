// "CAT 2026 Admissions Guide: Cutoffs, Weightage, Percentile Calculator and Top 50 B-Schools",
// 6 Oct 2026. Figures are coaching-site estimates or compilations unless the guide says otherwise.

/** [scaled score, percentile] points, ascending. */
export type Curve = [number, number][];

export type CurvePanel = { name: string; max: number; y2024: Curve; y2025: Curve; note?: string };

// Sections: 2024 from Cracku's actual results; 2025 VARC/DILR are the midpoints of IMS's per-slot
// ranges as printed in the VARC and DILR guides. QA 2025 and both Overall curves exist only as a
// chart in the Admissions guide; those points were read off it (about ±1–2 marks).
export const curves: CurvePanel[] = [
  {
    name: "VARC", max: 72,
    y2024: [[18.2, 80], [20.4, 85], [24, 90], [30, 95], [40.3, 99]],
    y2025: [[17.5, 80], [19.5, 85], [24, 90], [31, 95], [40.5, 99]],
  },
  {
    name: "DILR", max: 66,
    y2024: [[17, 80], [19.5, 85], [22.5, 90], [27, 95], [37.8, 99]],
    y2025: [[12, 80], [14, 85], [18, 90], [24, 95], [32, 99]],
  },
  {
    name: "QA", max: 66,
    y2024: [[11.6, 80], [13.7, 85], [17, 90], [22, 95], [33, 99]],
    y2025: [[12.7, 80], [14.4, 85], [16.8, 90], [23, 95], [30.4, 99]],
    note: "2025 points read off the guide’s chart",
  },
  {
    name: "Overall", max: 198,
    y2024: [[37, 75], [44, 80], [49, 85], [58, 90], [64, 93], [70, 95], [79, 97], [95, 99]],
    y2025: [[38, 80], [43, 85], [52, 90], [67, 95], [77, 98], [86, 99]],
    note: "Read off the guide’s chart, about ±2 marks",
  },
];

export type Reading = { kind: "below"; floor: number } | { kind: "above" } | { kind: "at"; p: number };

/** Linear interpolation along a curve. Outside its range, says so instead of extrapolating. */
export function percentileFor(curve: Curve, score: number): Reading {
  const [first] = curve;
  const last = curve[curve.length - 1];
  if (score < first[0]) return { kind: "below", floor: first[1] };
  if (score > last[0]) return { kind: "above" };
  for (let i = 1; i < curve.length; i++) {
    const [s0, p0] = curve[i - 1];
    const [s1, p1] = curve[i];
    if (score <= s1) return { kind: "at", p: p0 + ((score - s0) / (s1 - s0)) * (p1 - p0) };
  }
  return { kind: "above" };
}

export const stages = [
  { title: "CAT result", body: "An overall percentile plus one for each section (VARC, DILR, QA). The overall percentile comes from your total score, not from averaging the three sectional percentiles." },
  { title: "Minimum cutoffs", body: "Each IIM sets an overall and a sectional minimum per category. Clearing them only makes you eligible." },
  { title: "Shortlist", body: "Each IIM ranks eligible candidates on its own mix of CAT score, 10th, 12th and graduation marks, work experience and diversity (gender and academic background), then sends interview calls." },
  { title: "WAT/GD and personal interview", body: "Several newer IIMs run a joint process with a common interview instead of separate ones." },
  { title: "Final selection", body: "A composite of CAT, interview, written test and profile, with weights that differ sharply by IIM." },
];

// [IIM, CAT, PI, WAT/GD, profile]; null = no separate weight.
export const weightage: [string, number, number, number | null, number][] = [
  ["Ranchi", 65, 12.5, 2.5, 20],
  ["Rohtak", 60, 20, null, 20],
  ["Mumbai", 60, 20, null, 20],
  ["Udaipur", 55, 25, null, 20],
  ["Tiruchirappalli", 52, 20, null, 28],
  ["Bodh Gaya", 50, 25, null, 25],
  ["Nagpur", 45, 25, null, 30],
  ["Jammu", 42, 30, null, 28],
  ["Kashipur", 41, 25, null, 34],
  ["Indore", 40, 45, null, 15],
  ["Shillong", 40, 40, null, 20],
  ["Sambalpur", 40, 25, null, 35],
  ["Kozhikode", 35, 35, 20, 10],
  ["Sirmaur", 35, 20, null, 45],
  ["Raipur", 33.3, 26.7, null, 40],
  ["Calcutta", 30, 48, 8, 14],
  ["Lucknow", 30, 40, 10, 20],
  ["Ahmedabad", 25, 50, 10, 15],
  ["Bangalore", 25, 40, 10, 25],
  ["Visakhapatnam", 25, 48, null, 27],
];

export const CATEGORIES = ["General", "EWS", "NC-OBC", "SC", "ST", "PwD"] as const;

// Table A: practical call range by category, expected for CAT 2026 (Cracku estimates).
export const callRanges: [string, ...string[]][] = [
  ["Ahmedabad", "99–100", "99–99.5", "98–99.3", "85–95", "75–90", "70–85"],
  ["Bangalore", "99–100", "98–99.5", "97–99", "85–97", "75–90", "70–85"],
  ["Calcutta", "99–100", "98–99.5", "97–99", "80–93", "70–88", "65–85"],
  ["Lucknow", "97–99", "93–98", "93–97", "75–90", "65–85", "60–80"],
  ["Kozhikode", "97–99", "93–97", "90–96", "75–90", "65–85", "60–80"],
  ["Indore", "97–99", "94–98", "90–96", "70–88", "55–80", "60–80"],
  ["Mumbai", "97–99", "93–97", "90–96", "75–90", "65–85", "60–80"],
  ["Rohtak", "97–99", "93–97", "85–93", "65–80", "55–70", "50–65"],
  ["Shillong", "95–98", "90–96", "85–94", "70–85", "60–80", "55–75"],
  ["Udaipur", "95–98", "88–95", "85–94", "65–85", "45–70", "45–70"],
  ["Raipur", "95–98", "88–95", "85–94", "65–85", "45–70", "45–70"],
  ["Tiruchirappalli", "95–98", "88–95", "85–94", "65–85", "45–70", "45–70"],
  ["Kashipur", "94–97", "88–94", "85–93", "65–80", "45–65", "45–65"],
  ["Ranchi", "94–97", "88–94", "85–93", "65–80", "45–65", "45–65"],
  ["Nagpur", "94–97", "88–94", "85–93", "65–80", "45–65", "45–65"],
  ["Guwahati", "94–97", "88–94", "85–92", "65–80", "50–70", "50–70"],
  ["Sambalpur", "93–97", "85–93", "80–90", "60–78", "45–65", "45–65"],
  ["Amritsar", "92–96", "88–94", "82–90", "60–78", "45–65", "45–65"],
  ["Visakhapatnam", "92–96", "85–92", "80–90", "55–75", "45–65", "45–65"],
  ["Bodh Gaya", "92–96", "85–92", "80–90", "60–78", "45–65", "45–65"],
  ["Sirmaur", "92–96", "85–92", "80–90", "60–78", "45–65", "45–65"],
  ["Jammu", "92–96", "85–92", "80–90", "60–78", "45–65", "45–65"],
];

// Table B: official minimum percentile, general category, CAT 2025 cycle. [IIM, VARC, DILR, QA, overall]
export const officialMinimums: [string, string, string, string, string][] = [
  ["Ahmedabad", "85", "85", "85", "95"],
  ["Bangalore", "80", "75", "75", "85"],
  ["Calcutta", "80", "80", "75", "85"],
  ["Lucknow", "85", "85", "85", "90"],
  ["Kozhikode", "75", "75", "75", "85"],
  ["Indore", "80", "80", "80", "90"],
  ["Mumbai", "80", "80", "75", "85"],
  ["Shillong", "75", "75", "75", "No overall minimum"],
  ["Rohtak", "None", "None", "None", "97"],
  ["Udaipur", "75", "75", "75", "94"],
  ["Raipur", "75", "75", "75", "95.25"],
  ["Ranchi", "75", "75", "75", "95.25"],
  ["Tiruchirappalli", "75", "75", "75", "95.25"],
  ["Kashipur", "75", "75", "75", "95.25"],
  ["Nagpur", "70", "70", "70", "95"],
  ["Bodh Gaya", "75", "75", "75", "95"],
  ["Jammu", "72", "72", "72", "91"],
  ["Amritsar", "80", "75", "80", "90"],
  ["Sambalpur", "None", "None", "None", "90"],
  ["Sirmaur", "65", "65", "65", "90"],
  ["Guwahati", "75", "75", "75", "85"],
  ["Visakhapatnam", "70", "70", "70", "82"],
];

// Table C: overall minimum (VARC–DILR–QA) by category at IIM A, B and C, 2026–28 policies.
export const abcMinimums: [string, ...string[]][] = [
  ["Ahmedabad", "95 (85–85–85)", "95", "90", "85", "75", "85"],
  ["Bangalore", "85 (80–75–75)", "75 (70–65–65)", "75 (70–65–65)", "70 (65–60–60)", "65 (55–55–55)", "60 (50–50–50)"],
  ["Calcutta", "85 (80–80–75)", "75 (70–65–65)", "75 (70–65–65)", "70 (65–60–60)", "65 (55–55–55)", "55 (45–45–45)"],
];

// Table D: lowest percentile admitted, 2025 admissions (RTI data).
export const lowestAdmits: [string, ...string[]][] = [
  ["Ahmedabad", "90.98", "97.3", "77.53", "85.39", "73.14", "73.25"],
  ["Bangalore", "95.45", "91.03", "81.7", "73.04", "76.33", "—"],
  ["Lucknow", "91.02", "90.13", "86.2", "67.8", "60.3", "60.16"],
  ["Kozhikode", "91.03", "82.26", "75.2", "67.8", "55.17", "56.52"],
  ["Indore", "92.43", "92.14", "81.26", "64.71", "49.25", "63.68"],
  ["Mumbai", "96.79", "90.02", "92.02", "80.13", "65.89", "92.04"],
  ["Rohtak", "97", "93.04", "83.19", "63.61", "50", "11"],
  ["Udaipur", "95.26", "86.43", "81.2", "70.76", "43.09", "70.63"],
  ["Tiruchirappalli", "95.01", "81.63", "81.04", "66.16", "51.04", "72.68"],
  ["Kashipur", "95.09", "81.48", "81.04", "66.43", "42.59", "43.29"],
  ["Sirmaur", "95", "81.02", "81.02", "66.06", "42.15", "43.29"],
  ["Nagpur", "94", "77.01", "77", "60.02", "40.18", "40.01"],
  ["Sambalpur", "85.01", "80", "75.01", "55.08", "42.48", "41.1"],
  ["Visakhapatnam", "82.03", "73.22", "72.99", "50.42", "40.09", "41.34"],
];

// Table E: non-IIMs with category-wise call ranges.
export const nonIimRanges: [string, ...string[]][] = [
  ["FMS Delhi", "98–99.5", "97.5–99", "97–99", "85–95", "70–85", "60–80"],
  ["IIT Bombay (SJMSOM)", "97–99", "95–98", "90–92", "74–82", "74–79", "71–80"],
  ["IIT Delhi (DMS)", "96–99", "88–95", "88–95", "70–85", "70–80", "70–80"],
];

// NIRF 2025 top 50: [rank, institute, main exam, expected general call range or "—"].
export const top50: [number, string, string, string][] = [
  [1, "IIM Ahmedabad", "CAT", "99–100"],
  [2, "IIM Bangalore", "CAT", "99–100"],
  [3, "IIM Kozhikode", "CAT", "97–99"],
  [4, "IIT Delhi (DMS)", "CAT", "96–99"],
  [5, "IIM Lucknow", "CAT", "97–99"],
  [6, "IIM Mumbai", "CAT", "97–99"],
  [7, "IIM Calcutta", "CAT", "99–100"],
  [8, "IIM Indore", "CAT", "97–99"],
  [9, "MDI Gurgaon", "CAT", "95–98"],
  [10, "XLRI Jamshedpur", "XAT", "—"],
  [11, "SIBM Pune", "SNAP", "—"],
  [12, "IIT Kharagpur (VGSoM)", "CAT", "90–94"],
  [13, "IIT Madras (DoMS)", "CAT", "90–94"],
  [14, "IIT Bombay (SJMSOM)", "CAT", "97–99"],
  [15, "IIM Raipur", "CAT", "95–98"],
  [16, "IIM Tiruchirappalli", "CAT", "95–98"],
  [17, "IIFT Delhi", "CAT", "—"],
  [18, "IIM Ranchi", "CAT", "94–97"],
  [19, "IIM Rohtak", "CAT", "97–99"],
  [20, "SPJIMR Mumbai", "CAT or GMAT, profile-based", "85–98"],
  [21, "IIM Udaipur", "CAT", "95–98"],
  [22, "IIT Roorkee (DoMS)", "CAT", "88–92"],
  [23, "IIM Kashipur", "CAT", "94–97"],
  [24, "NMIMS Mumbai", "NMAT", "—"],
  [25, "IIM Nagpur", "CAT", "94–97"],
  [26, "Amrita Vishwa Vidyapeetham, Coimbatore", "Several; check the site", "—"],
  [27, "IIT Kanpur (DoMS)", "CAT", "90–95"],
  [28, "Jamia Millia Islamia, Delhi", "Own entrance test", "—"],
  [29, "IIM Visakhapatnam", "CAT", "92–96"],
  [30, "IMT Ghaziabad", "CAT, XAT, GMAT", "90–96"],
  [31, "IIM Bodh Gaya", "CAT", "92–96"],
  [32, "Chandigarh University", "Own process", "—"],
  [33, "MICA Ahmedabad", "CAT, XAT or GMAT, plus MICAT", "—"],
  [34, "IIM Sambalpur", "CAT", "93–97"],
  [35, "IIM Jammu", "CAT", "92–96"],
  [36, "UPES Dehradun", "Several; check the site", "—"],
  [37, "Great Lakes Chennai", "CAT, XAT, GMAT", "85–90"],
  [38, "IIM Shillong", "CAT", "95–98"],
  [39, "TAPMI Manipal", "CAT, XAT, GMAT", "85–90"],
  [40, "IMI Delhi", "CAT, XAT, GMAT", "90–93"],
  [41, "Jaipuria Noida", "Several; check the site", "—"],
  [42, "IMI Kolkata", "Several; check the site", "—"],
  [43, "GIM Goa", "CAT, XAT, GMAT", "85–90"],
  [44, "Lovely Professional University", "Own process", "—"],
  [45, "XIM University, Bhubaneswar", "XAT, CAT", "91–96"],
  [46, "Thapar Institute, Patiala", "Several; check the site", "—"],
  [46, "ICFAI (IBS) Hyderabad", "IBSAT", "—"],
  [48, "IIT (ISM) Dhanbad", "CAT", "—"],
  [49, "Amity University, Noida", "Own process", "—"],
  [50, "Great Lakes Gurgaon", "CAT, XAT, GMAT", "—"],
];

export const unranked = [
  ["FMS Delhi", "CAT, 98–99.5"],
  ["JBIMS Mumbai", "CAT or MAH-CET, about 95–98"],
  ["ISB Hyderabad", "GMAT/GRE, one-year programme for candidates with work experience"],
  ["XLRI Delhi-NCR", "XAT"],
  ["TISS Mumbai", "Cracku lists 98+ on CAT; confirm the exam on TISS’s site"],
  ["IIM Guwahati", "CAT, 94–97; new"],
];

// [institute, exam, total fees ₹ lakh, average LPA, median LPA or null]
export const fees: [string, string, number, number, number | null][] = [
  ["ISB Hyderabad", "GMAT/GRE", 38.67, 37.29, 30.0],
  ["IIM Calcutta", "CAT", 27.0, 36.0, 35.0],
  ["IIM Bangalore", "CAT", 26.5, 35.35, 34.75],
  ["IIM Ahmedabad", "CAT", 27.5, 34.45, 34.53],
  ["SPJIMR Mumbai", "CAT/GMAT", 26.5, 33.75, 32.85],
  ["IIM Lucknow", "CAT", 20.75, 33.2, 32.9],
  ["FMS Delhi", "CAT", 2.4, 32.27, 29.59],
  ["XLRI Jamshedpur", "XAT", 30.6, 31.4, 29.0],
  ["IIFT Delhi", "CAT", 21.82, 31.3, null],
  ["SIBM Pune", "SNAP", 27.0, 28.83, null],
  ["IIM Kozhikode", "CAT", 23.58, 28.18, 27.5],
  ["IIT Bombay (SJMSOM)", "CAT", 16.9, 28.16, null],
  ["IIM Indore", "CAT", 25.0, 27.27, 25.0],
  ["JBIMS Mumbai", "CAT/MAH-CET", 7.0, 26.48, null],
  ["IIT Delhi (DMS)", "CAT", 12.0, 22.52, null],
  ["MICA Ahmedabad", "CAT/XAT/GMAT + MICAT", 28.0, 19.22, null],
];

export const seats =
  "FMS Delhi about 251; SPJIMR about 360; MDI 600–720 across its programmes; IIT Bombay 152; IIT Delhi 115; IIT Kharagpur 200; IIT Madras 100; IIT Roorkee 95; IMT Ghaziabad about 600; IMI Delhi 420. Smaller intakes usually mean higher cutoffs.";

export const tracks: [string, string, string][] = [
  ["Consulting and strategy", "IIM Ahmedabad, Bangalore, Calcutta; IIM Lucknow, Kozhikode, Indore, Mumbai; FMS Delhi; XLRI (XAT); SPJIMR; ISB (GMAT/GRE)", "Consulting roles concentrate at the top-ranked schools, so this track needs a 99+ CAT plus a strong interview."],
  ["Finance (banking, markets, investing)", "IIM Calcutta, Ahmedabad, Bangalore; FMS Delhi; JBIMS Mumbai; NMIMS Mumbai (NMAT); SPJIMR", "Mumbai schools sit next to the banks; JBIMS also runs an MSc Finance."],
  ["Marketing and brand management", "The older IIMs; MICA (communications, via MICAT); SIBM Pune (SNAP); NMIMS (NMAT)", "MICA is the specialist school for marketing communications and advertising."],
  ["Operations and supply chain", "IIM Mumbai (formerly NITIE); IIT Bombay (SJMSOM); IIT Delhi (DMS)", "IIM Mumbai grew out of an industrial-engineering and operations institute."],
  ["Human resources", "XLRI HRM (XAT); TISS Mumbai HRM & LR; IIM Ranchi MBA-HRM; MDI PGDM-HRM; IMI Delhi PGDM-HRM; XIM University MBA-HRM (XAT)", "XLRI’s HRM is the best-known HR programme in India."],
  ["Agribusiness and food", "IIM Ahmedabad PGP-FABM (CAT); IIM Lucknow MBA-ABM (CAT); MANAGE Hyderabad PGDM-ABM; NIAM Jaipur PGDM-ABM", "Roles in agri-inputs, food processing, commodities and rural finance. IIM Lucknow’s ABM has its own, lower minimum than its main MBA."],
  ["Rural management and development", "IRMA Anand PGDM-RM (about 85+ on CAT); XIM University School of Rural Management (XAT)", "Cooperatives, development finance, NGOs and CSR."],
  ["International business and trade", "IIFT Delhi and Kolkata MBA-IB (CAT); MDI PGDM-IB", "Exports, trade finance, shipping and logistics."],
  ["Business analytics", "MDI PGDM-Business Analytics; PGDBA run jointly by IIM Calcutta, ISI and IIT Kharagpur (own entrance test)", "Analytics roles also go to general MBA graduates with the right electives."],
  ["Sustainability and environment", "IIM Mumbai MBA (Sustainability Management); IIM Lucknow MBA (Sustainability Management); IIFM Bhopal", "Newer specialisations; check placement reports for role mix before committing."],
  ["Best value for money", "FMS Delhi (about ₹2.4 lakh fees); JBIMS Mumbai (about ₹7 lakh)", "Both pair low fees with average packages above ₹26 LPA."],
];

export const exams: [string, string, string, string][] = [
  ["CAT 2026", "IIMs, FMS, MDI, SPJIMR, IITs, IIFT, JBIMS and many more", "Exam 29 Nov 2026; admit card expected from 4 Nov", "Results usually arrive in late December or early January."],
  ["XAT 2027", "XLRI, XIM University, plus many schools that also take CAT", "Applications until 6 Dec 2026", "The exam is usually held in early January; confirm on xatonline.in."],
  ["SNAP 2026", "SIBM Pune and other Symbiosis institutes", "Applications 21 Aug – 25 Nov 2026", "Tests usually run in December."],
  ["NMAT 2026", "NMIMS and other NMAT-accepting schools", "Slot booking 20 Aug – 17 Dec 2026", "You can book more than one attempt."],
  ["IBSAT 2026", "IBS (ICFAI) campuses", "Applications 1 Jul – 1 Dec 2026", ""],
  ["GMAT / GRE", "ISB; GMAT routes at SPJIMR, MDI, XLRI and others", "Year-round", "ISB’s programme needs work experience."],
  ["MAH-CET", "Maharashtra state-quota seats at JBIMS, SIMSREE and others", "Usually March", "JBIMS’s all-India seats go through CAT."],
  ["MICAT", "MICA Ahmedabad", "Usually two rounds, December and early in the new year", "Taken alongside CAT, XAT or GMAT."],
];

export const afterCat = [
  ["Late November to January", "Non-IIM applications (SPJIMR, MDI, the IITs, IIFT, FMS) open and close; some close before results."],
  ["Late December to early January", "CAT results."],
  ["January to February", "IIM shortlists and interview calls, including the newer IIMs’ joint process."],
  ["February to April", "WAT, GD and interviews."],
  ["April to May", "Final offers and waitlist movement."],
  ["June to July", "Programmes begin."],
];

export const doThisMonth = [
  "Register for XAT before 6 Dec 2026 as your backup, and for XLRI",
  "Decide on SNAP (closes 25 Nov) and book an NMAT slot (closes 17 Dec) if Symbiosis or NMIMS interest you",
  "Note the application deadlines for SPJIMR, MDI, the IIT B-schools, IIFT and FMS",
  "Download the 2027–29 admission policy of every IIM you are targeting",
];

export const sources = [
  "Cracku: CAT cutoff 2026, IIM-wise: practical call ranges, official general minimums, RTI lowest admits, non-IIM category ranges",
  "Cracku: IIM admission criteria 2026: final-selection weightage, eligibility, reservation",
  "Cracku: Top 10 MBA colleges in India 2026: fees, packages, IIM A/B/C category minimums",
  "Cracku: CAT percentile for non-IIM colleges 2026: non-IIM call ranges and seats",
  "iQuanta: NIRF ranking 2025, management: the top-50 list and scores",
  "Careers360: NIRF MBA ranking 2026 status: NIRF 2026 not yet released",
  "Cracku: CAT 2024 score vs percentile and IMS: CAT 2025 analysis: the percentile calculator data",
  "Careers360: CAT Quant five-year trend and Careers360: CAT 2026: exam dates and application windows",
  "iQuanta: IIM Kozhikode expected cutoff by profile: the engineer versus non-engineer estimate",
];
