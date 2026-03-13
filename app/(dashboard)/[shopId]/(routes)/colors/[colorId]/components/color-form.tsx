"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  value: z.string().min(4).regex(/^#/, "String must be a valid hex code"),
});

interface ColorFormProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.shopId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.shopId}/colors`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.shopId}/colors`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.shopId}/colors/${params.colorId}`);
      toast.success("Color deleted successfully");
      router.refresh();
      router.push(`/${params.shopId}/colors`);
    } catch {
      toast.error("Make sure you removed all products using this color first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            color="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-y-3">
                      {/* Visual color picker */}
                      <div className="flex items-center gap-x-4">
                        <input
                          type="color"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10 w-16 cursor-pointer rounded-md border border-gray-300 p-1"
                        />
                        <div
                          className="h-10 w-10 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: field.value || "#000000" }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {field.value || "#000000"}
                        </span>
                      </div>

                      {/* Manual hex input */}
                      <Input
                        placeholder="#000000"
                        {...field}
                        onChange={(e) => {
                          // Auto-add # if missing
                          const val = e.target.value;
                          field.onChange(val.startsWith("#") ? val : `#${val}`);
                        }}
                      />

                      {/* Common color presets */}
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Quick select:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "Black", hex: "#000000" },
                            { name: "White", hex: "#FFFFFF" },
                            { name: "Red", hex: "#EF4444" },
                            { name: "Blue", hex: "#3B82F6" },
                            { name: "Green", hex: "#22C55E" },
                            { name: "Yellow", hex: "#EAB308" },
                            { name: "Purple", hex: "#A855F7" },
                            { name: "Pink", hex: "#EC4899" },
                            { name: "Orange", hex: "#F97316" },
                            { name: "Gray", hex: "#6B7280" },
                            { name: "Brown", hex: "#92400E" },
                            { name: "Navy", hex: "#1E3A5F" },
                          ].map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              title={color.name}
                              onClick={() => field.onChange(color.hex)}
                              className="flex flex-col items-center gap-y-1 group"
                            >
                              <div
                                className={`h-7 w-7 rounded-full border-2 shadow-sm transition
                      ${
                        field.value === color.hex
                          ? "border-black scale-110"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs text-muted-foreground group-hover:text-black">
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
