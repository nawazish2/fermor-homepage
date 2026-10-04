import { emi } from "@/lib/finance/emi";
import { sipFutureValue } from "@/lib/finance/sip";
import { computeTax } from "@/lib/finance/tax";
import { formatCompactINR, formatINR } from "@/lib/finance/format";

export type AskEntry = {
  id: string;
  question: string;
  steps: { label: string; value: string }[];
  answer: string;
};

const loan = emi(6000000, 8.5, 20);
const sip = sipFutureValue(5000, 15, 12);
const oldTax = computeTax(1200000, "old");
const newTax = computeTax(1200000, "new");

export const askScript: AskEntry[] = [
  {
    id: "loan",
    question: "Can I afford a ₹60L home loan?",
    steps: [
      { label: "Loan", value: "₹60,00,000 at 8.5% for 20 years" },
      { label: "Monthly EMI", value: formatINR(Math.round(loan.emi)) },
      {
        label: "Total interest over 20 years",
        value: formatCompactINR(loan.totalInterest),
      },
      {
        label: "Take-home needed if EMI is 40% of it",
        value: formatINR(Math.round(loan.emi / 0.4)),
      },
    ],
    answer: `The EMI is about ${formatINR(Math.round(loan.emi))} a month. A common guideline keeps EMIs under 40% of take-home pay, so a monthly take-home above ${formatINR(Math.round(loan.emi / 0.4))} fits it.`,
  },
  {
    id: "sip",
    question: "What will ₹5,000 a month become in 15 years?",
    steps: [
      { label: "Invested", value: formatCompactINR(sip.invested) },
      { label: "Assumed return", value: "12% a year, compounded monthly" },
      { label: "Value after 15 years", value: formatCompactINR(sip.corpus) },
      { label: "Of which gains", value: formatCompactINR(sip.gains) },
    ],
    answer: `At a steady 12% a year, ${formatCompactINR(sip.invested)} invested grows to about ${formatCompactINR(sip.corpus)}. Real returns vary year to year, so treat this as an illustration.`,
  },
  {
    id: "tax",
    question: "Old or new tax regime on ₹12L salary?",
    steps: [
      { label: "Old regime taxable income", value: formatINR(oldTax.taxable) },
      { label: "Old regime tax", value: formatINR(oldTax.tax) },
      { label: "New regime taxable income", value: formatINR(newTax.taxable) },
      { label: "New regime tax", value: formatINR(newTax.tax) },
    ],
    answer: `With only the standard deduction, the new regime comes to ${formatINR(newTax.tax)} against ${formatINR(oldTax.tax)} under the old one. Deductions such as 80C or HRA can change that, so use the tax calculator below with your own numbers.`,
  },
];
