// chatKnowledge.en.js
//
// English version of chatKnowledge.js: the same exports with the same shapes,
// used by ChatWidget.vue when the site language is English (lang === 'en').
//
// Notes:
// - Facts and wording follow the English content on the site
//   (ExperienceSection.vue, ProjectsSection.vue, AboutSection.vue), so the
//   bot and the page say the same thing.
// - Fields containing HTML are rendered with v-html in ChatWidget.vue, ONLY
//   for bot messages (never user input).
// - Shared, language-neutral things (profile links, project thumbnails, email
//   extraction) come from the Indonesian module instead of being duplicated.

import { PROFILE, PROJECTS as PROJECTS_ID, extractEmail } from './chatKnowledge.js'

export { PROFILE, extractEmail }

// Same thumbnails as the Indonesian module, looked up by project title.
// The Indonesian module already corrects the swapped image file names
// (see the comment in ProjectsSection.vue), so no swapping is needed here.
const thumbOf = (title) => PROJECTS_ID.find((p) => p.title === title)?.image
const IMAGE = {
  'Secura Kost': thumbOf('Secura Kost'),
  'Toko Kelontong Online': thumbOf('Toko Kelontong Online'),
}

// Ready-made answer for the "about" intent (who is Jose). HTML.
export const ABOUT_HTML = [
  '<p>Meet <strong>Jose Elio Parhusip, S.Bns.</strong></p>',
  '<p>He holds a Bachelor of Digital Business from Universitas Logistik dan Bisnis Internasional (ULBI), Bandung. He currently works as a freelance Back End Developer for PT Sistem Pelayanan Kesehatan dan Data (SPKD), building the MedCredix backend with Go.</p>',
  '<p>He has a strong interest in web, mobile, data, and AI. He builds end-to-end applications with React.js, Vue.js, Node.js, PHP, MySQL, and PostgreSQL, from system modeling (UML, ERD, Flowchart) and e-commerce systems with Midtrans and RajaOngkir integrations to data visualization with Python and Streamlit. On mobile, he develops apps with Flutter and Dart. He also holds an SAP certificate.</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li><strong>Full-stack and mobile:</strong> builds applications end to end, from frontend and backend to database, for both web and mobile with Flutter.</li>',
  '<li><strong>Analytical and structured:</strong> experienced as a System Analyst, designing ERDs, UML diagrams, and flowcharts, and managing project schedules and budgets.</li>',
  '<li><strong>Collaborative:</strong> active in student organizations and used to working across roles in a team to deliver products that meet user needs.</li>',
  '</ul>',
  '<p>Tools he works with: Flutter, Figma, Power BI, Python, React, Streamlit, Vue.js, Excel, Plotly, Google Colab, PostgreSQL, MySQL, Node.js, Go, and PHP.</p>',
].join('')

// Ready-made answer for the "education" intent. HTML.
export const EDUCATION_HTML = [
  '<p><strong>Jose Elio Parhusip, S.Bns.</strong> graduated with a Bachelor of Digital Business from Universitas Logistik dan Bisnis Internasional (ULBI), Bandung.</p>',
  '<p>During his studies, he learned to design systems (UML, ERD, Flowchart) and to build both web and mobile applications, and he also earned an SAP certification.</p>',
].join('')

// Ready-made answer for the "contact" intent. HTML, {email} is replaced on use.
export const CONTACT_HTML = [
  "<p>Want to contact Jose directly? Email him at <strong>{email}</strong>, or keep chatting here and I'll help pass your message on to him.</p>",
].join('')

// Topics the bot can answer, shown as the second message of a new conversation.
export const TOPICS_HTML = [
  '<p>Before we continue, just so you know, I can only help with questions about:</p>',
  '<ul class="chat-widget__highlight-list">',
  "<li>Jose's profile and background</li>",
  '<li>His education</li>',
  '<li>His work and organizational experience</li>',
  '<li>Projects he has worked on</li>',
  '<li>How to contact Jose directly</li>',
  '</ul>',
  "<p>If you ask about something else, I'll let you know it's outside what I can help with. So, what's your name?</p>",
].join('')

// Ready-made answer for off-topic questions (recipes, translation, weather, ...).
export const OFFTOPIC_HTML =
  "<p>Hmm, that's outside what I can help with here. I can only tell you about Jose: his profile, education, work experience, projects, or how to contact him directly. Feel free to ask about any of those.</p>"

// role/company/summary are HTML.
export const EXPERIENCES = [
  {
    period: 'Oct 2026 – Present',
    role: 'Back End Developer',
    company: 'Freelance for PT Sistem Pelayanan Kesehatan dan Data (SPKD), South Jakarta',
    summary:
      'Develops the backend for MedCredix, a multi-hospital platform that automatically assesses hospital credentialing readiness from hospital operational data. Builds 44 REST API endpoints with Go (Gin), GORM, and PostgreSQL; JWT authentication and role-based access control; a hospital readiness scoring engine for the executive dashboard, risk register, and early warnings; the medical staff credentialing and document verification workflow; SIMRS integration through 24 FHIR resources; a hospital directory from the Ministry of Health (Kemenkes) registry, Indonesian region data, and BPJS facility code validation; plus audit trails and reports.',
    tags: ['Go', 'Gin', 'PostgreSQL'],
  },
  {
    period: 'Aug 2025 – Sep 2025',
    role: 'Mobile Developer',
    company: 'Solo project for JEC Eye Hospitals &amp; Clinics',
    summary:
      'Built an Android mobile app (Flutter and Dart) end to end for new non-JEC patients: requirements research, UI design in Figma, a Node.js and Express backend, an OCR feature, and usability testing (SUS score of 79, Acceptable/Good category).',
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: 'Jul 2024 – Sep 2024',
    role: 'Back End Developer',
    company: 'Group project at PT Pos Indonesia Head Office',
    summary:
      "Developed the backend of the IHSAN POS web application (Node.js, PostgreSQL) for managing PT Pos Indonesia's professional workforce data. The project was published in the JUISI journal (Sinta 5).",
    tags: ['Backend', 'REST API', 'Database'],
  },
  {
    period: 'May 2023 – Apr 2024',
    role: 'System Analyst',
    company: 'Student Entrepreneurship Development Program, Kampus Merdeka',
    summary:
      'Managed the project budget from cost estimation to expense tracking, and performed system modeling (Flowchart, ERD, UML) as the foundation for an MSME marketplace platform funded by the Indonesian Ministry of Education (Kemendikbudristek).',
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: 'Oct 2022 – May 2023',
    role: 'Deputy Human Capital and Governance',
    company: 'Digital Business Student Association (HIMABIG)',
    summary:
      'Assisted in recruiting and selecting board members, prepared organizational targets, schedules, and budgets, and prepared the general assembly as a member of the Steering Committee.',
    tags: ['Organization', 'Recruitment'],
  },
]

