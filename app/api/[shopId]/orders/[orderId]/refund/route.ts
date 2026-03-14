// app/api/[shopId]/orders/[orderId]/refund/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REFUND_WINDOW_HOURS = 48;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string; orderId: string }> },
) {
  const { shopId, orderId } = await params;
  const { reason, evidence, buyerPhone, buyerEmail } = await req.json();

  // Validate inputs
  if (!reason || reason.trim().length < 20) {
    return new NextResponse(
      "Please provide a detailed reason (at least 20 characters).",
      { status: 400 },
    );
  }

  if (!evidence || evidence.length === 0) {
    return new NextResponse(
      "Photographic evidence is required for refund requests.",
      { status: 400 },
    );
  }

  if (!buyerPhone) {
    return new NextResponse("Phone number is required.", { status: 400 });
  }

  // Fetch order
  const order = await prisma.order.findUnique({
    where: { id: orderId, shopId },
    include: { refundRequest: true },
  });

  if (!order) {
    return new NextResponse("Order not found.", { status: 404 });
  }

  if (!order.isPaid) {
    return new NextResponse("Refunds can only be requested for paid orders.", {
      status: 400,
    });
  }

  // Check if already requested
  if (order.refundRequest) {
    return new NextResponse("A refund request already exists for this order.", {
      status: 409,
    });
  }

  // Enforce 48-hour window
  if (!order.deliveredAt) {
    return new NextResponse(
      "Refund requests can only be submitted after delivery is confirmed.",
      { status: 400 },
    );
  }

  const hoursSinceDelivery =
    (Date.now() - order.deliveredAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceDelivery > REFUND_WINDOW_HOURS) {
    return new NextResponse(
      `The 48-hour refund window has expired. Delivery was confirmed ${Math.floor(hoursSinceDelivery)} hours ago.`,
      { status: 400 },
    );
  }

  const expiresAt = new Date(
    order.deliveredAt.getTime() + REFUND_WINDOW_HOURS * 60 * 60 * 1000,
  );

  // Create refund request
  const refundRequest = await prisma.refundRequest.create({
    data: {
      orderId,
      shopId,
      buyerPhone,
      buyerEmail,
      reason,
      evidence,
      status: "pending",
      expiresAt,
    },
  });

  // Notify seller (via email or SMS — stub for now)
  await notifySeller(order.shopId, orderId);

  return NextResponse.json(refundRequest);
}

async function notifySeller(shopId: string, orderId: string) {
  // TODO: integrate email/SMS notification
  console.log(
    `[REFUND] New refund request for order ${orderId} in shop ${shopId}`,
  );
}
