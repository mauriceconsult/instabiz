"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation"; // ← combined import
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const RefundPage = () => {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>(); // ← moved to top level

  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "your_cloudinary_preset");
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
          );
          return res.data.secure_url;
        }),
      );
      setEvidence((prev) => [...prev, ...uploads]);
      toast.success("Images uploaded successfully.");
    } catch {
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    if (reason.trim().length < 20) {
      toast.error("Please provide a more detailed reason.");
      return;
    }
    if (evidence.length === 0) {
      toast.error("Please upload at least one photo as evidence.");
      return;
    }
    if (!buyerPhone) {
      toast.error("Please enter your phone number.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        // ← orderId now available from top-level hook
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/refund`,
        { reason, evidence, buyerPhone, buyerEmail },
      );
      toast.success(
        "Refund request submitted. We will respond within 7 business days.",
      );
      router.push("/orders");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data
        : "Failed to submit refund request.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Request a Refund
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Refund requests must be submitted within 48 hours of delivery with
        photographic evidence. Approved refunds are processed within 7 business
        days.
      </p>

      <div className="space-y-6">
        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Refund <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe how the product differs from its description..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <p className="text-xs text-gray-400 mt-1">
            Minimum 20 characters. {reason.length} typed.
          </p>
        </div>

        {/* Evidence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photographic Evidence <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-3 hover:border-black transition">
            <Upload className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {uploading ? "Uploading..." : "Upload photos"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          {evidence.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {evidence.map((url, i) => (
                <div key={i} className="relative h-16 w-16 shrink-0">
                  <Image
                    fill
                    src={url}
                    alt={`Evidence ${i + 1}`}
                    sizes="64px"
                    className="object-cover rounded-md border hover:opacity-75 transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="+256700000000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Policy reminder */}
        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p>
            ⏱ Refund window: <strong>48 hours</strong> from delivery
            confirmation
          </p>
          <p>
            📸 Evidence: <strong>Required</strong> — photos of received item
          </p>
          <p>
            💳 Processing: <strong>7 business days</strong> to original payment
            method
          </p>
          <p>
            ⚖️ Disputes mediated by <strong>Maxnovate Limited</strong>
          </p>
        </div>

        <Button
          onClick={onSubmit}
          disabled={submitting || uploading}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit Refund Request"}
        </Button>
      </div>
    </div>
  );
};

export default RefundPage;
