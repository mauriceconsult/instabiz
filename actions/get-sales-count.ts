import { prisma } from "@/lib/prisma";

export const getSalesCount = async (shopId: string) => {
  const salesCount = await prisma.order.count({
    where: {
      shopId,
      isPaid: true,
    },
  });

  return salesCount;
};
