// All landing-page copy lives here, so wording can change without touching layout.

// Shows the thin "demo build" bar at the top. Set to false when real payments go live.
export const SHOW_DEMO_NOTICE = true;

export const NAV_LINKS = [
  { href: "#why", label: "Why practice" },
  { href: "#what-you-get", label: "What you get" },
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
export const FEATURES: {
  title: string;
  body: string;
  status: "live" | "soon";
}[] = [
  {
    title: "Interviewers from real companies",
    body: "Every interviewer is reviewed by our team before they can take a single interview. You see their company, role and experience. You never see their name.",
    status: "live",
  },
  {
    title: "Always a level above you",
    body: "Tell us your current level and we only show interviewers who are more senior. A fresher is never matched with another fresher.",
    status: "live",
  },
  {
    title: "Book and pay in one place",
    body: "Pick a time slot from the interviewer's open calendar, pay online, and find the booking in your dashboard.",
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
    title: "Create an account",
    body: "Sign up free and tell us your current level. Freshers are welcome.",
  },
  {
    title: "Choose an interviewer",
    body: "Filter by company and domain. Only interviewers senior to you appear.",
  },
  {
    title: "Book a slot and pay",
    body: "Pick a time from their open slots and pay online.",
  },
  {
    title: "Interview, then review",
    body: "Take the interview, read your scorecard and fix what it points to.",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "I'm a fresher. Is this for me?",
    a: "Yes. Choose the fresher or trainee level when you set up your profile, and you'll be matched with interviewers who are senior to you. You don't need any work experience to book.",
  },
  {
    q: "Will my interviewer know who I am?",
    a: "Interviewers don't see your email or phone number. They see the domain and the time slot you booked.",
  },
  {
    q: "Can I see who my interviewer is?",
    a: "You see their company, role, years of experience and the domains they cover. You don't see their name or contact details, and they don't see yours.",
  },
  {
    q: "How are interviewers verified?",
    a: "Interviewers submit their company, role, experience and domains. Our team reviews every profile, and only approved interviewers appear in search.",
  },
  {
    q: "What does it cost?",
    a: "Signing up is free. Each interview is charged when you book it, and the amount is shown before you pay.",
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
  Backend: [
    "Java",
    "Spring Boot",
    "Node.js",
    "Python",
    "REST API",
    "Microservices",
  ],
  Frontend: ["React", "Angular", "JavaScript", "TypeScript", "HTML/CSS"],
  Cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "DevOps"],
  Data: ["SQL", "PostgreSQL", "MySQL", "Data Engineering"],
  AI: ["Machine Learning", "Deep Learning", "Generative AI", "LLM"],
  Blockchain: ["Solidity", "Ethereum", "Smart Contracts", "Web3", "DeFi"],
  General: [
    "System Design",
    "Behavioral Interview",
    "Leadership",
    "Communication",
  ],
};

export const VISITOR_TYPES = [
  { value: "fresher", label: "Fresher looking for my first job" },
  { value: "student", label: "Student" },
  { value: "professional", label: "Working professional" },
  { value: "interviewer", label: "Interviewer or hiring manager" },
  { value: "other", label: "Something else" },
];
