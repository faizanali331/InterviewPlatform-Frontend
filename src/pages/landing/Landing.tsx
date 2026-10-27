// import {
//   ArrowRight,
//   CheckCircle2,
//   ShieldCheck,
//   Users,
//   Video,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Logo from "../../components/common/Logo";

// export default function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className="landing">
//       {/* Header */}
//       <header className="landing-header">
//         <Logo />

//         <div className="landing-actions">
//           <button className="secondary" onClick={() => navigate("/login")}>
//             Sign in
//           </button>

//           <button className="primary" onClick={() => navigate("/register")}>
//             Get started
//             <ArrowRight size={15} />
//           </button>
//         </div>
//       </header>

//       {/* Hero */}
//       <main className="landing-main">
//         <section className="hero">
//           <div className="hero-content">
//             <div className="eyebrow">
//               <ShieldCheck size={15} />
//               Verified industry professionals
//             </div>

//             <h1>
//               Practice interviews
//               <br />
//               with people who
//               <br />
//               <span>actually hire.</span>
//             </h1>

//             <p>
//               InterviewPro connects candidates with verified industry
//               professionals for realistic, structured mock interviews.
//             </p>

//             <div className="hero-buttons">
//               <button
//                 className="primary large"
//                 onClick={() => navigate("/register")}
//               >
//                 Start practicing
//                 <ArrowRight size={17} />
//               </button>

//               <button
//                 className="secondary large"
//                 onClick={() => navigate("/login")}
//               >
//                 Sign in
//               </button>
//             </div>

//             <div className="hero-trust">
//               <span>
//                 <CheckCircle2 size={15} />
//                 Verified interviewers
//               </span>

//               <span>
//                 <CheckCircle2 size={15} />
//                 Real interview experience
//               </span>

//               <span>
//                 <CheckCircle2 size={15} />
//                 Structured feedback
//               </span>
//             </div>
//           </div>

//           {/* Hero visual */}
//           <div className="hero-card">
//             <div className="hero-card-header">
//               <div>
//                 <span>Next generation interview prep</span>
//                 <h3>Real people. Real interviews.</h3>
//               </div>

//               <div className="hero-icon">
//                 <Video size={22} />
//               </div>
//             </div>

//             <div className="hero-stats">
//               <div>
//                 <Users size={18} />
//                 <strong>500+</strong>
//                 <span>Verified professionals</span>
//               </div>

//               <div>
//                 <Video size={18} />
//                 <strong>2,000+</strong>
//                 <span>Mock interviews</span>
//               </div>
//             </div>

//             <div className="interview-preview">
//               <div className="preview-dot" />

//               <div>
//                 <strong>Senior Software Engineer</strong>
//                 <span>Java · Spring Boot · System Design</span>
//               </div>

//               <span className="preview-badge">Verified</span>
//             </div>
//           </div>
//         </section>

//         {/* Features */}
//         <section className="landing-features">
//           <div>
//             <ShieldCheck size={20} />
//             <h3>Verified professionals</h3>
//             <p>
//               Interview with professionals whose industry experience has been
//               verified.
//             </p>
//           </div>

//           <div>
//             <Video size={20} />
//             <h3>Real interview environment</h3>
//             <p>Conduct your mock interview directly inside InterviewPro.</p>
//           </div>

//           <div>
//             <CheckCircle2 size={20} />
//             <h3>Actionable feedback</h3>
//             <p>
//               Get structured feedback on technical skills, communication, and
//               problem solving.
//             </p>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="landing-footer">
//         <Logo />

//         <span>
//           © {new Date().getFullYear()} InterviewPro. All rights reserved.
//         </span>
//       </footer>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../components/common/Logo";
import { getDomains } from "../../api/catalogApi";

import SignupMenu from "./SignupMenu";
import Scorecard from "./Scorecard";
import QueryForm from "./QueryForm";
import {
  FALLBACK_DOMAINS,
  FAQ,
  FEATURES,
  NAV_LINKS,
  SHOW_DEMO_NOTICE,
  STEPS,
  WHY_ROWS,
} from "./landingData";

