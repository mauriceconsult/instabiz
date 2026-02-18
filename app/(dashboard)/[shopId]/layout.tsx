import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { shopId } = await params;

  const shop = await prisma.shop.findFirst({
    where: {
      id: shopId,
      ownerId: userId,
    },
  });
  if (!shop) {
    redirect("/");
  }
  return (
    <>
      <div>This is navbar</div>
      {children}
    </>
  );
}