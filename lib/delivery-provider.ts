// lib/delivery-provider.ts
import { getUberDirectQuote, createUberDelivery } from "./uber";

export interface QuoteParams {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
}

export interface QuoteResult {
  cost: number;
  estimatedMinutes: number;
  currency: string;
  quoteId: string;
  provider: string;
}

export interface DispatchParams {
  quoteId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupName: string;
  pickupPhone: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffName: string;
  dropoffPhone: string;
  orderId: string;
}

export interface DispatchResult {
  deliveryId: string;
  trackingUrl?: string;
  provider: string;
}

export const getDeliveryQuote = async (
  params: QuoteParams,
): Promise<QuoteResult> => {
  const provider = process.env.DELIVERY_PROVIDER ?? "flat_rate";

  switch (provider) {
    case "uber_direct":
      const uberQuote = await getUberDirectQuote(params);
      return { ...uberQuote, provider: "uber_direct" };

    // Glovo, SafeBoda, Bolt — stubs for now
    case "glovo":
      throw new Error("Glovo integration coming soon");

    case "safeboda":
      throw new Error("SafeBoda integration coming soon");

    case "bolt":
      throw new Error("Bolt integration coming soon");

    default:
      // Flat rate fallback — always works
      return {
        cost: 5000,
        estimatedMinutes: 60,
        currency: "UGX",
        quoteId: `flat_${Date.now()}`,
        provider: "flat_rate",
      };
  }
};

export const dispatchDelivery = async (
  params: DispatchParams,
): Promise<DispatchResult> => {
  const provider = process.env.DELIVERY_PROVIDER ?? "flat_rate";

  switch (provider) {
    case "uber_direct":
      const result = await createUberDelivery(params);
      return { ...result, provider: "uber_direct" };

    default:
      // Flat rate — manual dispatch, just return a reference
      return {
        deliveryId: `manual_${Date.now()}`,
        provider: "flat_rate",
      };
  }
};
