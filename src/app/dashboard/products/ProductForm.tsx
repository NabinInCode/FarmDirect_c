"use client";
import { useRouter } from "next/navigation";
import { JSX, useState, useRef } from "react";
import type { DashboardCategory } from "@/lib/dashboard";

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  featured: boolean;
  categoryId: string;
}

const inputBase =
  "mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20";

const labelBase = "block text-sm font-medium text-gray-700";

export default function ProductForm({
  categories,
  initial,
  submitUrl,
  method = "POST",
}: {
  categories: DashboardCategory[];
  initial?: ProductFormValues;
  submitUrl: string;
  method?: "POST" | "PATCH";
}): JSX.Element {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      price: 0,
      unit: "",
      stock: 0,
      image: "",
      featured: false,
      categoryId: categories[0]?.id ?? "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function autoSlug(name: string) {
    if (initial && initial.slug) return;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    update("slug", slug);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately show a local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not upload the image. Please try again.");
        setLocalPreview(null);
        return;
      }
      if (typeof data?.url === "string") {
        update("image", data.url);
        // Clean up local preview after server URL is set
        URL.revokeObjectURL(previewUrl);
        setLocalPreview(null);
      }
    } catch {
      setError("Could not upload the image. Please try again.");
      setLocalPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleRemoveImage() {
    update("image", "");
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(submitUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not save the product. Please try again.");
        return;
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        <div>
          <label className={labelBase} htmlFor="name">
            Product name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(e) => {
              update("name", e.target.value);
              autoSlug(e.target.value);
            }}
            required
            placeholder="e.g. Fresh Carrots"
            className={inputBase}
          />
        </div>

        <div>
          <label className={labelBase} htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
            placeholder="fresh-carrots"
            className={inputBase}
          />
        </div>

        <div>
          <label className={labelBase} htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            required
            rows={4}
            className={`${inputBase} resize-none`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelBase} htmlFor="price">
              Price in rupees <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={values.price || ""}
              onChange={(e) => update("price", Number(e.target.value))}
              required
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase} htmlFor="unit">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              id="unit"
              value={values.unit}
              onChange={(e) => update("unit", e.target.value)}
              required
              placeholder="e.g. 1 kg"
              className={inputBase}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelBase} htmlFor="stock">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              value={values.stock || ""}
              onChange={(e) => update("stock", Math.max(0, Math.round(Number(e.target.value))))}
              required
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase} htmlFor="categoryId">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              value={values.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              required
              className={inputBase}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelBase}>
            Product image <span className="text-gray-400">(optional)</span>
          </label>

          {values.image || localPreview ? (
            <div className="mt-3 flex items-center gap-4">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={localPreview || values.image}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="image-file"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                >
                  {uploading ? "Uploading..." : "Replace"}
                </label>
                {!uploading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="block text-sm font-medium text-red-600 transition hover:text-red-700"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label
              htmlFor="image-file"
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                />
              </svg>
              Choose an image from your computer
            </label>
          )}

          <input
            ref={fileInputRef}
            id="image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={handleFileChange}
            className="sr-only"
          />
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG, WEBP or GIF up to 4 MB. Leave empty to use an auto-generated placeholder.
          </p>
        </div>

        <div>
          <label className={labelBase} htmlFor="image">
            {" "}
            Or paste an image URL <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="image"
            value={values.image}
            onChange={(e) => {
              update("image", e.target.value);
              setLocalPreview(null);
            }}
            placeholder="https://... or /uploads/products/..."
            className={inputBase}
          />
        </div>
      </div>

      <div className="h-max space-y-4 lg:sticky lg:top-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900">Publish</h2>
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700">Featured on storefront</span>
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4 accent-[#1B4332]"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C6B4A] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>
    </form>
  );
}
