import { Link } from "react-router-dom";

import BookingForm from "../../components/booking/BookingForm";
import { SHOW_DEMO_NOTICE } from "./landingData";

// The landing-page booking card. Anyone can book from here, with or without an account.
export default function BookNowSection() {
  return (
    <section className="lp-section" id="book-now">
      <div className="lp-wrap lp-split">
        <div className="lp-split-head">
          <h2>Book your mock interview now. No account needed.</h2>
          <p className="lp-sub">
            Pick the kind of company you want to be interviewed by, tell us a
            little about yourself and pay securely. We'll contact you to
            schedule it.
          </p>

          <ul className="lp-contact-points">
            <li>Price depends on the company tier you choose.</li>
            <li>Only your mobile number is required, so we can reach you.</li>
            <li>
              {SHOW_DEMO_NOTICE
                ? "Payments run in Razorpay test mode on this demo, so no real money is charged."
                : "Pay online with Razorpay."}
            </li>
            <li>
              Want to track your bookings?{" "}
              <Link to="/register">Create a free account</Link>.
            </li>
          </ul>
        </div>

        <BookingForm />
      </div>
    </section>
  );
}
