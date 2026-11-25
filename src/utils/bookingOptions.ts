import type { BookingStatus } from "../types/booking";

// The codes must match the pattern in CreateBookingRequest.java on the backend.
export const EXPERIENCE_OPTIONS = [
  { value: "FRESHER", label: "Fresher (0 years)" },
  { value: "YEARS_1_3", label: "1 to 3 years" },
  { value: "YEARS_3_5", label: "3 to 5 years" },
  { value: "YEARS_5_8", label: "5 to 8 years" },
  { value: "YEARS_8_PLUS", label: "8+ years" },
];

export function experienceLabel(code: string | null): string {
  return EXPERIENCE_OPTIONS.find((o) => o.value === code)?.label ?? "-";
}

// Shown first in the designation dropdown. The rest come from the catalog.
export const FRESHER_DESIGNATION = "Fresher / Trainee";

/** "TIER_1" -> "Tier 1" */
export function tierLabel(tier: string): string {
  return tier.replace("TIER_", "Tier ");
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Unpaid",
  CONFIRMED: "Paid, awaiting schedule",
  SCHEDULED: "Scheduled",
  CANCELLED: "Cancelled",
};

export const STATUS_TONE: Record<BookingStatus, "warning" | "info" | "success" | "danger"> = {
  PENDING_PAYMENT: "warning",
  CONFIRMED: "info",
  SCHEDULED: "success",
  CANCELLED: "danger",
};