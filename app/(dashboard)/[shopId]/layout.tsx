import Navbar from "@/components/navbar";
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

  // ✅ Simplified - findUnique by id, check userId
  const shop = await prisma.shop.findFirst({
    where: { id: (await params).shopId, userId },
  });

  // ✅ Check ownership using Clerk userId
  if (!shop) {
    redirect("/");
  }

  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}
