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
    include: {
      orderItems: true,
      shop: true, // ← include shop to get its address
    },
  })) as unknown as {
    id: string;
    shopId: string;
    shop: {
      id: string;
      address: string | null;
      latitude: number | null;
      longitude: number | null;
    };
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

  if (order.address && order.shop.address) {
    await dispatchDelivery(order, order.shop); // ← pass shop, not env var
  }

  return order;
}

// In onPaymentConfirmed → dispatchDelivery
async function dispatchDelivery(
  order: {
    id: string;
    deliveryMethod: string | null;
    deliveryQuoteId: string | null;
    address: string;
    phone: string;
  },
  shop: {
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  },
) {
  if (order.deliveryMethod === "uber_direct" && order.deliveryQuoteId) {
    const delivery = await axios.post(
      "https://api.uber.com/v1/customers/{customer_id}/deliveries",
      {
        quote_id: order.deliveryQuoteId,
        pickup_address: shop.address, // ← from DB
        pickup_latitude: shop.latitude, // ← from DB
        pickup_longitude: shop.longitude, // ← from DB
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
