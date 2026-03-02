// app/api/[shopId]/checkout/momo/status/route.ts
import { momo } from "@/lib/momo";
import { prisma } from "@/lib/prisma";
import { onPaymentConfirmed } from "@/lib/payment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const referenceId = searchParams.get("referenceId");
  const orderId = searchParams.get("orderId");

  if (!referenceId || !orderId) {
    return new NextResponse("Missing params", { status: 400 });
  }

  const status = await momo.collections.checkTransactionStatus(referenceId);

if (status.status === "SUCCESSFUL") {
  await onPaymentConfirmed(orderId); // ← no second argument for MoMo
  return NextResponse.json({ status: "SUCCESSFUL" });
}

  if (status.status === "FAILED") {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.json({ status: "FAILED" });
  }

  // Still pending
  return NextResponse.json({ status: status.status });
}