// Shows the built-in list immediately, then swaps in the live catalog from the
// backend if it answers. The page never waits on (or breaks without) the API.
function useDomainGroups() {
  const [groups, setGroups] =
    useState<Record<string, string[]>>(FALLBACK_DOMAINS);

  useEffect(() => {
    let cancelled = false;

    getDomains()
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        const next: Record<string, string[]> = {};
        for (const domain of list) {
          if (!next[domain.category]) next[domain.category] = [];
          next[domain.category].push(domain.name);
        }
        setGroups(next);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return groups;
}

export default function Landing() {
  const domainGroups = useDomainGroups();

  return (
    <div className="lp">
      {SHOW_DEMO_NOTICE && (
        <div className="lp-demo-bar">
          <strong>Demo build.</strong> Payments run in Razorpay test mode, so no
          real money is charged.
        </div>
      )}

      <header className="lp-header">
        <div className="lp-wrap">
          <Logo variant="dark" />

          <nav className="lp-nav" aria-label="Page sections">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="lp-actions">
            <Link to="/login" className="secondary">
              Log in
            </Link>
            <SignupMenu />
          </div>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section className="lp-hero">
          <div className="lp-wrap">
            <div>
              <h1>Your first interview shouldn't be the real one.</h1>
              <p className="lp-lede">
                Book an hour with a verified engineer from a real company. You
                get a realistic interview, and a written scorecard that shows
                exactly what to fix before it counts.
              </p>

              <div className="lp-cta">
                <Link to="/register" className="primary large">
                  Book a mock interview
                </Link>
                <a href="#how-it-works" className="secondary large">
                  See how it works
                </a>
              </div>

              <p className="lp-fine">
                Free to sign up. You pay only when you book an interview.
              </p>
            </div>

            <Scorecard />
          </div>
        </section>

        {/* ---------- why practice ---------- */}
        <section className="lp-section alt" id="why">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>
                Knowing the answer and saying it under pressure are different
                skills.
              </h2>
              <p className="lp-sub">
                Reading your notes feels like progress. A mock interview shows
                you what is really there, while there is still time to change
                it.
              </p>
            </div>

            <table className="lp-compare">
              <thead>
                <tr>
                  <th scope="col">Preparing alone</th>
                  <th scope="col">In a mock interview</th>
                </tr>
              </thead>
              <tbody>
                {WHY_ROWS.map(([alone, mock]) => (
                  <tr key={alone}>
                    <td>{alone}</td>
                    <td>{mock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- what you get ---------- */}
        <section className="lp-section" id="what-you-get">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>What you get when you book.</h2>
              <p className="lp-sub">
                A real interviewer, matched to your level, and a clear record of
                how it went.
              </p>
            </div>

            <ul className="lp-features">
              {FEATURES.map((feature) => (
                <li key={feature.title}>
                  <h3>
                    {feature.title}
                    {feature.status === "soon" && (
                      <span className="lp-tag">Coming soon</span>
                    )}
                  </h3>
                  <p>{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- expertise ---------- */}
        <section className="lp-section alt" id="domains">
          <div className="lp-wrap">
            <h2>Practice the stack you're applying for.</h2>
            <p className="lp-sub">
              Our interviewers cover these domains. Pick the one that matches
              the job description.
            </p>

            <div className="lp-domains">
              {Object.entries(domainGroups).map(([category, names]) => (
                <div key={category}>
                  <h3>{category}</h3>
                  <ul className="lp-chips">
                    {names.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- how it works ---------- */}
        <section className="lp-section" id="how-it-works">
          <div className="lp-wrap">
            <h2>From sign-up to scorecard in four steps.</h2>

            <ol className="lp-steps">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- for interviewers ---------- */}
        <section className="lp-band" id="interviewers">
          <div className="lp-wrap">
            <div>
              <h2>
                Work at a company that hires? Interview on your own schedule.
              </h2>
              <p>
                Apply with your professional details. Once our team has reviewed
                your profile, you open the time slots you want and candidates
                book them. Candidates never see your name or contact details.
              </p>
            </div>

            <div className="lp-cta">
              <Link to="/register/interviewer" className="primary large">
                Apply as an interviewer
              </Link>
              <Link to="/login" className="secondary large">
                Already approved? Log in
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="lp-section" id="faq">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>Questions people ask first.</h2>
              <p className="lp-sub">
                Not here? Use the form below. No account needed.
              </p>
            </div>

            <div className="lp-faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- contact ---------- */}
        <section className="lp-section alt" id="contact">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>Ask us anything before you sign up.</h2>
              <p className="lp-sub">
                Not sure where to start, or which domain to pick? Tell us where
                you are and we'll point you in the right direction.
              </p>

              <ul className="lp-contact-points">
                <li>No account needed.</li>
                <li>
                  Freshers, students and working professionals are all welcome.
                </li>
                <li>We reply by email.</li>
              </ul>
            </div>

            <QueryForm />
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <Logo variant="dark" />

          <nav className="lp-footer-links" aria-label="Footer">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up as a candidate</Link>
            <Link to="/register/interviewer">Apply as an interviewer</Link>
            <a href="#contact">Contact</a>
          </nav>

          <p className="lp-legal">
            © {new Date().getFullYear()} InterviewPro. Interviewer identities
            are kept private.
          </p>
        </div>
      </footer>
    </div>
  );
}
