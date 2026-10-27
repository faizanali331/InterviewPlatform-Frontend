import { apiRequest } from "./apiClient";

export interface QueryPayload {
  name: string;
  email: string;
  phone: string;
  visitorType?: string;
  message: string;
}

// Set VITE_MOCK_QUERIES=true in .env to demo the form with no backend running.
// Mock mode does NOT save anything anywhere - leave it off for the live site.
const USE_MOCK = import.meta.env.VITE_MOCK_QUERIES === "true";

export async function submitQuery(payload: QueryPayload): Promise<{ id: number }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { id: Date.now() };
  }

  return apiRequest("/public/queries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}