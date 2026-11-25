import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import {
  getCompanies,
  getTiers,
  updateCompanyTier,
  updateTierPrice,
} from "../../api/catalogApi";
import { ApiClientError } from "../../api/apiClient";
import { Company, TierOption } from "../../types/catalog";
import { formatRupees } from "../../utils/format";

const DEFAULT_TIER = "TIER_3"; // companies without a tier count as Tier 3

export default function Pricing() {
  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTiers = () =>
    getTiers()
      .then((list) => {
        setTiers(list);
        setDrafts(
          Object.fromEntries(list.map((t) => [t.tier, String(t.price)])),
        );
      })
      .catch(() => setTiers([]));

  const loadCompanies = () =>
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));

  useEffect(() => {
    loadTiers();
    loadCompanies();
  }, []);

  const savePrice = async (tier: TierOption) => {
    setMessage(null);
    setError(null);

    const price = Number(drafts[tier.tier]);
    if (!Number.isFinite(price) || price < 1) {
      setError("Enter a price of at least ₹1.");
      return;
    }

    try {
      await updateTierPrice(tier.tier, price);
      setMessage(`${tier.label} is now ${formatRupees(price)} per interview.`);
      await loadTiers();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not save the price.",
      );
    }
  };

  const changeTier = async (company: Company, tier: string) => {
    setMessage(null);
    setError(null);

    try {
      await updateCompanyTier(company.id, tier);
      setMessage(
        `${company.name} moved to ${tiers.find((t) => t.tier === tier)?.label ?? tier}.`,
      );
      await Promise.all([loadCompanies(), loadTiers()]);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not change the tier.",
      );
    }
  };

  return (
    <>
      <Header
        title="Pricing"
        sub="Set what each tier costs and which tier each company belongs to. Candidates see these tiers when they book."
      />

      {error && <div className="error">{error}</div>}
      {message && (
        <div className="notice">
          <span>{message}</span>
        </div>
      )}

      <div className="panel">
        <h2>Price by tier</h2>
        <p>
          Changes apply to new bookings. Bookings already made keep the price
          they were created with.
        </p>

        {tiers.map((tier) => (
          <div className="pricerow" key={tier.tier}>
            <div>
              <b>{tier.label}</b>
              <small>
                {tier.description} · {tier.companies.length}{" "}
                {tier.companies.length === 1 ? "company" : "companies"}
              </small>
            </div>

            <div className="controls">
              <span>₹</span>
              <input
                type="number"
                min={1}
                value={drafts[tier.tier] ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [tier.tier]: e.target.value }))
                }
                aria-label={`${tier.label} price in rupees`}
              />
              <button className="primary" onClick={() => savePrice(tier)}>
                Save
              </button>
            </div>
          </div>
        ))}

        {tiers.length === 0 && (
          <p>
            No tiers found. Restart the backend so the seeder can create them.
          </p>
        )}
      </div>

      <div className="panel table">
        <h2>Company tiers</h2>

        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>
                  <select
                    value={company.tier ?? DEFAULT_TIER}
                    onChange={(e) => changeTier(company, e.target.value)}
                    aria-label={`Tier for ${company.name}`}
                  >
                    {tiers.map((tier) => (
                      <option key={tier.tier} value={tier.tier}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={2}>No companies yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
