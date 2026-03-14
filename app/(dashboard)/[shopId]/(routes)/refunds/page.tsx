import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { RefundClient } from "./components/refund-client";

export type RefundWithOrder = Prisma.RefundRequestGetPayload<{
  include: { order: true };
}>;

interface RefundsPageProps {
  params: Promise<{ shopId: string }>;
}

const RefundsPage = async ({ params }: RefundsPageProps) => {
  const { shopId } = await params;

  const refunds = await prisma.refundRequest.findMany({
    where: { shopId },
    include: { order: true },
    orderBy: { requestedAt: "desc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RefundClient data={refunds} />
      </div>
    </div>
  );
};

export default RefundsPage;
