import { apiRequest } from "./apiClient";
import { Company, Domain, Level, Designation, TierOption } from "../types/catalog";

export async function getCompanies(): Promise<Company[]> {
  return apiRequest("/catalog/companies");
}

export async function getDomains(): Promise<Domain[]> {
  return apiRequest("/catalog/domains");
}

export async function getLevels(): Promise<Level[]> {
  return apiRequest("/catalog/levels");
}

export async function getDesignations(companyId?: number): Promise<Designation[]> {
  const query = companyId ? `?companyId=${companyId}` : "";
  return apiRequest(`/catalog/designations${query}`);
}
export async function createCompany(name: string, emailDomain?: string) {
  return apiRequest("/catalog/companies", {
    method: "POST",
    body: JSON.stringify({ name, emailDomain }),
  });
}

export async function createDomain(name: string, category: string) {
  return apiRequest("/catalog/domains", {
    method: "POST",
    body: JSON.stringify({ name, category }),
  });
}

export async function createDesignation(title: string, levelNumber: number, companyId?: number) {
  return apiRequest("/catalog/designations", {
    method: "POST",
    body: JSON.stringify({ title, levelNumber, companyId: companyId ?? null }),
  });
}
export async function getTiers(): Promise<TierOption[]> {
  return apiRequest("/catalog/tiers");
}

export async function updateCompanyTier(companyId: number, tier: string): Promise<Company> {
  return apiRequest(`/catalog/companies/${companyId}/tier`, {
    method: "PUT",
    body: JSON.stringify({ tier }),
  });
}

export async function updateTierPrice(tier: string, price: number): Promise<TierOption> {
  return apiRequest(`/admin/tier-prices/${tier}`, {
    method: "PUT",
    body: JSON.stringify({ price }),
  });
}