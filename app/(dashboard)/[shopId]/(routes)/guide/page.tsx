// instabiz/app/(dashboard)/[shopId]/(routes)/guide/page.tsx
import {
  ImageIcon,
  Tags,
  Package,
  Palette,
  Ruler,
  Settings,
  BarChart,
} from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "1. Configure Your Shop",
    description:
      "Go to Settings to set your shop name, address, currency, MoMo phone number and location coordinates. These are required for delivery quotes and mobile money payouts.",
  },
  {
    icon: ImageIcon,
    title: "2. Create a Billboard",
    description:
      "Billboards are the hero banners displayed on your storefront homepage. Upload an eye-catching image that represents your brand or current promotion.",
  },
  {
    icon: Tags,
    title: "3. Add Categories",
    description:
      "Categories organize your products and appear in the storefront navigation menu. Each category must be linked to a billboard image.",
  },
  {
    icon: Ruler,
    title: "4. Add Sizes",
    description:
      "Define the sizes available for your products e.g. S, M, L, XL or 38, 40, 42 for shoes. These are selectable filters on the storefront.",
  },
  {
    icon: Palette,
    title: "5. Add Colors",
    description:
      "Define the colors available for your products. Use hex color codes for accurate color swatches on the storefront.",
  },
  {
    icon: Package,
    title: "6. Add Products",
    description:
      "Create your products with name, price, images, category, size and color. Mark products as Featured to display them on the homepage. Archived products are hidden from the storefront.",
  },
  {
    icon: BarChart,
    title: "7. Monitor Your Dashboard",
    description:
      "The dashboard shows your total revenue, sales count and inventory levels at a glance. Orders are updated in real time as customers complete purchases.",
  },
];

const GuidePage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
          <p className="text-muted-foreground mt-2">
            Follow these steps to set up your store and start selling.
          </p>
        </div>

        <div className="grid gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex gap-4 p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-2">
            💡 Important Order
          </h3>
          <p className="text-sm text-gray-500">
            Always follow the setup order above. Categories require a Billboard,
            and Products require Categories, Sizes and Colors to exist first.
            Setting up in the wrong order will result in empty dropdowns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
