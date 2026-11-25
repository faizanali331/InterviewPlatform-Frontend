

import { apiRequest } from "./apiClient";
import { Booking, CreateBookingPayload } from "../types/booking";
import { PaymentResponse } from "../types/payment";

// Works with or without a login. A logged-in candidate's booking is linked to their account.
// The reply is the payment order, so the caller can open Razorpay straight away.
export async function createBooking(data: CreateBookingPayload): Promise<PaymentResponse> {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyBookingsAsCandidate(): Promise<Booking[]> {
  return apiRequest("/bookings/me");
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  return apiRequest(`/bookings/${bookingId}/cancel`, { method: "POST" });
}

// ---- admin ----

export async function getAdminBookings(): Promise<Booking[]> {
  return apiRequest("/admin/bookings");
}

export async function scheduleBooking(bookingId: number, note: string): Promise<Booking> {
  return apiRequest(`/admin/bookings/${bookingId}/schedule`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}