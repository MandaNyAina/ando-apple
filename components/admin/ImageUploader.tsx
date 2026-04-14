"use client";

import { useState, useCallback, useRef } from "react";
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
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      setError("");
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          setError(`Erreur upload: ${uploadError.message}`);
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(fileName);
          newUrls.push(publicUrl);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-admin-success bg-admin-success/5"
            : "border-admin-border hover:border-admin-success/50"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <UploadSimple
          size={28}
          className={uploading ? "animate-pulse text-admin-success" : "text-text-muted"}
        />
        <p className="mt-2 text-sm text-text-muted">
          {uploading
            ? "Upload en cours..."
            : "Glissez vos images ici ou cliquez"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-xs text-admin-warning">{error}</p>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="group relative w-20 h-20">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full rounded-lg border border-admin-border object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -right-2 -top-2 rounded-full bg-admin-warning p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
