import { prisma } from "@/lib/prisma";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
    params: Promise<{ productId: string; shopId: string; }>;
}) => {
  const product = await prisma.product.findUnique({
    where: { id: (await params).productId },
    include: { images: true },
  });

  // ✅ Convert Decimal to number before passing to client
  const serializedProduct = product
    ? {
        ...product,
        price: product.price.toNumber(),
      }
    : null;
  const categories = await prisma.category.findMany({
    where: {
      shopId: (await params).shopId,
    },
  });
   const sizes = await prisma.size.findMany({
     where: {
       shopId: (await params).shopId,
     },
   });
   const colors = await prisma.color.findMany({
     where: {
       shopId: (await params).shopId,
     },
   });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={serializedProduct}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
