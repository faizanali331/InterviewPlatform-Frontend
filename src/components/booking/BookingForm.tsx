import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

import { getDesignations, getDomains, getTiers } from "../../api/catalogApi";
import { createBooking } from "../../api/bookingApi";
import { confirmPayment } from "../../api/paymentApi";
import { ApiClientError } from "../../api/apiClient";
import { Designation, Domain, TierOption } from "../../types/catalog";
import { PaymentResponse } from "../../types/payment";
import {
  EXPERIENCE_OPTIONS,
  FRESHER_DESIGNATION,
} from "../../utils/bookingOptions";
import { normalizePhone } from "../../utils/queryValidation";
import { formatRupees } from "../../utils/format";

type Step = "form" | "paying" | "done";

type Values = {
  tier: string;
  companyId: string;
  mobile: string;
  name: string;
  email: string;
  domainId: string;
  designation: string;
  experience: string;
  availability: string;
};

type Errors = Partial<Record<"tier" | "mobile" | "name" | "email", string>>;

const EMPTY: Values = {
  tier: "",
  companyId: "",
  mobile: "",
  name: "",
  email: "",
  domainId: "",
  designation: "",
  experience: "",
  availability: "",
};

// Only the tier (it sets the price) and the mobile number are mandatory.
function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.tier) {
    errors.tier = "Choose a company tier.";
  }
  if (!/^\+?\d{10,15}$/.test(normalizePhone(values.mobile.trim()))) {
    errors.mobile = "Enter a mobile number with 10 to 15 digits.";
  }
  if (
    values.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
  ) {
    errors.email = "Enter a valid email, like name@example.com.";
  }
  if (values.name.trim().length > 80) {
    errors.name = "Keep your name under 80 characters.";
  }

  return errors;
}

type BookingFormProps = {
  defaultEmail?: string; // pre-filled for logged-in candidates
  afterPaid?: ReactNode; // extra buttons on the success message
};

/**
 * The one booking form. It is used on the landing page (no account needed) and inside the
 * candidate area. There are no time slots and no interviewer check: the booking is paid for,
 * then our team contacts the candidate to schedule it.
 */
