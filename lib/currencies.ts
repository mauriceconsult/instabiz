// lib/currencies.ts
export const SUPPORTED_CURRENCIES = {
  UGX: {
    code: "UGX",
    symbol: "UGX",
    locale: "en-UG",
    momoSupported: true,
    stripeSupported: false,
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    locale: "en-KE",
    momoSupported: true,
    stripeSupported: true,
  },
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    momoSupported: false,
    stripeSupported: true,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
    momoSupported: false,
    stripeSupported: true,
  },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// Map shop country to currency
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  UG: "UGX",
  KE: "KES",
  US: "USD",
  GB: "GBP",
};

export const getCurrencyForShop = (country: string): CurrencyCode => {
  return COUNTRY_CURRENCY_MAP[country] ?? "USD";
};
