import { prisma } from "@/lib/prisma";
import { ColorForm } from "./components/color-form";



const ColorPage = async ({
  params,
}: {
  params: Promise<{ colorId: string }>;
}) => {
  const color = await prisma.color.findUnique({
    where: {
      id: (await params).colorId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
