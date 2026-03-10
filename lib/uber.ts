// lib/uber.ts
import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const getUberToken = async (): Promise<string> => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://auth.uber.com/oauth/v2/token",
    new URLSearchParams({
      client_id: process.env.UBER_CLIENT_ID!,
      client_secret: process.env.UBER_CLIENT_SECRET!,
      grant_type: "client_credentials",
      scope: "eats.deliveries",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  cachedToken = response.data.access_token;
  // Cache token with 1 minute buffer before expiry
  tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;

  return cachedToken!;
};

interface QuoteParams {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
}

interface QuoteResult {
  cost: number;
  estimatedMinutes: number;
  currency: string;
  quoteId: string;
}

export const getUberDirectQuote = async (
  params: QuoteParams,
): Promise<QuoteResult> => {
  const token = await getUberToken();

  const response = await axios.post(
    `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/delivery_quotes`,
    {
      pickup_address: params.pickupAddress,
      pickup_latitude: params.pickupLat,
      pickup_longitude: params.pickupLng,
      dropoff_address: params.dropoffAddress,
      dropoff_latitude: params.dropoffLat,
      dropoff_longitude: params.dropoffLng,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    cost: response.data.fee / 100, // convert from cents
    estimatedMinutes: response.data.duration,
    currency: response.data.currency,
    quoteId: response.data.id,
  };
};

interface DispatchParams {
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

export const createUberDelivery = async (
  params: DispatchParams,
): Promise<{ deliveryId: string; trackingUrl: string }> => {
  const token = await getUberToken();

  const response = await axios.post(
    `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries`,
    {
      quote_id: params.quoteId,
      pickup: {
        name: params.pickupName,
        address: params.pickupAddress,
        latitude: params.pickupLat,
        longitude: params.pickupLng,
        phone_number: params.pickupPhone,
      },
      dropoff: {
        name: params.dropoffName,
        address: params.dropoffAddress,
        latitude: params.dropoffLat,
        longitude: params.dropoffLng,
        phone_number: params.dropoffPhone,
      },
      external_id: params.orderId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    deliveryId: response.data.id,
    trackingUrl: response.data.tracking_url,
  };
};
