"use client";

import { useState, useCallback } from "react";
import { UploadSimple, X } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket?: string;
}

export function ImageUploader({
  images,
  onChange,
  bucket = "product-images",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(fileName);
          newUrls.push(publicUrl);
        }
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, onChange, supabase, bucket]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-admin-success bg-admin-success/5"
            : "border-admin-border hover:border-admin-success/50"
        }`}
        onClick={() => document.getElementById("image-upload-input")?.click()}
      >
        <UploadSimple
          size={32}
          className={uploading ? "animate-pulse text-admin-success" : "text-text-muted"}
        />
        <p className="mt-2 text-sm text-text-muted">
          {uploading
            ? "Upload en cours..."
            : "Glissez vos images ici ou cliquez pour parcourir"}
        </p>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="group relative aspect-square">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full rounded-lg border border-admin-border object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 rounded-full bg-admin-warning p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
