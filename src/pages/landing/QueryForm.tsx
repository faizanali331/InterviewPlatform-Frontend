import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { submitQuery } from "../../api/queryApi";
import { ApiClientError } from "../../api/apiClient";
import {
  MESSAGE_MAX,
  QueryErrors,
  QueryValues,
  normalizePhone,
  validateAll,
  validateField,
} from "../../utils/queryValidation";
import { VISITOR_TYPES } from "./landingData";

const EMPTY: QueryValues = {
  name: "",
  email: "",
  phone: "",
  visitorType: "",
  message: "",
};

export default function QueryForm() {
  const [values, setValues] = useState<QueryValues>(EMPTY);
  const [errors, setErrors] = useState<QueryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });

  const update =
    (field: keyof QueryValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Clear a field's error as soon as the person starts fixing it.
      if (errors[field])
        setErrors((prev) => ({ ...prev, [field]: validateField(field, next) }));
    };

  const checkOnBlur = (field: keyof QueryValues) => () => {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const found = validateAll(values);
    setErrors(found);

    const firstInvalid = (["name", "email", "phone", "message"] as const).find(
      (f) => found[f],
    );
    if (firstInvalid) {
      document.getElementById(`q-${firstInvalid}`)?.focus();
      return;
    }

    // Bots fill hidden fields; people never see this one. Pretend it worked.
    if (honeypot) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await submitQuery({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: normalizePhone(values.phone),
        visitorType: values.visitorType || undefined,
        message: values.message.trim(),
      });
      setSentTo({
        name: values.name.trim().split(" ")[0],
        email: values.email.trim(),
      });
      setValues(EMPTY);
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiClientError && err.fieldErrors) {
        setErrors(err.fieldErrors as QueryErrors);
      }
      setServerError(
        "We couldn't send your question just now. Please try again in a minute.",
      );
    }
  };

  if (status === "sent") {
    return (
      <div className="lp-form lp-sent" role="status">
        <div className="lp-sent-mark">
          <CheckCircle2 size={26} aria-hidden="true" />
        </div>
        <h3>
          Thanks{sentTo.name ? `, ${sentTo.name}` : ""}. We have your question.
        </h3>
        <p>
          {sentTo.email
            ? `We'll reply to ${sentTo.email}.`
            : "We'll reply by email."}
        </p>
        <button className="secondary" onClick={() => setStatus("idle")}>
          Ask something else
        </button>
      </div>
    );
  }

  const describe = (field: keyof QueryValues, helpId?: string) =>
    errors[field] ? `q-${field}-err` : helpId;

  return (
    <form className="lp-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="error" role="alert">
          {serverError}
        </div>
      )}

      <div className="lp-field">
        <label htmlFor="q-name">Your name</label>
        <input
          id="q-name"
          autoComplete="name"
          value={values.name}
          onChange={update("name")}
          onBlur={checkOnBlur("name")}
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
        />
        {errors.name && (
          <p className="lp-err" id="q-name-err">
            {errors.name}
          </p>
        )}
      </div>

      <div className="lp-field">
        <label htmlFor="q-email">Email</label>
        <input
          id="q-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update("email")}
          onBlur={checkOnBlur("email")}
          aria-invalid={!!errors.email}
          aria-describedby={describe("email")}
        />
        {errors.email && (
          <p className="lp-err" id="q-email-err">
            {errors.email}
          </p>
        )}
      </div>

      <div className="lp-field">
        <label htmlFor="q-phone">Phone number</label>
        <input
          id="q-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={values.phone}
          onChange={update("phone")}
          onBlur={checkOnBlur("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby={describe("phone", "q-phone-help")}
        />
        {errors.phone ? (
          <p className="lp-err" id="q-phone-err">
            {errors.phone}
          </p>
        ) : (
          <p className="lp-help" id="q-phone-help">
            Your 10-digit mobile number. Add the country code if you're outside
            India.
          </p>
        )}
      </div>

      <div className="lp-field">
        <label htmlFor="q-visitorType">
          I am a <span>(optional)</span>
        </label>
        <select
          id="q-visitorType"
          value={values.visitorType}
          onChange={update("visitorType")}
        >
          <option value="">Choose one</option>
          {VISITOR_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="lp-field">
        <label htmlFor="q-message">Your question</label>
        <textarea
          id="q-message"
          rows={5}
          value={values.message}
          onChange={update("message")}
          onBlur={checkOnBlur("message")}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message")}
        />
        {errors.message && (
          <p className="lp-err" id="q-message-err">
            {errors.message}
          </p>
        )}
        <div className="lp-count">
          {values.message.length}/{MESSAGE_MAX}
        </div>
      </div>

      <div className="lp-hp" aria-hidden="true">
        <label htmlFor="q-website">Leave this field empty</label>
        <input
          id="q-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button
        className="primary large full"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send my question"}
      </button>
    </form>
  );
}
