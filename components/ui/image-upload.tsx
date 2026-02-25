"use client";

import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  maxFiles = 1, // ← default to 1 for billboard
}) => {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-32 h-32 rounded-md overflow-hidden" // fixed: w-50 → w-32 (or use w-[200px])
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Uploaded image"
              src={url}
              sizes="200px"
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="instabiz"
        options={{
          maxFiles,
          multiple: maxFiles > 1, // ← enable multi-select for products
        }}
        onSuccess={(result) => {
          const info = result.info as { secure_url: string };
          onChange(info.secure_url);
        }}
      >
        {({ open }) => {
          const handleUpload = () => {
            if (open) open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={handleUpload}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {maxFiles === 1 ? "Upload an Image" : "Upload Images"}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
