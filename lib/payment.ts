// lib/payment.ts
import { Order } from "@prisma/client";
import { prisma } from "./prisma";
import Stripe from "stripe";

export async function onPaymentConfirmed(
  orderId: string,
  session?: Stripe.Checkout.Session, // ← add this
) {
  const address = session?.customer_details?.address;
  const addressString = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paymentStatus: "completed",
      ...(addressString && { address: addressString }),
      ...(session?.customer_details?.phone && {
        phone: session.customer_details.phone,
      }),
    },
    include: { orderItems: true },
  });

  const productIds = order.orderItems.map((item) => item.productId);
  await prisma.product.updateMany({
    where: { id: { in: productIds } },
    data: { isArchived: true },
  });

  if (order.address) {
    await dispatchDelivery(order);
  }

  return order;
}

async function dispatchDelivery(order: Order) {
  // For now a stub — plug in Uber Direct or MoMo disbursement here
  await prisma.order.update({
    where: { id: order.id },
    data: { deliveryStatus: "dispatched" },
  });
}
