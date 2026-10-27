export type QueryValues = {
  name: string;
  email: string;
  phone: string;
  visitorType: string;
  message: string;
};

export type QueryErrors = Partial<Record<keyof QueryValues, string>>;

export const MESSAGE_MAX = 1000;

/** "+91 98765-43210" -> "+919876543210" */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}

export function validateField(
  field: keyof QueryValues,
  values: QueryValues,
): string | undefined {
  const value = values[field].trim();

  switch (field) {
    case "name":
      if (value.length < 2) return "Enter your name (at least 2 characters).";
      if (value.length > 80) return "Keep your name under 80 characters.";
      return undefined;

    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Enter a valid email, like name@example.com.";
      }
      return undefined;

    case "phone":
      if (!/^\+?\d{10,15}$/.test(normalizePhone(value))) {
        return "Enter a phone number with 10 to 15 digits.";
      }
      return undefined;

    case "message":
      if (value.length < 10)
        return "Tell us a little more (at least 10 characters).";
      if (value.length > MESSAGE_MAX)
        return `Keep your question under ${MESSAGE_MAX} characters.`;
      return undefined;

    default:
      return undefined; // visitorType is optional
  }
}

export function validateAll(values: QueryValues): QueryErrors {
  const errors: QueryErrors = {};
  (["name", "email", "phone", "message"] as const).forEach((field) => {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  });
  return errors;
}
