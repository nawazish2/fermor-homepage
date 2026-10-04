const grouped = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${grouped.format(Math.abs(n))}`;
}

export function formatCompactINR(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  // Round before choosing the unit so 99,99,999 reads "₹1.00 Cr", not "₹100.00 L".
  const lakh = Math.round((abs / 1e5) * 100) / 100;
  if (lakh >= 100) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (lakh >= 1) return `${sign}₹${lakh.toFixed(2)} L`;
  return formatINR(n);
}

/** Short label for chart axes, e.g. "5.8 L", "23 L", "234 Cr". */
export function formatAxisINR(n: number): string {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  const lakh = Math.round((abs / 1e5) * 10) / 10;
  if (lakh >= 100) {
    const cr = abs / 1e7;
    return `${cr >= 10 ? Math.round(cr) : cr.toFixed(1)} Cr`;
  }
  if (lakh >= 1) return `${lakh >= 10 ? Math.round(lakh) : lakh.toFixed(1)} L`;
  return grouped.format(abs);
}
