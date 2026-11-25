// All landing-page copy lives here, so wording can change without touching layout.

// Shows the thin "demo build" bar at the top. Set to false when real payments go live.
export const SHOW_DEMO_NOTICE = true;

export const NAV_LINKS = [
  { href: "#book-now", label: "Book now" },
  { href: "#why", label: "Why practice" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export const WHY_ROWS: [string, string][] = [
  [
    "Re-read your notes and feel ready.",
    "Get a follow-up question and find out what you actually know.",
  ],
  [
    "Answer in your head, with no clock running.",
    "Answer out loud, in front of a person, in the time you would really have.",
  ],
  [
    "Ask a friend how it went.",
    "Hear it from someone who has interviewed candidates at a real company.",
  ],
  [
    "Wonder what went wrong after a rejection.",
    "Get a scorecard that names the weak area while you can still fix it.",
  ],
];

// status: "live" = works today, "soon" = shown with a Coming soon tag.
// Flip a feature to "live" here when it ships.
export const FEATURES: { title: string; body: string; status: "live" | "soon" }[] = [
  {
    title: "Interviewers from real companies",
    body: "Every interviewer is reviewed by our team before they can take a single interview. You never see their name or contact details.",
    status: "live",
  },
  {
    title: "Pick the tier that fits your goal",
    body: "Choose Tier 1, 2 or 3 depending on the kind of company you're aiming for. Each tier has its own price, shown before you pay.",
    status: "live",
  },
  {
    title: "Book and pay in one place",
    body: "Tell us a little about yourself, pay online, and we'll contact you to schedule the interview. No account needed.",
    status: "live",
  },
  {
    title: "A scorecard you can act on",
    body: "Scores for technical knowledge, problem solving and communication, plus written strengths, weak spots and what to study next.",
    status: "soon",
  },
  {
    title: "A secure interview room",
    body: "Video, screen sharing and chat inside InterviewPro, with a recording you can watch again later.",
    status: "soon",
  },
];

export const STEPS = [
  {
    title: "Choose a tier",
    body: "Pick the kind of company you want your interviewer to come from. Every tier shows its price.",
  },
  {
    title: "Tell us about you",
    body: "Add your mobile number, and if you like your domain, designation, experience and when you're free.",
  },
  {
    title: "Pay securely",
    body: "Pay online with Razorpay. You're charged only for the tier you picked.",
  },
  {
    title: "We schedule it",
    body: "We contact you to agree a time. You take the interview, then review your scorecard.",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "I'm a fresher. Is this for me?",
    a: "Yes. Choose \"Fresher / Trainee\" as your designation and the tier that matches the kind of company you're aiming for. You don't need any work experience, and you don't need an account.",
  },
  {
    q: "Do I need an account to book?",
    a: "No. You can book straight from this page with just your mobile number. An account is optional, and lets you track your bookings and see when your interview is scheduled.",
  },
  {
    q: "How do I get scheduled?",
    a: "After you pay, we contact you on the mobile number you gave to agree a time. Telling us when you're available in the booking form helps us do that faster.",
  },
  {
    q: "Will my interviewer know who I am?",
    a: "Interviewers don't see your email or phone number.",
  },
  {
    q: "Can I see who my interviewer is?",
    a: "You know the company tier, and the company too if you chose one. You don't see their name or contact details, and they don't see yours.",
  },
  {
    q: "How are interviewers verified?",
    a: "Interviewers submit their company, role, experience and domains. Our team reviews every profile, and only approved interviewers take interviews.",
  },
  {
    q: "What does it cost?",
    a: "The price depends on the tier you choose, and it's shown on the booking form before you pay. Signing up for an account is free.",
  },
  {
    q: "Is the payment real?",
    a: "Not on this demo build. Payments run in Razorpay test mode, so no real money is charged and no real card is needed.",
  },
  {
    q: "I have a different question.",
    a: "Send it with the form at the bottom of this page. You don't need an account, and we'll reply by email.",
  },
];

// Used until the live domain list loads from the backend (or if the backend is asleep).
export const FALLBACK_DOMAINS: Record<string, string[]> = {
  Backend: ["Java", "Spring Boot", "Node.js", "Python", "REST API", "Microservices"],
  Frontend: ["React", "Angular", "JavaScript", "TypeScript", "HTML/CSS"],
  Cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "DevOps"],
  Data: ["SQL", "PostgreSQL", "MySQL", "Data Engineering"],
  AI: ["Machine Learning", "Deep Learning", "Generative AI", "LLM"],
  Blockchain: ["Solidity", "Ethereum", "Smart Contracts", "Web3", "DeFi"],
  General: ["System Design", "Behavioral Interview", "Leadership", "Communication"],
};

export const VISITOR_TYPES = [
  { value: "fresher", label: "Fresher looking for my first job" },
  { value: "student", label: "Student" },
  { value: "professional", label: "Working professional" },
  { value: "interviewer", label: "Interviewer or hiring manager" },
  { value: "other", label: "Something else" },
];