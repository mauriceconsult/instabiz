import { prisma } from "@/lib/prisma";

export const getStockCount = async (shopId: string) => {
  const stockCount = await prisma.product.count({
    where: {
      shopId,
      isArchived: false,
    },
  });

  return stockCount;
};
