// lib/payment.ts
import { prisma } from "./prisma";
import Stripe from "stripe";
import axios from "axios";

export async function onPaymentConfirmed(
  orderId: string,
  session?: Stripe.Checkout.Session, 
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

  const order = (await prisma.order.update({
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
  })) as unknown as {
    id: string;
    deliveryMethod: string | null;
    deliveryQuoteId: string | null;
    address: string;
    phone: string;
    orderItems: { id: string; productId: string; orderId: string }[];
  };

  const productIds = order.orderItems.map((item) => item.productId);
  await prisma.product.updateMany({
    where: { id: { in: productIds } },
    data: { isArchived: true },
  });

  if (order.address) {
    await dispatchDelivery(order, process.env.SHOP_ADDRESS || "");
  }

  return order;
}

// In onPaymentConfirmed → dispatchDelivery
async function dispatchDelivery(
  order: {
    id: string;
    deliveryMethod: string | null;
    deliveryQuoteId: string | null; // ← add to Order model
    address: string;
    phone: string;
  },
  shopAddress: string,
) {
  if (order.deliveryMethod === "uber_direct" && order.deliveryQuoteId) {
    const delivery = await axios.post(
      "https://api.uber.com/v1/customers/{customer_id}/deliveries",
      {
        quote_id: order.deliveryQuoteId, // locks in the quoted price
        pickup_address: shopAddress,
        dropoff_address: order.address,
        dropoff_phone_number: order.phone,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.UBER_DIRECT_TOKEN}`,
        },
      },
    );

    await prisma.order.update({
      where: { id: order.id },
      data: {
        deliveryRef: delivery.data.id,
        deliveryStatus: "dispatched",
      },
    });
  }
}
