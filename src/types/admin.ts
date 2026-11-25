export interface DomainRevenue {
  domainName: string;
  amount: number;
}

export interface AdminStats {
  totalCandidates: number;
  totalInterviewers: number;
  verifiedInterviewers: number;
  pendingInterviewers: number;

  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingPaymentBookings: number;

  totalRevenue: number;
  revenueByDomain: DomainRevenue[];
}

export interface AdminPayment {
  id: number;
  bookingId: number;
  candidateName: string | null;
  candidateEmail: string | null;
  mobile: string;
  tier: string;
  companyName: string | null;
  domainName: string | null;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
}

export interface ContactQuery {
  id: number;
  name: string;
  email: string;
  phone: string;
  visitorType: string | null;
  message: string;
  status: "NEW" | "RESOLVED";
  createdAt: string;
}