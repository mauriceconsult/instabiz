// app/api/[shopId]/delivery/quote/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDeliveryQuote } from "@/lib/delivery-provider";
import { geocodeAddress } from "@/lib/geo-code";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params;
  const { deliveryAddress, deliveryMethod } = await req.json();

  if (!deliveryAddress) {
    return new NextResponse("Delivery address is required", { status: 400 });
  }

  // Pickup is free — no need to call any provider
  if (deliveryMethod === "pickup") {
    return NextResponse.json({
      cost: 0,
      estimatedMinutes: 0,
      currency: "UGX",
      quoteId: null,
      provider: "pickup",
    });
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop?.latitude || !shop?.longitude || !shop?.address) {
    return new NextResponse(
      "Shop location not configured. Please update settings.",
      { status: 400 },
    );
  }

  try {
    const geo = await geocodeAddress(deliveryAddress);

    const quote = await getDeliveryQuote({
      pickupAddress: shop.address,
      pickupLat: shop.latitude,
      pickupLng: shop.longitude,
      dropoffAddress: deliveryAddress,
      dropoffLat: geo.lat,
      dropoffLng: geo.lng,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("[DELIVERY_QUOTE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Could not fetch delivery quote",
      { status: 500 },
    );
  }
}