export default function BookingForm({
  defaultEmail,
  afterPaid,
}: BookingFormProps) {
  const initial: Values = { ...EMPTY, email: defaultEmail ?? "" };

  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState<Step>("form");
  const [message, setMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const [tiers, setTiers] = useState<TierOption[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  // After a dismissed payment window, submitting the same details re-opens the same order
  // instead of creating a second unpaid booking.
  const [pending, setPending] = useState<{
    order: PaymentResponse;
    signature: string;
  } | null>(null);
  const [done, setDone] = useState<{
    bookingId: number;
    name: string;
    mobile: string;
  } | null>(null);

  // Set as soon as Razorpay reports a payment, so closing the window afterwards
  // is never mistaken for "the customer gave up".
  const paymentReported = useRef(false);

  const loadOptions = () => {
    setLoadFailed(false);
    getTiers()
      .then(setTiers)
      .catch(() => setLoadFailed(true));
    getDomains()
      .then(setDomains)
      .catch(() => {});
    getDesignations()
      .then(setDesignations)
      .catch(() => {});
  };

  useEffect(loadOptions, []);

  const selectedTier = tiers?.find((t) => t.tier === values.tier);

  const domainGroups = domains.reduce<Record<string, Domain[]>>(
    (groups, domain) => {
      (groups[domain.category] ??= []).push(domain);
      return groups;
    },
    {},
  );

  // The candidate's own current designation: generic titles only (no company-specific ones).
  const designationTitles = [
    FRESHER_DESIGNATION,
    ...Array.from(
      new Set(
        designations.filter((d) => d.companyId === null).map((d) => d.title),
      ),
    ),
  ];

  const update =
    (field: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (field in errors)
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const chooseTier = (tier: string) => {
    setValues((prev) => ({ ...prev, tier, companyId: "" }));
    setErrors((prev) => ({ ...prev, tier: undefined }));
  };

  const openCheckout = (order: PaymentResponse) => {
    const mobile = normalizePhone(values.mobile.trim());
    const firstName = values.name.trim().split(" ")[0];
    paymentReported.current = false;

    const checkout = new window.Razorpay({
      key: order.razorpayKeyId,
      amount: order.amountInPaise,
      currency: "INR",
      order_id: order.gatewayOrderId,
      name: "InterviewPro",
      description: "Mock interview",
      prefill: {
        name: values.name.trim() || undefined,
        email: values.email.trim() || undefined,
        contact: mobile,
      },
      handler: async (response) => {
        paymentReported.current = true;
        try {
          const result = await confirmPayment({
            gatewayOrderId: response.razorpay_order_id,
            gatewayPaymentId: response.razorpay_payment_id,
            gatewaySignature: response.razorpay_signature,
          });

          if (result.status === "SUCCESS") {
            setDone({ bookingId: order.bookingId, name: firstName, mobile });
            setPending(null);
            setValues(initial);
            setStep("done");
          } else {
            setStep("form");
            setMessage(
              "We could not verify the payment. If money was deducted, please contact us with your mobile number.",
            );
          }
        } catch (err) {
          setStep("form");
          setMessage(
            err instanceof ApiClientError
              ? err.message
              : "We could not confirm your payment. If money was deducted, please contact us with your mobile number.",
          );
        }
      },
      modal: {
        ondismiss: () => {
          if (paymentReported.current) return;
          setStep("form");
          setMessage(
            "Payment was not completed. Your details are still here, so you can try again.",
          );
        },
      },
      theme: { color: "#0e6b57" },
    });

    checkout.open();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = (["tier", "mobile", "email", "name"] as const).find(
      (f) => found[f],
    );
    if (firstInvalid) {
      document.getElementById(`b-${firstInvalid}`)?.focus();
      return;
    }

    if (honeypot) return; // a bot filled the hidden field

    if (typeof window.Razorpay === "undefined") {
      setMessage(
        "The payment window could not load. Turn off any ad blocker for this site and try again.",
      );
      return;
    }

    const signature = JSON.stringify(values);
    if (pending && pending.signature === signature) {
      setStep("paying");
      openCheckout(pending.order);
      return;
    }

    setStep("paying");

    try {
      const order = await createBooking({
        mobile: normalizePhone(values.mobile.trim()),
        tier: values.tier,
        companyId: values.companyId ? Number(values.companyId) : undefined,
        domainId: values.domainId ? Number(values.domainId) : undefined,
        name: values.name.trim() || undefined,
        email: values.email.trim() || undefined,
        designation: values.designation || undefined,
        experience: values.experience || undefined,
        availability: values.availability.trim() || undefined,
      });
      setPending({ order, signature });
      openCheckout(order);
    } catch (err) {
      setStep("form");
      if (err instanceof ApiClientError && err.fieldErrors) {
        setErrors(err.fieldErrors as Errors);
        setMessage("Please check the highlighted fields.");
      } else {
        setMessage(
          "We couldn't start the payment just now. Please try again in a minute.",
        );
      }
    }
  };

  const reset = () => {
    setDone(null);
    setMessage(null);
    setErrors({});
    setStep("form");
  };

  if (step === "done" && done) {
    return (
      <div className="lp-form lp-sent" role="status">
        <div className="lp-sent-mark">
          <CheckCircle2 size={26} aria-hidden="true" />
        </div>
        <h3>
          Payment received{done.name ? `, ${done.name}` : ""}. Your interview is
          booked.
        </h3>
        <p>
          Your reference is <b>BK-{done.bookingId}</b>. We'll contact you on{" "}
          {done.mobile} to schedule it, so please keep your phone reachable
          around the times you told us you're available.
        </p>
        <div className="lp-sent-actions">
          {afterPaid}
          <button className="secondary" onClick={reset}>
            Book another interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-form" onSubmit={handleSubmit} noValidate>
      {message && (
        <div className="error" role="alert">
          {message}
        </div>
      )}

      {/* ---------- 1. company tier ---------- */}
      <fieldset className="tierpick">
        <legend>
          Which kind of company should your interviewer come from?
        </legend>

        {tiers === null && !loadFailed && (
          <p className="lp-help">Loading tiers and prices...</p>
        )}

        {loadFailed && (
          <div className="error" role="alert">
            We couldn't load the tiers just now.{" "}
            <button type="button" className="text" onClick={loadOptions}>
              Try again
            </button>
          </div>
        )}

        {tiers?.map((tier, index) => (
          <label
            key={tier.tier}
            className={
              values.tier === tier.tier ? "tieropt selected" : "tieropt"
            }
          >
            <span className="tieropt-head">
              <input
                id={index === 0 ? "b-tier" : undefined}
                type="radio"
                name="tier"
                value={tier.tier}
                checked={values.tier === tier.tier}
                onChange={() => chooseTier(tier.tier)}
              />
              <b>{tier.label}</b>
              <span className="tieropt-price">{formatRupees(tier.price)}</span>
            </span>
            <span className="tieropt-desc">{tier.description}</span>
            <span className="tieropt-companies">
              {tier.companies.length === 0
                ? "More companies are being added"
                : tier.companies
                    .slice(0, 5)
                    .map((c) => c.name)
                    .join(", ") +
                  (tier.companies.length > 5
                    ? ` and ${tier.companies.length - 5} more`
                    : "")}
            </span>
          </label>
        ))}

        {errors.tier && <p className="lp-err">{errors.tier}</p>}
      </fieldset>

      {selectedTier && selectedTier.companies.length > 0 && (
        <div className="lp-field">
          <label htmlFor="b-companyId">
            Preferred company <span>(optional)</span>
          </label>
          <select
            id="b-companyId"
            value={values.companyId}
            onChange={update("companyId")}
          >
            <option value="">No preference</option>
            {selectedTier.companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ---------- 2. contact ---------- */}
      <div className="lp-field">
        <label htmlFor="b-mobile">Mobile number</label>
        <input
          id="b-mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={values.mobile}
          onChange={update("mobile")}
          aria-invalid={!!errors.mobile}
          aria-describedby={errors.mobile ? "b-mobile-err" : "b-mobile-help"}
        />
        {errors.mobile ? (
          <p className="lp-err" id="b-mobile-err">
            {errors.mobile}
          </p>
        ) : (
          <p className="lp-help" id="b-mobile-help">
            We'll call or message you here to schedule. Add the country code if
            you're outside India.
          </p>
        )}
      </div>

      <div className="lp-fieldrow">
        <div className="lp-field">
          <label htmlFor="b-name">
            Name <span>(optional)</span>
          </label>
          <input
            id="b-name"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="lp-err">{errors.name}</p>}
        </div>

        <div className="lp-field">
          <label htmlFor="b-email">
            Email <span>(optional)</span>
          </label>
          <input
            id="b-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="lp-err">{errors.email}</p>}
        </div>
      </div>

      {/* ---------- 3. about the candidate ---------- */}
      <div className="lp-fieldrow">
        <div className="lp-field">
          <label htmlFor="b-domainId">
            Domain <span>(optional)</span>
          </label>
          <select
            id="b-domainId"
            value={values.domainId}
            onChange={update("domainId")}
          >
            <option value="">Choose a domain</option>
            {Object.entries(domainGroups).map(([category, list]) => (
              <optgroup key={category} label={category}>
                {list.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="lp-field">
          <label htmlFor="b-designation">
            Your designation <span>(optional)</span>
          </label>
          <select
            id="b-designation"
            value={values.designation}
            onChange={update("designation")}
          >
            <option value="">Choose one</option>
            {designationTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lp-fieldrow">
        <div className="lp-field">
          <label htmlFor="b-experience">
            Experience <span>(optional)</span>
          </label>
          <select
            id="b-experience"
            value={values.experience}
            onChange={update("experience")}
          >
            <option value="">Choose one</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lp-field">
          <label htmlFor="b-availability">
            When are you available? <span>(optional)</span>
          </label>
          <input
            id="b-availability"
            placeholder="e.g. weekdays after 7 pm"
            maxLength={200}
            value={values.availability}
            onChange={update("availability")}
          />
        </div>
      </div>

      <div className="lp-hp" aria-hidden="true">
        <label htmlFor="b-website">Leave this field empty</label>
        <input
          id="b-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button
        className="primary large full"
        type="submit"
        disabled={step === "paying" || tiers === null}
      >
        {step === "paying"
          ? "Preparing payment..."
          : selectedTier
            ? `Pay ${formatRupees(selectedTier.price)} and book`
            : "Choose a tier to continue"}
      </button>
    </form>
  );
}
