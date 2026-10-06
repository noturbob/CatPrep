// "CAT 2026 VARC Guide: 12 Correct for the 95th Percentile", 6 Oct 2026.
// Every passage and question is original to the guide, written to mirror CAT's styles.

export const varcPercentiles: [string, string, string][] = [
  ["99", "40.3", "40–41"],
  ["95", "30", "30–32"],
  ["90", "24", "23–25"],
  ["85", "20.4", "19–20"],
  ["80", "18.2", "17–18"],
];

export const format = [
  "CAT 2025 VARC had 24 questions: 4 reading passages with 4 questions each, plus 8 verbal-ability questions, 2 each of summary, para-completion, odd-one-out and para jumbles.",
  "20 were MCQs and 4 were TITA. The TITAs are usually the jumbles and odd-one-outs.",
  "Marking: +3 for a correct answer, −1 for a wrong MCQ, 0 for a wrong TITA. So the jumbles and odd-one-outs are free attempts: always enter an answer.",
];

export const plan40 = [
  { from: 0, to: 2, title: "Rank the passages", body: "Open all four and read the first three lines of each. Rank them by how easily the sentences go in, and leave the densest one." },
  { from: 2, to: 29, title: "Your three passages", body: "About 9 minutes each: 4 minutes reading, 5 minutes answering." },
  { from: 29, to: 39, title: "Verbal ability", body: "Summaries and completions first (about 1.5 minutes each), then jumbles and odd-one-outs (about 2 minutes each)." },
  { from: 39, to: 40, title: "TITA check", body: "Check that every TITA box has an answer." },
];

export const choosing = {
  context:
    "In CAT 2025, IMS rated one passage per slot easy and one medium; the other two were harder. The easy ones were on early doctors diagnosing mental disorders, how a fish species evolved, and the harm done by dams. The harder ones included objections to electronic music, the role of place in literature and a forest law.",
  pick: "Narrative or explanatory passages (science, history, environment, economics) with concrete examples, and questions that point to specific paragraphs.",
  leave: "Abstract arguments about art, literary theory or philosophy with few examples, long winding sentences, and question sets made mostly of tone and “the author would agree” items.",
};

export const guessing = [
  "MCQs (RC, summaries, completions): guess only after you have eliminated two options.",
  "TITA (jumbles, odd-one-outs): never leave the box blank.",
  "If you cannot state a passage’s main point after one reading, answer only its detail questions and move on.",
];

export const timeTraps = [
  "Re-reading the whole passage for every question. Go back only to the paragraph the question points to.",
  "Four minutes on one para jumble. If no linked pair of sentences appears within 2 minutes, enter your best order and move on: it costs nothing if wrong.",
];

export const howToRead = [
  "First paragraph: what is the topic, and what question or problem does it raise?",
  "Every paragraph: give it a job in your head, such as claim, example, counterpoint or conclusion.",
  "Pivot words: after but, however, yet, although, in fact, rather, the author’s real view usually follows.",
  "Tone: neutral, critical, sympathetic or sceptical? CAT authors are rarely extreme.",
  "At the end: say the main point to yourself in one sentence before opening the questions.",
];

export const questionTypes: [string, string, string][] = [
  ["Main idea or primary purpose", "The passage as a whole", "Pick the option that covers every paragraph, not just one"],
  ["Specific detail", "“According to the passage…”", "Go back to the line; match the meaning, not the words"],
  ["Inference", "“It can be inferred…”, “suggests”", "Must follow from the text with no extra assumption"],
  ["Author’s view", "“The author would most likely agree…”", "Match the author’s own stance, not views the author reports"],
  ["EXCEPT / NOT", "All options but one are stated or supported", "Check each option against the text and strike it off"],
  ["Purpose of a detail", "“The author mentions X in order to…”", "Ask what job that sentence does in its paragraph"],
  ["Tone", "The author’s attitude", "Usually measured (critical, cautious, appreciative); extreme tones are rarely right"],
  ["Application", "A new situation that parallels the argument", "Match the logic, not the topic"],
];

