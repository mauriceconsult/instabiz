// app/api/[shopId]/delivery/quote/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params;
  const { deliveryAddress, deliveryMethod } = await req.json();

  if (!deliveryAddress) {
    return new NextResponse("Delivery address is required", { status: 400 });
  }

  // Get shop location
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop?.latitude || !shop?.longitude) {
    return new NextResponse("Shop location not configured", { status: 400 });
  }

  try {
    let quote;

    if (deliveryMethod === "uber_direct") {
      quote = await getUberDirectQuote({
        shopAddress: shop.address ?? "",
        shopLat: shop.latitude,
        shopLng: shop.longitude,
        deliveryAddress,
      });
    } else if (deliveryMethod === "standard") {
      // Flat rate or your own calculation
      quote = { cost: 5000, estimatedMinutes: 120, currency: "UGX" };
    } else {
      quote = { cost: 0, estimatedMinutes: 0, currency: "UGX" };
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("[DELIVERY_QUOTE]", error);
    return new NextResponse("Could not fetch delivery quote", { status: 500 });
  }
}

async function getUberDirectQuote({
  shopAddress,
  shopLat,
  shopLng,
  deliveryAddress,
}: {
  shopAddress: string;
  shopLat: number;
  shopLng: number;
  deliveryAddress: string;
}) {
  // 1. Geocode customer address to coordinates
  const geo = await geocodeAddress(deliveryAddress);

  // 2. Call Uber Direct quote endpoint
  const response = await axios.post(
    "https://api.uber.com/v1/customers/{customer_id}/delivery_quotes",
    {
      pickup_address: shopAddress,
      pickup_latitude: shopLat,
      pickup_longitude: shopLng,
      dropoff_address: deliveryAddress,
      dropoff_latitude: geo.lat,
      dropoff_longitude: geo.lng,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.UBER_DIRECT_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    cost: response.data.fee, // in smallest currency unit
    estimatedMinutes: response.data.duration,
    currency: response.data.currency,
    quoteId: response.data.id, // store this — needed when creating delivery
  };
}

// Geocode using Google Maps or similar
async function geocodeAddress(address: string) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json`,
    {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  );
  const location = response.data.results[0]?.geometry?.location;
  return { lat: location.lat, lng: location.lng };
}
