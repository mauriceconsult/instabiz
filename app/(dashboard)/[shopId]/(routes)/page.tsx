import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Overview } from "@/components/ui/overview";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { CreditCard, Package } from "lucide-react";

interface DashboardPageProps {
  params: Promise<{ shopId: string }>;
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const { shopId } = await params;

  const [totalRevenue, salesCount, stockCount, graphRevenue, shop] =
    await Promise.all([
      getTotalRevenue(shopId),
      getSalesCount(shopId),
      getStockCount(shopId),
      getGraphRevenue(shopId),
      prisma.shop.findUnique({
        where: { id: shopId },
        select: { currency: true, country: true },
      }),
    ]);

  // Dynamic formatter based on shop currency
  const currency = shop?.currency ?? "UGX";
  const locale =
    currency === "UGX"
      ? "en-UG"
      : currency === "KES"
        ? "en-KE"
        : currency === "GBP"
          ? "en-GB"
          : "en-US";

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Shop overview and analytics" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Total Revenue
              </CardTitle>
              {/* Dynamic currency symbol in icon area */}
              <span className="text-xs font-bold text-muted-foreground">
                {currency}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Products In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-medium text-sm">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} currency={currency} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