export const wrongOptions: [string, string][] = [
  ["Extreme", "always, never, only, entirely, proves."],
  ["Out of scope", "true in real life, but not said or implied in the passage."],
  ["Distorted", "uses the passage’s words but changes their meaning or reverses a cause and effect."],
  ["Half-right", "the first half fits, the second half does not."],
];

export type McqQ = { q: string; options: string[]; answer: string; why: string };

export type Passage = {
  slug: string;
  title: string;
  kind: "worked" | "practice";
  intro?: string;
  paragraphs: string[];
  questions: McqQ[];
  takeaway?: string;
};

export const passages: Passage[] = [
  {
    slug: "history",
    title: "Worked passage 1: history",
    kind: "worked",
    intro: "Original, about 290 words.",
    paragraphs: [
      "For most of history, towns kept their own time, set by the moment the sun stood highest over the local church or town hall. A traveller heading west found his watch running ahead at every stop, and few people minded, because few people travelled far.",
      "The railways changed that. A timetable listing dozens of local times invited missed connections and, worse, collisions on single-track lines. Railway companies therefore adopted a single “railway time” for their own operations, and the towns along their lines slowly, sometimes grudgingly, followed.",
      "It is tempting to tell this as a story of simple progress, in which reason triumphed over provincial habit. But the resistance deserves a fairer hearing. For many townspeople, solar time was not a habit but a fact: noon was when the sun was highest, and a clock that said otherwise was simply wrong. Some public clocks were even given two minute-hands, one for local time and one for railway time, a compromise that respected both the new order and the old.",
      "What finally settled the matter was less the force of argument than the weight of infrastructure. Once telegraph lines could carry time signals instantly, and once schools, factories and courts arranged their days around train arrivals, keeping local time grew costly for anyone who tried. Standard time did not win because people came to believe it was truer; it won because living by any other time became inconvenient. The distinction matters, for it suggests that many conventions we now treat as natural were adopted not through persuasion but through dependence.",
    ],
    questions: [
      { q: "The passage is primarily concerned with:", options: ["describing how the telegraph made accurate timekeeping possible", "arguing that standard time spread because resisting it grew costly, not because people were persuaded", "criticising townspeople who refused railway time", "explaining why solar time is more accurate than standard time"], answer: "b", why: "It covers all three paragraphs: the change, the fair hearing for resisters and the cost-not-persuasion conclusion. (a) is one detail; (c) reverses the author’s sympathetic tone; (d) is a distortion, since only the townspeople believed solar time was “truer”." },
      { q: "The author mentions clocks with two minute-hands in order to:", options: ["prove that railway time was technically superior", "show that the change was contested and that communities tried to accommodate both systems", "mock the confusion caused by local time", "indicate that railway companies forced towns to change their clocks"], answer: "b", why: "The sentence calls the clocks a compromise that respected both orders. (a) and (d) are out of scope; (c) clashes with the author’s respectful tone." },
      { q: "The author would most likely agree that:", options: ["conventions that feel natural today may owe their dominance to practical lock-in rather than to their merits", "solar time should be restored because it follows the sun", "railway companies deliberately suppressed local time to control towns", "the adoption of standard time shows that reason eventually defeats habit"], answer: "a", why: "It restates the last sentence. (d) is the “tempting” story the author qualifies; (b) and (c) are never claimed." },
      { q: "According to the passage, all of the following helped standard time spread EXCEPT:", options: ["the instant transmission of time signals", "institutions arranging their schedules around train arrivals", "the risk of collisions on single-track lines", "a law requiring every clock to show railway time"], answer: "d", why: "No law is mentioned. The other three are all stated." },
    ],
    takeaway: "Paragraph jobs here are: the change, the fair hearing, the real cause. Once you have those three labels, every question is a matter of matching an option to one of them.",
  },
  {
    slug: "humanities",
    title: "Worked passage 2: humanities",
    kind: "worked",
    intro: "Original, about 280 words. IMS rated passages like this difficult in CAT 2025, among them ones on electronic music and on “place” in literature: abstract arguments about art or language with few concrete examples. Read it at the same 4-minute pace, marking the qualifiers.",
    paragraphs: [
      "Translators are often praised for being faithful, as if a good translation were a pane of clear glass through which the original could be seen undistorted. The metaphor flatters originals and is unfair to translators. Every language divides the world differently: one has a single word for blue, another insists on separate words for light and dark blue; one marks whether a speaker saw an event or only heard about it, another leaves the matter vague. A translator cannot carry these distinctions across intact, and must decide, sentence by sentence, which to keep and which to let go.",
      "Seen this way, a translation is less a copy than an interpretation, and its choices reveal the translator as surely as a performance reveals a pianist. Two renderings of the same poem can differ more than two poems by different authors, and readers who compare them often discover what the original was doing only by noticing where the versions disagree.",
      "None of this means that anything goes. A translator who smooths away every strangeness, turning a difficult foreign text into comfortable domestic prose, has also made a choice, usually the choice to flatter the reader rather than inform them. The best translations, on this view, are not invisible but honest: they let the reader feel the distance between two languages instead of pretending it is not there. Fidelity, if the word is to keep any meaning, should describe loyalty to the experience of reading the original, not to its dictionary meanings.",
    ],
    questions: [
      { q: "The passage is primarily concerned with:", options: ["arguing that translation is impossible", "recasting fidelity in translation as loyalty to the experience of the original rather than to word-for-word equivalence", "showing that some languages are richer than others", "defending translators who make difficult texts easy to read"], answer: "b", why: "It joins all three paragraphs: languages differ, translation is interpretation, and fidelity should mean loyalty to the reading experience. (a) is extreme, since the author never says translation fails; (c) misreads the colour example; (d) reverses the third paragraph." },
      { q: "The comparison with a pianist suggests that:", options: ["translating requires musical training", "a translation, like a performance, carries the interpreter’s own choices", "translations are inferior to originals", "readers should listen to poetry aloud"], answer: "b", why: "The pianist line says the choices “reveal the translator”. (a) and (d) take the analogy literally; (c) is a judgement the author never makes." },
      { q: "The author would most likely criticise a translation that:", options: ["keeps some unfamiliar expressions from the original", "reads like comfortable modern prose even where the original is deliberately strange", "differs noticeably from another translation of the same text", "explains its hardest choices in footnotes"], answer: "b", why: "Smoothing away strangeness is exactly the choice the author says flatters the reader. (a) and (d) describe the “honest” translation the author praises; (c) is what the author expects of good translations." },
      { q: "Which of the following, if true, would most weaken the author’s argument?", options: ["Readers can rarely tell which of two translations is closer to the original", "Languages differ in how they divide colours", "Expert comparisons of different translations of the same poem usually find them nearly identical in content and tone", "Some translators are also poets"], answer: "c", why: "The argument leans on translations differing widely (“more than two poems by different authors”); if they were nearly identical, the claim that translation is interpretation would weaken. (a) fits the author’s view, (b) is one of the author’s own premises and (d) is irrelevant." },
    ],
    takeaway: "Humanities passages hide the author’s view in qualifiers: “less a copy than”, “none of this means”, “if the word is to keep any meaning”. Mark them on the first read. For a “weaken” question, find the claim the argument depends on, then pick the option that contradicts it.",
  },
  {
    slug: "economics",
    title: "Practice passage 3: economics",
    kind: "practice",
    intro: "9 minutes.",
    paragraphs: [
      "When a popular good is priced below what buyers are willing to pay, something other than price decides who gets it. Often that something is a queue. Queues look fair because they ignore wealth: a billionaire waits in the same line as a student. Economists point out, however, that queues ration by a different currency, namely time, and time is not distributed equally either. A shift worker who cannot leave her job pays far more to stand in line than a retiree with a free afternoon.",
      "Queues also waste what they collect. A higher price transfers money from buyers to the seller, who can use it; an hour spent waiting simply disappears. For this reason many economists favour auctions or flexible pricing for scarce goods, arguing that these allocate items to those who value them most while turning the cost of waiting into revenue.",
      "Yet the preference for queues is not merely naive. People often accept a queue precisely because it signals that a good is not for sale to the highest bidder, and they resent pricing that seems to exploit a moment of scarcity, such as a taxi fare that triples during a flood. A society’s choice between price and queue is therefore partly a choice about which kinds of goods it wants money to decide.",
    ],
    questions: [
      { q: "Which best states the main point?", options: ["Queues are always fairer than prices", "Queues ration by time, which is costly and unevenly spread, yet people may still prefer them for some goods because of what they signal", "Auctions should replace all queues", "Economists ignore fairness"], answer: "b", why: "It covers all three paragraphs; (a), (c) and (d) are extreme or unsupported." },
      { q: "According to the passage, a key inefficiency of queues is that:", options: ["they favour the wealthy", "the time spent waiting benefits nobody", "sellers earn too much", "they cannot handle large crowds"], answer: "b", why: "“An hour spent waiting simply disappears”; (a) reverses the passage." },
      { q: "The taxi example is used to:", options: ["show that flexible pricing is common", "illustrate why people resent price-based allocation during scarcity", "prove that queues fail in emergencies", "argue that taxis should be regulated"], answer: "b", why: "The example follows “they resent pricing that seems to exploit a moment of scarcity”." },
      { q: "The author’s attitude to economists’ preference for auctions is best described as:", options: ["dismissive", "wholly supportive", "appreciative but qualified", "indifferent"], answer: "c", why: "The author reports the argument fairly, then adds “Yet the preference for queues is not merely naive”." },
    ],
  },
  {
    slug: "science",
    title: "Practice passage 4: science",
    kind: "practice",
    intro: "9 minutes.",
    paragraphs: [
      "In the past two decades, attempts to repeat well-known experiments in psychology and medicine have often produced weaker results than the originals, or none at all. This “replication crisis” is frequently presented as a scandal, and in part it is: some findings rested on small samples, flexible analysis and a publishing system that rewarded surprising results over careful ones.",
      "But the crisis is also evidence that science’s self-correcting machinery works, if slowly. A failed replication is a result in its own right; it tells researchers which effects are fragile and which methods mislead. The reforms that followed, such as declaring hypotheses before collecting data and publishing studies whatever their outcome, would not have been adopted without the embarrassment of failures.",
      "The more troubling lesson concerns the public. People who hear only that “studies don’t replicate” may conclude that no study can be trusted, which is the wrong inference. The right response to unreliable findings is not to discard evidence but to weigh it: to prefer large, repeated and pre-registered studies over single striking ones. Scepticism, used well, is a sorting tool, not a reason to stop sorting.",
    ],
    questions: [
      { q: "The author regards the replication crisis as:", options: ["proof that science is unreliable", "partly a genuine problem and partly evidence that science’s correction works", "an exaggeration by critics", "a problem confined to medicine"], answer: "b", why: "“In part it is” a scandal, “but” also evidence of self-correction; (a) is the public’s wrong inference." },
      { q: "Which reform does the passage mention?", options: ["Larger research budgets", "Declaring hypotheses before collecting data", "Banning surprising results", "Replacing journals with blogs"], answer: "b", why: "Stated in paragraph 2." },
      { q: "“A sorting tool, not a reason to stop sorting” implies that:", options: ["scepticism should lead us to reject most studies", "scepticism should help us rank evidence by reliability rather than abandon it", "only scientists should be sceptical", "all studies are equally reliable"], answer: "b", why: "The last paragraph says to weigh evidence, not discard it." },
      { q: "The author would most likely say that a single dramatic study showing a large effect:", options: ["should be trusted because it is surprising", "deserves less weight than several large, pre-registered studies", "should be ignored entirely", "proves the crisis is over"], answer: "b", why: "The author prefers “large, repeated and pre-registered studies over single striking ones”; (c) is too extreme." },
    ],
  },
];

