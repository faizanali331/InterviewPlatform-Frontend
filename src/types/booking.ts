export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "SCHEDULED" | "CANCELLED";

export interface Booking {
  id: number;
  name: string | null;
  mobile: string;
  email: string | null;
  tier: string; // TIER_1, TIER_2, TIER_3
  companyName: string | null; // preferred company, if the candidate chose one
  domainName: string | null;
  designation: string | null;
  experience: string | null;
  availability: string | null;
  amount: number;
  status: BookingStatus;
  scheduleNote: string | null; // set by the admin when the interview is scheduled
  registered: boolean; // true when booked by a logged-in candidate
  createdAt: string;
  paidAt: string | null;
}

export interface CreateBookingPayload {
  mobile: string;
  tier: string;
  companyId?: number;
  domainId?: number;
  name?: string;
  email?: string;
  designation?: string;
  experience?: string;
  availability?: string;
}