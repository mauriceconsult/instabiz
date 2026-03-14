"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // ← removed unused Badge import
import { RefundWithOrder } from "../page";
import Image from "next/image";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export const RefundClient = ({ data }: { data: RefundWithOrder[] }) => {
  // ← replaced any[]
  const params = useParams();
  const [loading, setLoading] = useState<string | null>(null);

  const onReview = async (
    refundId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setLoading(refundId);
      await axios.patch(`/api/${params.shopId}/refunds/${refundId}/review`, {
        status,
      });
      toast.success(`Refund ${status}.`);
      window.location.reload();
    } catch {
      toast.error("Failed to update refund.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Heading
        title={`Refund Requests (${data.length})`}
        description="Review and manage buyer refund requests"
      />
      <Separator />

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground pt-4">
          No refund requests yet.
        </p>
      ) : (
        <div className="space-y-4 pt-4">
          {data.map((refund) => (
            <div
              key={refund.id}
              className="border rounded-lg p-6 space-y-4 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{refund.orderId.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-400">
                    Requested:{" "}
                    {new Date(refund.requestedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Window expires:{" "}
                    {new Date(refund.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_COLORS[refund.status] ?? "bg-gray-100 text-gray-800"
                  }`}
                >
                  {refund.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  REASON
                </p>
                <p className="text-sm text-gray-700">{refund.reason}</p>
              </div>

              {/* Evidence */}
              {refund.evidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    EVIDENCE
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {refund.evidence.map((url: string, i: number) => (
                      <a // ← restored missing opening tag
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          fill
                          src={url}
                          alt={`Evidence ${i + 1}`}
                          sizes="64px"
                          className="object-cover rounded-md border hover:opacity-75 transition"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="text-xs text-gray-500">
                <p>Phone: {refund.buyerPhone}</p>
                {refund.buyerEmail && <p>Email: {refund.buyerEmail}</p>}
              </div>

              {/* Actions */}
              {refund.status === "pending" && (
                <div className="flex items-center gap-x-3 pt-2">
                  <Button
                    onClick={() => onReview(refund.id, "approved")}
                    disabled={loading === refund.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve Refund
                  </Button>
                  <Button
                    onClick={() => onReview(refund.id, "rejected")}
                    disabled={loading === refund.id}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