export type VaType = {
  slug: string;
  title: string;
  format: "TITA" | "MCQ";
  move: string;
  steps: string[];
  examples: { prompt: string; sentences?: string[]; text?: string; options?: string[]; answer: string; why: string }[];
};

export const vaTypes: VaType[] = [
  {
    slug: "para-jumbles",
    title: "Para jumbles",
    format: "TITA",
    move: "Find the pairs, not the order",
    steps: [
      "Find the opener: a sentence that introduces the topic and needs nothing before it. Sentences starting with This, It, Such, However or As a result cannot open.",
      "Find the mandatory pairs: a pronoun and its noun, “this/that/such + noun” pointing back, connectives (however, therefore, as a result, meanwhile), a question and its answer, a general claim and its example.",
      "Chain the pairs, then place the closer (a conclusion, “in other words”, “this is why”).",
      "Read the full order once as a paragraph before typing it in.",
    ],
    examples: [
      {
        prompt: "Arrange into a paragraph:",
        sentences: [
          "This simple habit, repeated across millions of homes, adds up to a measurable drop in demand at peak hours.",
          "Electricity grids have to be built for the hottest afternoon of the year, not for an average day.",
          "As a result, some power companies now pay customers to run their washing machines and dishwashers at night.",
          "That means huge investments in plants and lines that sit idle for most of the year.",
        ],
        answer: "2431",
        why: "Sentence 2 is the only one that needs nothing before it. “That means” in 4 builds on 2’s point about peak demand. “As a result” in 3 is the industry’s response to that waste. “This simple habit” in 1 needs the habit described in 3.",
      },
      {
        prompt: "Arrange into a paragraph:",
        sentences: [
          "The angle of the dance tells them the direction of the food, measured against the position of the sun.",
          "A honeybee that finds a rich patch of flowers returns to the hive and performs a “waggle dance”.",
          "Its length, meanwhile, tells them how far away the food is.",
          "The other bees crowd around the dancer and read two pieces of information from it.",
          "Remarkably, bees that keep dancing for a long time adjust the angle as the sun moves across the sky.",
        ],
        answer: "24135",
        why: "Sentence 2 opens. Sentence 4 promises “two pieces of information”, and 1 and 3 deliver them; “meanwhile” marks 3 as the second, so 1–3 is a locked pair. Sentence 5 refines the angle idea and closes; placing it between 1 and 3 would break the pair.",
      },
    ],
  },
  {
    slug: "odd-one-out",
    title: "Odd one out",
    format: "TITA",
    move: "Find the chain, then the misfit",
    steps: [
      "Find the thread that runs from sentence to sentence: references back (“this richness”, “these algae”) and a claim–evidence–consequence flow.",
      "The odd sentence is usually on the same topic but breaks the chain: a new angle, a different scope or a shift in tone.",
      "Build the four-sentence paragraph. The sentence you cannot attach anywhere is the answer.",
    ],
    examples: [
      {
        prompt: "Four of these five sentences form a paragraph. Which is the odd one out?",
        sentences: [
          "Much of this richness depends on a partnership between corals and the algae living in their tissues.",
          "Reefs also protect coastlines by absorbing the energy of incoming waves.",
          "Coral reefs cover well under one per cent of the ocean floor.",
          "When the water grows too warm, corals expel these algae and turn white, a process called bleaching.",
          "Yet they shelter roughly a quarter of all known marine species.",
        ],
        answer: "2",
        why: "The chain is 3 → 5 → 1 → 4: small area, huge richness, the partnership behind that richness, and the threat to the partnership. Sentence 2 is about reefs too, but it adds a new benefit that no other sentence picks up.",
      },
    ],
  },
  {
    slug: "para-summary",
    title: "Para summary",
    format: "MCQ",
    move: "Keep the core claim and its qualifier",
    steps: [
      "After reading, state the main point in about 12 words.",
      "Choose the option that keeps that claim and any key qualifier (“rarely”, “alone”, “by contrast”).",
      "Eliminate options that add new information, overstate (always, only, useless), focus on one detail or reverse a relationship.",
    ],
    examples: [
      {
        prompt: "Which option best summarises the paragraph?",
        text: "Cities that widen roads to cure congestion often find traffic back at its old level within a few years. The new capacity changes behaviour: trips people once skipped, or made at quieter hours, now seem worth making at peak time, and some commuters who used trains switch back to cars. Economists call this induced demand. It does not make new roads useless, since they do let more people travel, but it does mean that building roads alone rarely delivers the faster journeys used to justify it. Charging drivers for using roads at busy times, by contrast, tackles the behaviour directly.",
        options: [
          "Building new roads is pointless because traffic always returns to its old level.",
          "Wider roads tend to fill up again because extra capacity draws in more trips, so easing congestion needs measures that change behaviour, such as peak-time charges.",
          "Economists have found that people prefer cars to trains whenever roads are widened.",
          "Charging for roads at busy times is the only way to let more people travel in a city.",
        ],
        answer: "b",
        why: "(a) overstates and contradicts “does not make new roads useless”. (c) turns one detail into the whole point. (d) says “only way” and changes the goal from speed to the number of travellers.",
      },
    ],
  },
  {
    slug: "para-completion",
    title: "Para completion and sentence placement",
    format: "MCQ",
    move: "Connect both neighbours",
    steps: [
      "Find where the flow breaks: a “this” or “it” with nothing to point to, or a jump in logic.",
      "The right sentence links to both neighbours: the sentence before sets it up, and the sentence after builds on it.",
      "Test each option or blank by reading the sentences on either side with it in place.",
    ],
    examples: [
      {
        prompt: "Where does this sentence fit best? “In reality, it behaves more like a reconstruction.”",
        text: "Most people assume that memory works like a recording. (1) Each time we recall an event, the brain rebuilds it from fragments, filling the gaps with whatever seems likely. (2) This is why two honest witnesses can describe the same accident differently. (3) Courts have begun to take this seriously, warning juries not to treat confident testimony as accurate testimony. (4)",
        answer: "blank 1",
        why: "“In reality” contrasts with the assumption just stated, “it” is memory, and the next sentence explains the reconstruction. At blanks 2, 3 or 4 the contrast comes too late and “it” points to the wrong thing.",
      },
    ],
  },
];

