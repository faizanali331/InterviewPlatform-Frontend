const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 2499 -> "₹2,499" */
export function formatRupees(amount: number): string {
  return rupees.format(amount);
}