// Numbered list for the "experience" intent, rendered with v-html.
export function buildExperienceListHtml() {
  const items = EXPERIENCES.map((item) => {
    const tagsHtml = item.tags
      .map((tag) => `<span class="chat-widget__exp-tag">${tag}</span>`)
      .join('')

    return [
      '<li class="chat-widget__exp-item">',
      '<div class="chat-widget__exp-content">',
      `<p class="chat-widget__exp-period">${item.period}</p>`,
      `<p class="chat-widget__exp-role">${item.role}</p>`,
      `<p class="chat-widget__exp-company">${item.company}</p>`,
      `<p class="chat-widget__exp-summary">${item.summary}</p>`,
      tagsHtml ? `<div class="chat-widget__exp-tags">${tagsHtml}</div>` : '',
      '</div>',
      '</li>',
    ].join('')
  }).join('')

  return `<ol class="chat-widget__exp-list">${items}</ol>`
}

// title stays the original project name. summary is HTML.
// internal: true = freelance client project, no public demo or repository.
const PROJECT_TEXT = {
  MedCredix: {
    summary:
      'Freelance project for PT SPKD: the backend of a multi-hospital credentialing readiness platform (Go, Gin, PostgreSQL) with a hospital readiness scoring engine, JWT and RBAC security, a medical staff credentialing workflow, and SIMRS integration through FHIR.',
  },
  'SIMRS Dashboard': {
    summary:
      "Freelance project for PT SPKD: the frontend of a hospital information system (Next.js, React, TypeScript), covering registration, outpatient care, emergency, inpatient admission from a doctor's SPRI, through to pharmacy and billing.",
  },
  'Dashboard KOL': {
    summary:
      'A 5-page interactive BI dashboard (Streamlit and Plotly) for real-time monitoring of TikTok Shop GMV and campaign performance, with automated AI insights from the Gemini API.',
  },
  'Mobile JEC': {
    summary:
      'A mobile app for JEC Eye Hospitals &amp; Clinics patients, built with Flutter and Dart and a Node.js/Express backend. It includes an OCR feature that reads ID cards (KTP) automatically and sign-in with a Google account.',
  },
  'Dashboard JEC': {
    summary:
      'An admin dashboard (React JS and Node.js/Express) for managing patient data, schedules, and clinic operations in one place, sharing a single database with Mobile JEC.',
  },
  'Secura Kost': {
    summary:
      'A boarding house (kost) marketplace prototype (Vue.js and Tailwind CSS) with a 360° virtual tour, two-role authentication (tenants and owners), and a dynamic landing page.',
    // Same stack as the Projects section of the page
    tags: ['Vue.js', 'Tailwind CSS'],
  },
  'Toko Kelontong Online': {
    summary:
      'An e-commerce prototype (Vue.js, Pinia, and Tailwind CSS) with a dynamic product catalog, category filters, a reactive shopping cart, and a complete ordering flow.',
    tags: ['Vue.js', 'Tailwind CSS'],
  },
  'Kindle Coffee': {
    summary:
      'A front-end prototype for the Kindle Coffee coffee shop (Vue.js, Pinia, and Tailwind CSS) with interactive table/seat selection, a simulated Midtrans checkout, and receipt printing to PDF.',
  },
}

export const PROJECTS = PROJECTS_ID.map((project) => ({
  ...project,
  image: IMAGE[project.title] || project.image,
  ...PROJECT_TEXT[project.title],
}))

// --- Intent detection --------------------------------------------------
// Simple keyword-based intent detection for English. Order matters: the more
// specific intents (education, experience, projects, contact) are checked
// before the general fallback (who/about). Input is normalizeChat() output.
const RX = {
  education:
    /\b(education|educational|study|studies|studied|studying|degree|university|college|campus|school|major|graduat\w*|alma\s*mater|bachelor\w*|ulbi|academic\w*|uni)\b/i,
  experience:
    /\b(experiences?|career|work\s+history|employment|employers?|internships?|worked\s+(?:at|for|as)|work\s+background|professional\s+background|roles?|positions?)\b/i,
  projects:
    /\b(projects?|portfolio|works|his\s+work|work\s+samples?|built|build|made|creations?|apps|showcase)\b/i,
  contact:
    /\b(contact|reach|get\s+in\s+touch|email\s+(?:him|jose)|his\s+email|email\s+address|phone|number|whatsapp|call\s+him|message\s+him|hire|hiring|talk\s+to\s+(?:him|jose)|connect\s+with)\b/i,
  who: /\b(who\s+is|who\s+exactly\s+is|introduce|introduction|tell\s+me\s+about)\b/i,
  about: /\b(about|profile|bio|biography|background|summary|overview|describe)\b/i,
  mentionsJose: /\bjose\b/i,
  question: /\?|\b(what|how|where|when|who|which|why|does|is|can)\b/i,
  link: /\b(links?|url|demo|github|repo|repository|source\s*code|code)\b/i,

  // "work"/"job" on its own is ambiguous: Jose's work history (-> 'experience')
  // or the visitor offering Jose a job (-> 'contact'). Without a hint, the bot
  // asks back instead of guessing (intent 'ambiguous_pekerjaan').
  pekerjaanAmbiguous: /\b(work|job|jobs)\b/i,
  pekerjaanHistoryHint:
    /\b(history|experience|past|previous|before|career|background|done|former|first|his\s+(?:work|jobs?))\b/i,
  pekerjaanOfferHint:
    /\b(offer\w*|openings?|vacanc\w*|hire|hiring|recruit\w*|freelance|collaborat\w*|opportunit\w*)\b/i,

  // Common clearly off-topic requests. Not a full list.
  offtopic:
    /\b(recipes?|cook(?:ing)?|baking|weather|forecast|translate|translation|lyrics|sing\s+(?:me|a)|horoscope|zodiac|fortune\s+telling|math\s+homework)\b/i,
}

/**
 * Detects whether a visitor message is an FAQ question about Jose.
 * Returns null if not (the contact form flow continues).
 */
export function matchFaqIntent(rawText) {
  const text = (rawText || '').toLowerCase()

  if (RX.education.test(text)) return { type: 'education' }
  if (RX.experience.test(text)) return { type: 'experience' }
  if (RX.projects.test(text)) return { type: 'projects', wantsLink: RX.link.test(text) }
  if (RX.contact.test(text)) return { type: 'contact' }
  if (RX.who.test(text) || RX.about.test(text)) return { type: 'about' }

  // General question mentioning "jose", e.g. "what is jose like?" -> about
  if (RX.mentionsJose.test(text) && RX.question.test(text)) {
    return { type: 'about' }
  }

  if (RX.pekerjaanAmbiguous.test(text)) {
    if (RX.pekerjaanHistoryHint.test(text)) return { type: 'experience' }
    if (RX.pekerjaanOfferHint.test(text)) return { type: 'contact' }
    return { type: 'ambiguous_pekerjaan' }
  }

  if (RX.offtopic.test(text)) return { type: 'offtopic' }

  return null
}