export type VaPractice = {
  id: string;
  group: string;
  prompt?: string;
  sentences?: string[];
  text?: string;
  options?: string[];
  answer: string;
};

export const vaPractice: VaPractice[] = [
  { id: "PJ1", group: "Para jumbles (TITA): type the correct order", sentences: ["Within a generation, the same streets were lined with cafés and design studios.", "The old mills closed one by one in the 1980s, leaving whole districts empty.", "Rents rose so fast that many of the artists who had started the revival were priced out.", "Artists moved in first, drawn by the large, cheap spaces."], answer: "2413. 2 opens with the mills closing; 4 “Artists moved in first”; 1 “Within a generation”; 3 needs “the revival” described in 1." },
  { id: "PJ2", group: "Para jumbles (TITA): type the correct order", sentences: ["Participants given a dull task first came up with more original ideas afterwards.", "Yet most of us now reach for a phone the moment a queue or a commute turns dull.", "Recent studies suggest that mild boredom can make people more creative.", "The trick, then, is not to avoid boredom but to stop filling it instantly."], answer: "3124. 3 states the claim; 1 is the evidence; 2 opens with “Yet” and cannot start; 4’s “then” concludes." },
  { id: "PJ3", group: "Para jumbles (TITA): type the correct order", sentences: ["Scientists point to two main reasons for this “urban heat island”.", "The second is that cities have fewer trees, which cool the air by releasing water through their leaves.", "Cities are often several degrees warmer than the countryside around them.", "Planting trees and using lighter roofing materials can therefore cut city temperatures noticeably.", "The first is that asphalt and concrete absorb sunlight during the day and release it slowly at night."], answer: "31524. 3 opens; 1 promises two reasons; 5 gives the first and 2 the second; 4’s “therefore” closes." },
  { id: "PJ4", group: "Para jumbles (TITA): type the correct order", sentences: ["The practice spread to other ports, and the wait was later extended to forty days.", "Today the word can mean anything from two weeks at home to a few hours at an airport.", "In 1377 the port of Ragusa, today’s Dubrovnik, began holding arriving ships offshore for thirty days before their crews could land.", "That longer wait gave us the word “quarantine”, from the Italian for “forty days”."], answer: "3142. 3 sets the date and the thirty-day rule; 1 extends it to forty days; 4 needs “That longer wait”; 2’s “Today” closes." },
  { id: "OOO1", group: "Odd one out (TITA): type the number of the sentence that does not fit", sentences: ["During deep sleep, the brain clears out waste products that build up while we are awake.", "Many people use their phones in bed, and the light from the screen can delay sleep.", "It also replays and strengthens the memories formed during the day.", "These two functions help explain why a sleepless night leaves us both foggy and forgetful.", "Sleep is far from a passive state."], answer: "2. The other four describe what the sleeping brain does; phones in bed is a new topic." },
  { id: "OOO2", group: "Odd one out (TITA): type the number of the sentence that does not fit", sentences: ["Each GPS satellite carries an atomic clock and broadcasts the exact time at which it sends its signal.", "A receiver on the ground compares those times with its own clock to work out how far away each satellite is.", "Distances to four or more satellites are enough to fix the receiver’s position.", "Smartphone makers advertise better cameras more often than better location accuracy.", "Because the signals travel at the speed of light, a timing error of a millionth of a second shifts the position by about 300 metres."], answer: "4. The other four explain how GPS uses timing; camera marketing is unrelated." },
  { id: "OOO3", group: "Odd one out (TITA): type the number of the sentence that does not fit", sentences: ["Tea reached Britain in the seventeenth century as an expensive import from China.", "High taxes made it so valuable that smuggling became a large business.", "When the tax was slashed in 1784, legal tea became cheap and smuggling collapsed almost overnight.", "Green tea contains less caffeine than coffee.", "Within a few decades, tea had changed from a luxury into an everyday drink for most households."], answer: "4. The other four trace tea’s price history in Britain; caffeine content breaks the chain." },
  { id: "PS1", group: "Para summary (MCQ): choose the best summary", text: "Studies of remote work disagree about productivity, and the disagreement may be less about working from home than about what is measured. Tasks that need long stretches of concentration, such as writing code or reports, often go faster away from office interruptions. Tasks that depend on quick, informal exchanges, such as training new staff or solving unfamiliar problems together, tend to suffer. A firm’s verdict on remote work therefore says as much about its mix of tasks as about the arrangement itself.", options: ["Remote work makes employees more productive than office work.", "Whether remote work helps productivity depends largely on the kind of work being done.", "Studies of remote work are unreliable because they measure the wrong things.", "Firms should keep training and problem-solving in the office and send other work home."], answer: "(b). (a) is one-sided, (c) distorts “what is measured” and (d) adds a recommendation the paragraph never makes." },
  { id: "PS2", group: "Para summary (MCQ): choose the best summary", text: "An animal or plant introduced to a new region is not automatically a threat. Most introduced species fail to establish themselves, and many that survive cause little harm. A small minority, however, spread rapidly because they have left behind the predators and diseases that kept them in check at home, and these can devastate local ecosystems. Since it is hard to predict which newcomers will behave this way, preventing introductions is far cheaper than removing a species once it has spread.", options: ["Most introduced species are harmless, but because the few that turn invasive are hard to predict and costly to remove, prevention is the better policy.", "Introduced species usually destroy the ecosystems they enter.", "Predators and diseases are the main cause of extinction.", "Governments should remove every introduced species as soon as it is detected."], answer: "(a). (b) contradicts “not automatically a threat”; (d) goes beyond prevention." },
  { id: "PS3", group: "Para summary (MCQ): choose the best summary", text: "When museums drop their entry fees, visitor numbers usually rise sharply. Yet surveys often find that the new visitors resemble the old ones: the same well-educated, middle-class groups simply visit more often. Price, it seems, was a smaller barrier than habit, a sense of not belonging, or not knowing what a museum offers. Free entry may be worth having for other reasons, but on its own it does little to widen who visits.", options: ["Free entry is the best way to attract new kinds of visitors to museums.", "Museums should keep charging fees because free entry does not work.", "Free entry raises visitor numbers but mostly brings back existing visitors, because cost was not the main barrier for others.", "Middle-class visitors are the only people interested in museums."], answer: "(c). (b) overstates (“does not work”) and adds a recommendation; (d) is extreme." },
  { id: "PC1", group: "Completion and sentence placement (MCQ)", prompt: "Where does this sentence fit best? “It is also acidic, which most bacteria cannot tolerate.”", text: "Archaeologists have found pots of honey in ancient Egyptian tombs that were still edible. (1) Honey resists spoilage for several reasons. (2) Its sugar content is so high that it pulls water out of any microbe that lands in it. (3) Bees also add an enzyme that produces small amounts of hydrogen peroxide. (4) Together, these make honey one of the few foods that can last for centuries.", answer: "(3). “Also acidic” adds a second reason straight after the sugar reason and before the enzyme." },
  { id: "PC2", group: "Completion and sentence placement (MCQ)", prompt: "Where does this sentence fit best? “Using movable metal type, a small workshop could now turn out hundreds of copies in the time a scribe needed for one.”", text: "Before the printing press, books in Europe were copied by hand, and a single volume could take months to produce. (1) Gutenberg’s press, developed around 1450, changed that. (2) Within fifty years, millions of books had been printed across the continent. (3) Cheaper books meant that ideas could spread faster than the authorities could control them. (4)", answer: "(2). It explains how the press “changed that”, before the result “within fifty years”." },
  { id: "PC3", group: "Completion and sentence placement (MCQ)", prompt: "Which sentence best completes the paragraph?", text: "Many people assume that the best way to learn a skill is to practise it in long, focused blocks. Studies of “interleaved” practice suggest otherwise. When learners mix different kinds of problems in one session, they feel slower and make more mistakes. Yet when they are tested days later, they usually outperform those who practised one problem type at a time. ______", options: ["Mixing problems is therefore pointless for most learners.", "The struggle that makes mixed practice feel worse appears to be part of what makes the learning last.", "Long blocks of focused practice remain the best method for beginners.", "Tests taken days later are less reliable than tests taken immediately."], answer: "(b). It resolves the paradox; (a) and (c) contradict the findings, and (d) changes the subject." },
];

export const varcRoutine = [
  "Two RC passages from past CAT papers, 9 minutes each. Then, for every question, note why each wrong option is wrong: extreme, out of scope, distorted or half-right.",
  "Four VA questions, one of each type.",
  "Twenty minutes of reading one long-form essay. Afterwards, state its main point and the author’s stance in one sentence each.",
];
