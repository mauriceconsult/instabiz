import { prisma } from "@/lib/prisma";
import { CategoryForm } from "./components/category-form";


const CategoryPage = async ({
  params,
}: {
    params: Promise<{ categoryId: string; shopId: string; }>;
}) => {
  const category = await prisma.category.findUnique({
    where: {
      id: (await params).categoryId,
    },
  });
  const billboards = await prisma.billboard.findMany({
    where: {
      shopId: (await params).shopId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
