import { apiRequest } from "./apiClient";
import { AdminStats, AdminPayment, ContactQuery } from "../types/admin";

export async function getAdminStats(): Promise<AdminStats> {
  return apiRequest("/admin/stats");
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  return apiRequest("/admin/payments");
}
export async function createAdmin(data: {
  email: string; password: string; firstName: string; lastName?: string; phone?: string;
}) {
  return apiRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}



export async function getQueries(): Promise<ContactQuery[]> {
  return apiRequest("/admin/queries");
}

export async function resolveQuery(id: number): Promise<ContactQuery> {
  return apiRequest(`/admin/queries/${id}/resolve`, { method: "POST" });
}