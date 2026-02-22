import { prisma } from "@/lib/prisma";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";
import { SizeClient } from "./components/client";

const SizesPage = async ({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) => {
  const sizes = await prisma.size.findMany({
    where: {
      shopId: (await params).shopId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
