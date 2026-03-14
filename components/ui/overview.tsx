"use client";

import { CURRENCY_LOCALE_MAP } from "@/lib/currencies";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: unknown[];
  currency?: string;
}

export const Overview: React.FC<OverviewProps> = ({ data, currency = "UGX" }) => {
    const locale = CURRENCY_LOCALE_MAP[currency] ?? "en-UG";

    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact", // ← shows 1.2M instead of 1,200,000
      maximumFractionDigits: 1, // ← keeps it clean on axis
    });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatter.format(value)} // Format Y-axis ticks as currency
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