// Answers to the clarifying question "work history, or offering a job?"
export const PEKERJAAN_CLARIFY_HISTORY_RX = RX.pekerjaanHistoryHint
export const PEKERJAAN_CLARIFY_OFFER_RX =
  /\b(offer\w*|openings?|vacanc\w*|hire|hiring|recruit\w*|freelance|collaborat\w*|opportunit\w*|contact|second|latter)\b/i

// --- Names ----------------------------------------------------------------
// "my name is sarah", "i'm sarah", "call me sarah", "this is sarah",
// "hi, i am sarah" (a greeting in front is stripped by the widget).
const NAME_STATEMENT_RX =
  /(?:^|[\s,.!])(?:my\s+name\s+is|my\s+name's|my\s+name|name\s+is|name's|you\s+can\s+call\s+me|just\s+call\s+me|call\s+me|they\s+call\s+me|i\s+go\s+by|i\s+am\s+called|i'm\s+called|i\s+am|i'm|im|this\s+is|it's|it\s+is)\s*(?::)?\s+([a-zA-Z][a-zA-Z'.\- ]{0,40})/i

// Words that are clearly not a name even right after "i am"/"i'm",
// e.g. "i'm looking for", "i am a recruiter", "i'm just browsing".
const NOT_A_NAME_RX =
  /^(looking|interested|just|here|from|fine|good|great|well|ok|okay|not|so|very|really|also|still|currently|working|trying|curious|wondering|new|back|sorry|glad|happy|sure|ready|available|hiring|recruiter|recruiting|student|developer|engineer|designer|manager|hr|going|gonna|want|wanna|asking|checking|browsing|visiting|doing|tired|bored|busy|interested|calling|writing|reaching|contacting|in|at|on|with|of|to|for|his|her|your|my|a|an|the|no|yes|actually|only|the|reaching|hoping|planning|about|feeling|done|confused|lost|unsure|bot|human|real|me|you|it|that|this|what|who|raining|late|early)$/i

// Common English words that are almost never a person's name. Prevents
// "this is great" from being read as the name "Great".
const COMMON_WORDS = new Set(
  `
  a an the and or but if then so because as of at by for from in into on onto to with without about over under
  i me my mine you your yours he him his she her it its we us our they them their this that these those there here
  is am are was were be been being do does did done have has had will would shall should can could may might must
  what who whom whose which when where why how
  yes yeah yep yup no nope nah ok okay sure fine alright right cool nice great good bad awesome amazing wow
  hi hello hey hiya howdy greetings morning afternoon evening night day today tomorrow yesterday now later soon
  thanks thank thx please pls sorry welcome bye goodbye see you
  test testing check help info information question questions answer ask tell show give send message email name
  just only also too very really quite still already again more most less some any all every each much many
  time date week month year hour minute
  web website site app apps application project projects portfolio work job jobs career experience education
  school college university degree contact phone number address location city country
  bot robot ai admin assistant human person someone somebody anyone everyone nothing something anything
  weather recipe food eat drink sleep play watch read write learn code coding
  money price cost free cheap
  not never always maybe perhaps actually basically literally honestly
  lol haha hehe hmm huh oh ah um uh
  `
    .split(/\s+/)
    .filter(Boolean),
)

// Question words: a question is not treated as introducing a name unless the
// statement is explicit ("my name is sarah, can i ask something?").
const QUESTION_WORD_RX =
  /\?|\b(what|who|when|where|why|how|which|whose)\b|^\s*(?:does|do|did|is|are|can|could|would|will|has|have)\b/i
