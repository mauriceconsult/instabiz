import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) => {
  const categories = await prisma.category.findMany({
    where: {
      shopId: (await params).shopId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
