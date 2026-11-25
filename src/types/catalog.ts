export interface Company {
  id: number;
  name: string;
  emailDomain: string | null;
  tier: string; // TIER_1, TIER_2, TIER_3
}

export interface TierOption {
  tier: string;
  label: string;
  description: string;
  price: number;
  sortOrder: number;
  companies: { id: number; name: string }[];
}

export interface Domain {
  id: number;
  name: string;
  category: string;
}

export interface Level {
  id: number;
  levelNumber: number;
  levelName: string;
}

export interface Designation {
  id: number;
  title: string;
  companyId: number | null;
  companyName: string | null;
  levelNumber: number;
  levelName: string;
}