const EXPLICIT_NAME_RX = /\b(name|call\s+me|go\s+by|called)\b/i
const NAME_HERE_RX = /^([a-zA-Z][a-zA-Z'-]+)\s+here[\s!.]*$/i

function isLikelyName(word) {
  return (
    !!word &&
    word.length >= 2 &&
    !COMMON_WORDS.has(word.toLowerCase()) &&
    !NOT_A_NAME_RX.test(word) &&
    !GREETING_WORD_RX.test(word)
  )
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

const straightQuotes = (text) => (text || '').replace(/[‘’ʼ]/g, "'")

export function matchNameStatement(rawText) {
  const text = straightQuotes(rawText).trim()
  if (!text) return null
  const isQuestion = QUESTION_WORD_RX.test(text)

  const rx = new RegExp(NAME_STATEMENT_RX.source, 'gi')
  for (const match of text.matchAll(rx)) {
    if (isQuestion && !EXPLICIT_NAME_RX.test(match[0])) continue
    const firstWord = match[1]
      .trim()
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z'-]/g, '')
      .replace(/'s$/i, '')
    if (!isLikelyName(firstWord)) continue
    return { name: capitalize(firstWord) }
  }

  // "sarah here"
  const here = text.match(NAME_HERE_RX)
  if (here && !isQuestion && isLikelyName(here[1])) return { name: capitalize(here[1]) }
  return null
}

// Name from a plain answer ("sarah connor" -> "Sarah"). Returns null if the
// text does not look like a name: digits, greetings, or a whole sentence.
export function extractPlainName(rawText) {
  const words = straightQuotes(rawText)
    .trim()
    .replace(/[!.,?]+$/g, '')
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0 || words.length > 3) return null
  if (QUESTION_WORD_RX.test(rawText)) return null
  if (!/^[a-zA-Z][a-zA-Z'.-]*$/.test(words[0])) return null
  if (!words.every((w) => isLikelyName(w.replace(/[^a-zA-Z'-]/g, '')))) return null
  return capitalize(words[0])
}

// --- Small talk (greetings, thanks, etc.) -----------------------------------

// Greeting based on the visitor's device clock.
export function getTimeOfDay(date = new Date()) {
  const h = date.getHours()
  if (h >= 4 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  return 'evening'
}

const GREETING_WORD_RX =
  /^(hi+|hello+|hey+|hiya|howdy|yo|greetings|morning|afternoon|evening|there)$/i

const SMALL_TALK = {
  // The whole message is only a greeting
  greeting:
    /^(?:(?:hi+|hello+|hey+|hiya|howdy|yo|greetings|good\s+(?:morning|afternoon|evening|day)|morning|afternoon|evening)(?:\s+(?:there|again|jose|bot|everyone|all|team|friend|sir|madam|to\s+you|too))*[\s!.,~]*)+$/i,
  greetingPrefix:
    /^(?:hi+|hello+|hey+|hiya|howdy|greetings|good\s+(?:morning|afternoon|evening|day))\b(?:\s+there\b)?[\s,!.]*/i,
  howAreYou:
    /\b(how\s+are\s+(?:you|u)|how\s+r\s+u|how\s+(?:is|are)\s+(?:it|things)\s+going|how's\s+it\s+going|how\s+are\s+things|how\s+have\s+you\s+been|how\s+is\s+your\s+day|how's\s+your\s+day|what's\s+up|whats\s+up|wassup)\b/i,
  thanks:
    /^(?:(?:thanks|thank\s+(?:you|u)|thx|ty|tysm|cheers|much\s+appreciated|appreciate\s+it|many\s+thanks)(?:\s+(?:so|very|a\s+lot|lots|much|again|jose|bot|for\s+(?:the|your)\s+(?:help|info|information|time|answer)))*[\s!.~]*)+$/i,
  bye: /^(?:(?:bye|goodbye|good\s*bye|bye\s+bye|see\s+(?:you|ya)(?:\s+later|\s+soon)?|cya|later|take\s+care|have\s+a\s+(?:good|nice|great)\s+(?:day|one|night|evening|weekend)|catch\s+you\s+later|i\s+(?:have|need)\s+to\s+go|gotta\s+go|that's\s+all\s+for\s+now)(?:\s+(?:now|then|jose|bot|for\s+now))*[\s!.~]*)+$/i,
  ack: /^(?:ok+|okay|okey|k+|alright|all\s+right|cool|nice|great|good|got\s+it|i\s+see|understood|noted|perfect|fine|right|ah+|oh+|hmm+|haha+|wow|sounds\s+good|makes\s+sense)(?:\s+(?:then|thanks|cool|great|sure|got\s+it))*[\s!.~]*$/i,
  // Questions about the bot itself, not about Jose
  aboutBot:
    /\b(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(?:a\s+)?(?:bot|robot|ai|human|real|person|real\s+person|chatbot)|am\s+i\s+(?:talking|chatting|speaking)\s+(?:to|with)\s+(?:a\s+)?(?:bot|robot|ai|human|real\s+person|person))\b/i,
}

/**
 * Small talk detection. Returns { type } or null.
 * type: greeting | howAreYou | thanks | bye | ack | aboutBot
 */
export function matchSmallTalk(rawText) {
  const text = straightQuotes(rawText).trim()
  if (!text) return null
  if (SMALL_TALK.aboutBot.test(text)) return { type: 'aboutBot' }
  if (SMALL_TALK.howAreYou.test(text)) return { type: 'howAreYou' }
  if (SMALL_TALK.greeting.test(text)) return { type: 'greeting' }
  if (SMALL_TALK.thanks.test(text)) return { type: 'thanks' }
  if (SMALL_TALK.bye.test(text)) return { type: 'bye' }
  if (SMALL_TALK.ack.test(text)) return { type: 'ack' }
  return null
}

// "hi there, i'm sarah" -> "i'm sarah" (greeting removed) so the rest of the
// sentence can still be processed as a name or question.
export function stripGreetingPrefix(rawText) {
  let text = straightQuotes(rawText).trim()
  let prev
  do {
    prev = text
    text = text.replace(SMALL_TALK.greetingPrefix, '').replace(/^(?:there|again|jose)\b[\s,!.]*/i, '')
  } while (text && text !== prev)
  return text
}

export function hasGreetingPrefix(rawText) {
  return SMALL_TALK.greetingPrefix.test(straightQuotes(rawText).trim())
}

// A question or request for information (used at the "message" step so a
// message like "I'd like to offer him a project" is not answered as an FAQ).
export function looksLikeQuestion(rawText) {
  const text = straightQuotes(rawText).trim().toLowerCase()
  return (
    /\?\s*$/.test(text) ||
    /^(what|what's|whats|who|who's|how|where|when|which|why|does|do|did|is|are|was|can|could|would|will|has|have|please|tell\s+me|show\s+me|explain|describe|i\s+want\s+to\s+know|i'd\s+like\s+to\s+know|i\s+would\s+like\s+to\s+know)\b/.test(
      text,
    )
  )
}

// Time of day the visitor used in their greeting ("good evening" -> "evening"),
// so the bot replies with the same one.
export function getUserTimeGreeting(rawText) {
  const text = (rawText || '').trim()
  const match =
    text.match(/\bgood\s+(morning|afternoon|evening)\b/i) ||
    text.match(/^(morning|afternoon|evening)\b/i)
  return match ? match[1].toLowerCase() : null
}

// At the "message" step: long sentences or sentences with an intent (offering
// a project, freelance, collaboration) are the message for Jose, even when
// phrased as a question. Do not answer them as FAQ.
const MESSAGE_INTENT_RX =
  /\b(offer|offering|freelance|hire|hiring|recruit\w*|vacanc\w*|opening|interview|collaborat\w*|partnership|budget|cost|price|pricing|rate|fee|quote|services?|commission|build\s+(?:me|us)|develop\s+(?:a|an|our|my)|available|availability|join|invite|invitation|opportunit\w*|proposal)\b/i

export function looksLikeMessageToJose(rawText) {
  const text = (rawText || '').trim()
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return wordCount >= 9 || MESSAGE_INTENT_RX.test(text)
}

// The visitor does not want to share their name/email yet, or wants to talk
// about something else first: "not now", "maybe later", "skip", "i'd rather not".
export const DECLINE_RX =
  /(?:^\s*(?:no|nope|nah)\b|\b(?:no\s+thanks|not\s+(?:now|yet|right\s+now|ready|comfortable|today)|maybe\s+later|later|skip|pass|rather\s+not|prefer\s+not|i'?d\s+rather\s+not|don'?t\s+want\s+to|do\s+not\s+want\s+to|no\s+email|without\s+(?:my\s+)?email|private|privacy|anonymous|just\s+(?:browsing|looking|asking|checking)|something\s+else|other\s+(?:things|topics?)|chat\s+first|ask\s+(?:something|questions)\s+first|look\s+around)\b)/i

// The visitor wants to continue sending a message to Jose from free chat mode.
export const RESUME_CONTACT_RX =
  /\b(?:(?:want|would\s+like|like|ready|wish|going)\s+to\s+(?:send|leave|write|drop)(?:\s+him)?\s+(?:a\s+)?(?:message|note)|send\s+(?:him\s+)?(?:a\s+)?message|leave\s+(?:him\s+)?(?:a\s+)?message|message\s+(?:him|jose)|contact\s+(?:him|jose)\s+now|let'?s\s+(?:do\s+it|continue)|continue|go\s+ahead|i'?ll\s+(?:give|share)\s+(?:you\s+)?my)\b/i

// When the visitor asks the bot to choose ("anything", "up to you").
export const PICK_ANY_RX =
  /^(?:anything|whatever|up\s+to\s+you|you\s+choose|you\s+pick|not\s+sure|i\s+don'?t\s+know|dunno|something\s+else)\b/i

// Short topic list for free chat mode (no name/email requested).
export const TOPICS_MENU_HTML = [
  '<p>I can tell you about:</p>',
  '<ul class="chat-widget__highlight-list">',
  "<li>Jose's profile</li>",
  '<li>Education</li>',
  '<li>Work and organizational experience</li>',
  '<li>Projects he has worked on</li>',
  '<li>How to contact Jose</li>',
  '</ul>',
  '<p>Just type a question, for example "What projects has Jose worked on?". If you want to send Jose a message later, just say "send a message".</p>',
].join('')

// =====================================================================
// Conversational layer
// 1. normalizeChat(): tidy chat language (contractions, abbreviations,
//    repeated letters) before matching.
// 2. matchConversation(): intents more specific than the FAQ.
// 3. pickVariant(): random sentence without repeating the previous one.
// =====================================================================

const CONTRACTIONS = [
  [/\bwhat's\b/g, 'what is'],
  [/\bwhats\b/g, 'what is'],
  [/\bwho's\b/g, 'who is'],
  [/\bwhere's\b/g, 'where is'],
  [/\bhow's\b/g, 'how is'],
  [/\bthat's\b/g, 'that is'],
  [/\bit's\b/g, 'it is'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\blet's\b/g, 'let us'],
  [/\bi'm\b/g, 'i am'],
  [/\bim\b/g, 'i am'],
  [/\bi've\b/g, 'i have'],
  [/\bi'd\b/g, 'i would'],
  [/\bi'll\b/g, 'i will'],
  [/\byou're\b/g, 'you are'],
  [/\byou've\b/g, 'you have'],
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\b(\w+)'s\b/g, '$1'], // possessive: "jose's projects" -> "jose projects"
]

const SLANG = {
  u: 'you', ur: 'your', r: 'are', yu: 'you', pls: 'please', plz: 'please',
  thx: 'thanks', thanx: 'thanks', ty: 'thanks', tnx: 'thanks',
  wanna: 'want to', gonna: 'going to', gimme: 'give me', lemme: 'let me',
  abt: 'about', bout: 'about', wat: 'what', wut: 'what', hes: 'he is', whos: 'who is',
  doesnt: 'does not', dont: 'do not', cant: 'cannot', isnt: 'is not',
  proj: 'project', projs: 'projects', exp: 'experience', edu: 'education',
  uni: 'university', info: 'information', pic: 'picture', k: 'ok', kk: 'ok',
}

export function normalizeChat(rawText) {
  let text = straightQuotes(rawText)
    .toLowerCase()
    .replace(/([a-z])\1{2,}/g, '$1$1') // "hiii" -> "hii", "sooo" -> "soo"
  for (const [rx, replacement] of CONTRACTIONS) text = text.replace(rx, replacement)
  return text
    .replace(/[^\p{L}\p{N}@.?\s+#-]/gu, ' ')
    .split(/\s+/)
    .map((word) => {
      const bare = word.replace(/[.?]+$/, '')
      const tail = word.slice(bare.length)
      return (SLANG[bare] || bare) + tail
    })
    .join(' ')
    .trim()
}

// Random sentence, but never the same as the last pick for the same key.
const lastVariant = {}
export function pickVariant(key, list) {
  if (list.length === 1) return list[0]
  let index
  do {
    index = Math.floor(Math.random() * list.length)
  } while (index === lastVariant[key])
  lastVariant[key] = index
  return list[index]
}

// Short "yes"/"no" answers to an offer from the bot ("Want me to tell you more?").
// Matched against normalizeChat() output (contractions already expanded).
export const YES_RX =
  /^(?:yes+|yeah|yea|yep|yup|ya|y|sure|ok+|okay|okey|alright|of\s+course|definitely|absolutely|certainly|please|go\s+ahead|do\s+it|let\s+us\s+do\s+it|let\s+us\s+see|why\s+not|sounds\s+good|that\s+would\s+be\s+(?:great|nice|good)|i\s+would\s+like\s+that|i\s+would\s+love\s+that|show\s+me|tell\s+me|links?|demo|repo|more|go\s+on|continue)(?:\s+(?:please|sure|thing|thanks|thank\s+you|of\s+course|show\s+me|tell\s+me|more|i\s+would\s+(?:like|love)\s+that|i\s+would|i\s+do|do\s+it|go\s+ahead|then|why\s+not|definitely|sounds\s+good|that\s+would\s+be\s+(?:great|nice|good)))*[\s!.~]*$/i
export const NO_RX =
  /^(?:no+|nope|nah|not\s+(?:now|really|yet|today|necessary|needed)|no\s+need|not\s+interested|i\s+am\s+(?:good|fine|ok|okay)|skip|maybe\s+later|later|never\s*mind|nevermind|that\s+is\s+(?:all|enough|fine|ok)|all\s+good|i\s+will\s+pass|pass)(?:\s+(?:thanks|thank\s+you|please|for\s+now|right\s+now|then|sorry|jose|i\s+am\s+good|maybe\s+later))*[\s!.~]*$/i

// Short summary of Jose, used before the full profile.
export const ABOUT_SHORT_HTML =
  '<p>In short, <strong>Jose Elio Parhusip</strong> is a Digital Business graduate from ULBI Bandung who now works as a Back End Developer at PT SPKD. He enjoys building web and mobile apps as well as data dashboards.</p>'

// Tools/technologies Jose knows, with recognition patterns.
const TECHS = [
  { name: 'Flutter', rx: /\bflutter/ },
  { name: 'Dart', rx: /\bdart\b/ },
  { name: 'React', rx: /\breact/ },
  { name: 'Vue.js', rx: /\bvue/ },
  { name: 'Node.js', rx: /\bnode(?:\s*js|\.js)?\b/ },
  { name: 'Express', rx: /\bexpress(?:\s*js|\.js)?\b/ },
  {
    name: 'Go',
    rx: /\bgolang\b|\bgo\s*lang\b|\b(?:in|use|uses|used|using|know|knows|code|coding|write|writes|with|program|programs|learn|learned|familiar|experience|experienced)\s+go\b|\bgo\s*\?|\bgo\s+(?:language|programming|backend)\b|\bgo\s*\(gin\)/,
  },
  { name: 'Gin', rx: /\bgin\b/ },
  { name: 'PHP', rx: /\bphp\b/ },
  { name: 'Python', rx: /\bpython/ },
  { name: 'Streamlit', rx: /\bstreamlit/ },
  { name: 'Plotly', rx: /\bplotly/ },
  { name: 'Power BI', rx: /\bpower\s*bi\b/ },
  { name: 'Excel', rx: /\bexcel\b/ },
  { name: 'Google Colab', rx: /\bcolab/ },
  { name: 'PostgreSQL', rx: /\bpostgre/ },
  { name: 'MySQL', rx: /\bmysql/ },
  { name: 'Figma', rx: /\bfigma/ },
  { name: 'Tailwind CSS', rx: /\btailwind/ },
  { name: 'Next.js', rx: /\bnext\s*\.?\s*js\b|\bnextjs\b/ },
  { name: 'TypeScript', rx: /\btypescript\b/ },
  { name: 'JavaScript', rx: /\bjavascript\b|\bjs\b/ },
  { name: 'Docker', rx: /\bdocker/ },
  { name: 'Git', rx: /\bgit\b/ },
  { name: 'Postman', rx: /\bpostman/ },
  { name: 'Swagger', rx: /\bswagger/ },
  { name: 'Pandas', rx: /\bpandas\b/ },
  { name: 'GORM', rx: /\bgorm\b/ },
  { name: 'JWT', rx: /\bjwt\b/ },
  { name: 'Pinia', rx: /\bpinia/ },
  { name: 'Midtrans', rx: /\bmidtrans/ },
  { name: 'Gemini API', rx: /\bgemini/ },
  { name: 'SAP', rx: /\bsap\b/ },
  { name: 'UML', rx: /\buml\b/ },
  { name: 'ERD', rx: /\berd\b/ },
  { name: 'REST API', rx: /\brest(?:ful)?\s*apis?\b/ },
  { name: 'OCR', rx: /\bocr\b/ },
]

// Popular technologies that are NOT in Jose's data. The bot says so honestly.
const UNKNOWN_TECH_RX =
  /(?<![\w.])(laravel|java|kotlin|swift|django|flask|angular|svelte|nuxt|kubernetes|aws|azure|gcp|mongodb|firebase|ruby|rust|unity|wordpress|spring|\.net|dotnet|c\+\+|c#)(?![\w+#])/

const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')

function joinList(items) {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

// Evidence of a technology in Jose's projects and experience.
// A tag equal to the tech name always counts (the "Go" tag does not match the
// Go pattern, which is written to avoid the everyday word "go").
export function findTechEvidence(tech) {
  const rx = new RegExp(tech.rx.source, 'i')
  const name = (tech.name || '').toLowerCase()
  const uses = (item) =>
    item.tags.some((tag) => tag.toLowerCase() === name) ||
    rx.test(`${item.tags.join(' ')} ${stripHtml(item.summary)}`)
  return { projects: PROJECTS.filter(uses), roles: EXPERIENCES.filter(uses) }
}

// A specific project mentioned by name.
const PROJECT_ALIASES = [
  { title: 'MedCredix', rx: /\bmed\s*credix\b|\bcredentialing\s+(?:platform|readiness)/ },
  { title: 'SIMRS Dashboard', rx: /\bsimrs\b|\bhospital\s+information\s+system/ },
  { title: 'Dashboard KOL', rx: /\bdashboard\s*kol\b|\bkol\s+dashboard\b|\bkol\b|\bsavvy\b|tiktok/ },
  { title: 'Mobile JEC', rx: /\b(?:mobile|app|application|apk)\s*jec\b|\bjec\s+(?:mobile|app|application)\b/ },
  { title: 'Dashboard JEC', rx: /\b(?:dashboard|admin)\s*jec\b|\bjec\s+(?:dashboard|admin)\b/ },
  { title: 'Secura Kost', rx: /\bsecura|\bkost\b|\bboarding\s+house/ },
  { title: 'Toko Kelontong Online', rx: /\bkelontong|\bgrocery/ },
  { title: 'Kindle Coffee', rx: /\bkindle|\bcoffee\b/ },
]

export function findProjectMentions(norm) {
  const found = PROJECT_ALIASES.filter((a) => a.rx.test(norm)).map((a) => a.title)
  // "jec" on its own can mean both projects
  if (!found.length && /\bjec\b/.test(norm)) found.push('Mobile JEC', 'Dashboard JEC')
  return PROJECTS.filter((p) => found.includes(p.title))
}

const CONVO = {
  rude: /\b(stupid|idiot|dumb|moron|shut\s+up|fuck\w*|shit\w*|bitch|asshole|bastard|useless\s+bot|you\s+suck)\b/,
  laugh: /^(?:(?:ha)+h?|(?:he)+h?|(?:hi){2,}h?|lol+|lmao|lmfao|rofl|xd)[\s!.~]*$/,
  compliment:
    /\b(awesome|amazing|impressive|beautiful|stunning|fantastic|brilliant|excellent|well\s+done|good\s+job|great\s+job|nice\s+work|great\s+work|love\s+(?:it|this|the)|i\s+like\s+(?:it|this|the))\b|\b(?:nice|cool|great|neat|sleek|clean|good)\s+(?:website|site|portfolio|design|work|projects?|page|bot|chat|chatbot)\b/,
  meet: /\b(get\s+to\s+know|nice\s+to\s+meet|pleased\s+to\s+meet|glad\s+to\s+meet|meet\s+you|introduce\s+(?:yourself|myself))\b/,
  aboutJose: /\b(jose|him|his|he|owner)\b/,
  askBotName:
    /\b(what\s+is\s+your\s+name|your\s+name|do\s+you\s+have\s+a\s+name|what\s+should\s+i\s+call\s+you|what\s+do\s+i\s+call\s+you)\b/,
  botCapabilities:
    /\b(what\s+can\s+you\s+(?:do|help\s+with|tell\s+me|answer)|how\s+can\s+you\s+help|what\s+do\s+you\s+know|what\s+can\s+i\s+ask)\b|^(?:help|menu|options|topics|features)\b/,
  askHuman:
    /\b(is\s+this\s+(?:really\s+)?jose|are\s+you\s+(?:really\s+)?jose|(?:talk|speak|chat)\s+(?:to|with)\s+(?:jose|him|a\s+(?:real\s+)?(?:person|human))|real\s+person|the\s+real\s+jose)\b/,
  personal:
    /\b(age|how\s+old\s+is|birthday|born|girlfriend|boyfriend|married|wife|single|dating|religion|religious|salary|how\s+much\s+(?:does\s+)?(?:he|jose)\s+(?:make|earn)|height|weight)\b/,
  gpa: /\b(gpa|grades?|ipk|transcript|cum\s*laude|honou?rs)\b/,
  cert: /\b(certificates?|certifications?|certified|certs?|toefl|courses?|bootcamp|training)\b/,
  cv: /\b(cv|resume|curriculum\s+vitae)\b/,
  currentJob:
    /\b(?:currently|now|these\s+days|at\s+the\s+moment|right\s+now)\b.*\b(?:work|works|working|job|position|role|employed|doing)\b|\bwhere\s+(?:does|do|is)\s+(?:he|jose)\s+work|\bwhere\s+(?:is\s+)?(?:he|jose)\s+working|\bcurrent\s+(?:job|role|position|employer|company|work)|\bwho\s+does\s+(?:he|jose)\s+work\s+for|\bwhat\s+does\s+(?:he|jose)\s+do\b|\bis\s+(?:he|jose)\s+(?:currently\s+)?employed/,
  location:
    /\bwhere\s+(?:does|is|do)\s+(?:he|jose)\s+(?:live|living|based|from|located|stay|staying)\b|\bwhere\s+(?:is\s+)?(?:he|jose)\s+from\b|\b(location|located|based\s+in|lives?\s+in|hometown|which\s+city|what\s+city)\b/,
  availability:
    /\b(open\s+(?:to|for)\s+work|available|availability|looking\s+for\s+(?:a\s+)?(?:job|work|opportunities|new\s+roles?|roles?)|job\s+hunting|open\s+to\s+(?:freelance|offers|opportunities|new\s+roles)|accept(?:s|ing)?\s+(?:freelance|projects|clients|work|commissions)|can\s+i\s+hire\s+(?:him|jose)|hireable|for\s+hire|take\s+(?:on\s+)?(?:freelance|projects|clients))\b/,
  social: /\b(github|linkedin|instagram|social\s+media|socials|twitter)\b/,
  skills:
    /\b(skills?|skillset|expertise|tools|tech\s*stack|stack|technolog\w*|programming\s+languages?|what\s+can\s+he\s+do|good\s+at|proficient|strengths?)\b/,
  skillQuestion:
    /\b(know|knows|use|uses|used|using|familiar|experienced|experience|skilled|proficient|can|could|does|did|do|good\s+at|work\s+with|worked\s+with|code|program|write|expert|tried)\b|\?/,

  // --- Light chat with the bot ---
  botActivity: /\b(what\s+are\s+you\s+(?:doing|up\s+to)|are\s+you\s+busy|keeping\s+busy)\b/,
  botEat: /\b(have\s+you\s+(?:eaten|had\s+(?:lunch|dinner|breakfast)|slept)|did\s+you\s+eat|do\s+you\s+(?:eat|sleep|drink))\b/,
  botGender: /\b(are\s+you\s+(?:a\s+)?(?:boy|girl|man|woman|male|female|guy)|your\s+gender|what\s+gender)\b/,
  botHome: /\bwhere\s+(?:do\s+you\s+live|are\s+you\s+from|are\s+you\s+located|do\s+you\s+come\s+from)\b|\byour\s+home\b/,
  botMaker:
    /\b(who\s+(?:made|built|created|programmed|developed|designed)\s+(?:you|this\s+bot|this\s+chatbot)|who\s+is\s+your\s+(?:creator|maker|developer)|how\s+(?:were|are)\s+you\s+(?:made|built))\b/,
  mood: /\b(tired|exhausted|bored|sad|stressed|sleepy|upset|annoyed|frustrated|lonely|headache|bad\s+day|rough\s+day)\b/,
  happy:
    /^(?:(?:i\s+am|i\s+feel|feeling)\s+(?:so\s+|very\s+|really\s+|pretty\s+)?(?:happy|glad|excited|great|good|fine|well|awesome)\b|(?:so\s+)?(?:happy|excited)\b)/,
  testMsg: /^(?:test|testing|tes|check|ping)(?:\s*\d+)*[\s!.?]*$/,
  goodnight: /\b(good\s*night|nighty\s*night|going\s+to\s+(?:bed|sleep)|time\s+to\s+sleep)\b/,

  // --- Time and date ---
  timeNow:
    /\bwhat\s+time\s+is\s+it\b|\bwhat\s+is\s+the\s+(?:current\s+)?time\b|\bcurrent\s+time\b|\btime\s+(?:is\s+it\s+)?now\b|\bdo\s+you\s+have\s+the\s+time\b/,
  dateNow:
    /\bwhat\s+(?:is\s+)?(?:the\s+)?date\b|\bwhat\s+day\s+is\s+(?:it|today)\b|\btoday\s+date\b|\bwhat\s+is\s+today\b|\bwhich\s+day\s+is\s+it\b|\bwhat\s+(?:month|year)\s+is\s+it\b/,

  // --- Other light chat ---
  botAge: /\bhow\s+old\s+are\s+you\b|\byour\s+age\b|\bwhen\s+were\s+you\s+(?:made|born|created)\b/,
  botLanguage:
    /\b(do\s+you\s+speak|can\s+you\s+speak|speak\s+(?:indonesian|bahasa|english|other\s+languages)|what\s+languages?\s+(?:do|can)\s+you|in\s+indonesian|bahasa\s+indonesia)\b/,
  botLikes: /\b(what\s+do\s+you\s+like|do\s+you\s+like|your\s+(?:hobby|hobbies|favou?rite)|what\s+are\s+your\s+hobbies)\b/,
  apology: /^(?:sorry|my\s+bad|apologies|i\s+apologi[sz]e|oops|excuse\s+me)\b/,
  askPermission:
    /^(?:can|may|could)\s+i\s+(?:ask|have\s+a\s+question)\b|^i\s+have\s+a\s+(?:quick\s+)?question\b/,
}

// --- Filter: requests the bot cannot or should not handle ---
const GUARD = {
  inappropriate:
    /\b(porn\w*|sex|sexy|sexual|nude\w*|naked|nsfw|xxx|onlyfans|gambl\w*|casino|betting|cocaine|heroin|meth|weed|marijuana)\b/,
  moneyRequest:
    /\b(give|send|lend|loan|transfer|donate|pay)\s+(?:me|us)\b.*\b(money|cash|dollars?|rupiah|bucks|crypto|bitcoin)\b|\b(borrow\s+money|lend\s+me|loan\s+me|need\s+money|give\s+me\s+money|donate\s+to\s+me)\b/,
  illegal:
    /\b(hack(?!athon)\w*|crack(?:ing|ed)?|phishing|ddos|carding|steal\w*|piracy|pirated|keylogger|malware|ransomware|spam\w*|someone\s+(?:password|account)|bypass\s+(?:security|login|paywall))\b/,
  flirt:
    /\b(i\s+love\s+you|love\s+you|marry\s+me|be\s+my\s+(?:girlfriend|boyfriend|valentine)|date\s+me|go\s+out\s+with\s+me|you\s+are\s+(?:cute|hot|beautiful|handsome|pretty)|i\s+miss\s+you|kiss\s+me)\b/,
  homework:
    /\b(do|write|solve|finish|fix|debug|complete)\s+(?:my|our)\s+(?:homework|assignment|code|essay|thesis|exam|test|bug)\b|\b(write|generate|make)\s+(?:me\s+)?(?:a|an|some)\s+(?:code|script|program|essay|function)\b|\bhelp\s+me\s+(?:with\s+)?(?:my\s+)?(?:homework|assignment|essay|thesis|exam)\b/,
}

// Topics unrelated to Jose, with a category name for a more natural reply.
const OFFTOPIC_TOPICS = [
  ['politics', /\b(politics|political|president|elections?|government|parliament|senator|congress|prime\s+minister|voting)\b/],
  ['news and gossip', /\b(news|gossip|celebrit\w*|headlines)\b/],
  ['sports', /\b(football|soccer|basketball|baseball|tennis|badminton|cricket|nba|nfl|f1|formula\s*1|motogp|world\s+cup|premier\s+league)\b/],
  ['games', /\b(games?|gaming|video\s+games?|minecraft|roblox|fortnite|valorant|pubg|mobile\s+legends|genshin)\b/],
  ['movies and entertainment', /\b(movies?|films?|netflix|tv\s+shows?|anime|manga|music|songs?|lyrics|sing|concert|k-?pop)\b/],
  ['finance and investing', /\b(stocks?|crypto\w*|bitcoin|trading|forex|investing|investment|gold\s+price)\b/],
  ['health', /\b(medicine|fever|diet|symptoms?|disease|cough|flu|vitamins?|sick|illness)\b/],
  ['cooking', /\b(recipes?|cook(?:ing|ed|s)?|bake|baking|restaurants?|dinner\s+ideas?)\b/],
  ['the weather', /\b(weather|forecast|raining|temperature\s+today|earthquake|flood)\b/],
  ['fortune telling', /\b(horoscope|zodiac|astrology|tarot|fortune\s+telling)\b/],
  ['school subjects', /\b(math|maths|mathematics|physics|chemistry|biology|equation|calculate|solve\s+for|exam\s+questions?)\b/],
  ['translation', /\b(translate|translation|meaning\s+of\s+the\s+word)\b/],
  ['religion', /\b(heaven|hell|prayer|pray|bible|quran)\b/],
  ['travel', /\b(vacation|holiday|travel\w*|flights?|hotels?|tourist|tourism|places\s+to\s+visit)\b/],
  ['shopping', /\b(shopping|discount|promo\s+code|coupon|amazon|ebay)\b/],
  ['other AI assistants', /\b(chatgpt|chat\s+gpt|gpt-?\d|copilot|siri|alexa)\b/],
]

// If the sentence is clearly about Jose, it is not off topic
// ("Jose's hospital projects", "does Jose have game projects").
const JOSE_TOPIC_RX =
  /\b(jose|projects?|portfolio|experience|education|degree|skills?|tools|contact|cv|resume|medcredix|simrs|jec|hospital)\b/

function matchGuard(norm) {
  if (GUARD.inappropriate.test(norm)) return { type: 'inappropriate' }
  if (GUARD.moneyRequest.test(norm)) return { type: 'money' }
  if (GUARD.illegal.test(norm)) return { type: 'illegal' }
  if (GUARD.flirt.test(norm)) return { type: 'flirt' }
  if (GUARD.homework.test(norm)) return { type: 'homework' }
  if (!JOSE_TOPIC_RX.test(norm)) {
    const topic = OFFTOPIC_TOPICS.find(([, rx]) => rx.test(norm))
    if (topic) return { type: 'offtopicTopic', topic: topic[0] }
  }
  return null
}

/**
 * Conversation intents more specific than the FAQ. Returns { type, ... } or null.
 * Checked BEFORE matchFaqIntent().
 */
export function matchConversation(rawText) {
  const norm = normalizeChat(rawText)
  if (!norm) return null
  const words = norm.split(/\s+/).length

  if (CONVO.rude.test(norm)) return { type: 'rude' }
  const guard = matchGuard(norm)
  if (guard) return guard

  // Potential client: "budget for a website", "can he build me an app?"
  if (
    /\b(budget|cost|costs|price|pricing|rates?|fee|fees|quote|charge|build\s+(?:me|us|a|an)|make\s+(?:me|us)\s+(?:a|an)|develop\s+(?:a|an|our|my)|create\s+(?:a|an))\b/.test(norm) &&
    /\b(website|web|site|app|application|mobile|landing\s+page|dashboard|online\s+store|e-?commerce|system|platform)\b/.test(norm)
  ) {
    return { type: 'projectInquiry' }
  }

  if (CONVO.testMsg.test(norm)) return { type: 'testMsg' }
  if (CONVO.timeNow.test(norm)) return { type: 'timeNow' }
  if (CONVO.dateNow.test(norm)) return { type: 'dateNow' }
  if (CONVO.botAge.test(norm)) return { type: 'botAge' }
  if (CONVO.botLanguage.test(norm)) return { type: 'botLanguage' }
  if (CONVO.botLikes.test(norm) && !CONVO.aboutJose.test(norm)) return { type: 'botLikes' }
  if (CONVO.apology.test(norm) && words <= 6) return { type: 'apology' }
  if (CONVO.askPermission.test(norm) && words <= 8) return { type: 'askPermission' }
  if (CONVO.laugh.test(norm)) return { type: 'laugh' }
  if (CONVO.goodnight.test(norm)) return { type: 'goodnight' }
  if (CONVO.botMaker.test(norm)) return { type: 'botMaker' }
  if (CONVO.botGender.test(norm)) return { type: 'botGender' }
  if (CONVO.botHome.test(norm) && !CONVO.aboutJose.test(norm)) return { type: 'botHome' }
  if (CONVO.botEat.test(norm) && !CONVO.aboutJose.test(norm)) return { type: 'botEat' }
  if (CONVO.botActivity.test(norm) && !CONVO.aboutJose.test(norm) && words <= 6) return { type: 'botActivity' }
  if (CONVO.mood.test(norm) && !CONVO.aboutJose.test(norm) && words <= 8) return { type: 'mood' }
  if (CONVO.happy.test(norm) && words <= 6) return { type: 'happy' }
  if (CONVO.compliment.test(norm) && words <= 9 && !/\?/.test(norm)) return { type: 'compliment' }

  if (CONVO.meet.test(norm)) {
    // "get to know jose" -> wants to know Jose; otherwise an introduction to the bot
    return CONVO.aboutJose.test(norm) ? { type: 'aboutJose' } : { type: 'meetBot' }
  }
  if (CONVO.askBotName.test(norm)) return { type: 'askBotName' }
  if (CONVO.botCapabilities.test(norm)) return { type: 'botCapabilities' }
  if (CONVO.askHuman.test(norm)) return { type: 'askHuman' }
  if (CONVO.personal.test(norm)) return { type: 'personal' }
  if (CONVO.gpa.test(norm)) return { type: 'gpa' }
  if (CONVO.cert.test(norm)) return { type: 'cert' }
  if (CONVO.cv.test(norm)) return { type: 'cv' }
  if (CONVO.currentJob.test(norm)) return { type: 'currentJob' }
  if (CONVO.availability.test(norm)) return { type: 'availability' }

  const projects = findProjectMentions(norm)
  if (projects.length) return { type: 'projectDetail', projects }

  const tech = TECHS.find((t) => t.rx.test(norm))
  if (tech && CONVO.skillQuestion.test(norm)) return { type: 'techCheck', tech }
  const unknownTech = norm.match(UNKNOWN_TECH_RX)
  if (unknownTech && CONVO.skillQuestion.test(norm)) return { type: 'techUnknown', tech: unknownTech[1] }

  if (CONVO.location.test(norm)) return { type: 'location' }
  if (CONVO.social.test(norm) && !/\b(projects?|repo|demo)\b/.test(norm)) return { type: 'social' }
  if (CONVO.skills.test(norm)) return { type: 'skills' }
  return null
}

export const TOOLS_TEXT =
  'Vue.js, React, Next.js, TypeScript, Tailwind CSS, Go (Gin), Node.js/Express, PHP, PostgreSQL, MySQL, Docker, Git, Postman, Swagger, Python, Pandas, Streamlit, Plotly, Power BI, Excel, Google Colab, Flutter, Dart, and Figma'

export { joinList }
