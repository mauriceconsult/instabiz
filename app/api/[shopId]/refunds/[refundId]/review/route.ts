// app/api/[shopId]/refunds/[refundId]/review/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// const BUSINESS_DAYS_TO_REFUND = 7;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shopId: string; refundId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { shopId, refundId } = await params;
  const { status, adminNotes, sellerResponse } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return new NextResponse("Status must be approved or rejected.", {
      status: 400,
    });
  }

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, userId },
  });
  if (!shop) return new NextResponse("Unauthorized", { status: 403 });

  const refund = await prisma.refundRequest.update({
    where: { id: refundId, shopId },
    data: {
      status,
      adminNotes,
      sellerResponse,
      resolvedAt: new Date(),
    },
    include: { order: true },
  });

  // If approved — process refund
  if (status === "approved") {
    await processRefund(refund);
  }

  return NextResponse.json(refund);
}

async function processRefund(refund: {
  id: string;
  orderId: string;
  order: {
    paymentMethod: string;
    paymentRef: string | null;
    phone: string;
    shopId: string;
  };
}) {
  // Calculate refund deadline (7 business days)
  const refundDeadline = addBusinessDays(new Date(), 7);

  await prisma.refundRequest.update({
    where: { id: refund.id },
    data: {
      status: "refunded",
      refundedAt: new Date(),
    },
  });

  // Process via original payment method
  if (refund.order.paymentMethod === "mobile_money") {
    // MoMo refund via disbursement
    // TODO: call momo.disbursements.transfer()
    console.log(`[REFUND] MoMo refund due by ${refundDeadline}`);
  } else if (refund.order.paymentMethod === "stripe") {
    // Stripe refund
    // TODO: call stripe.refunds.create({ payment_intent: refund.order.paymentRef })
    console.log(`[REFUND] Stripe refund due by ${refundDeadline}`);
  }
}

function addBusinessDays(date: Date, days: number): Date {
  let count = 0;
  const result = new Date(date);
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) count++; // skip weekends
  }
  return result;
}
