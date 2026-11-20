"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, UploadCloud, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

export default function AddServicePage() {
  const router = useRouter();

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("active");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Direct ImgBB File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // In production or when user has IMGBB_API_KEY
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (apiKey && apiKey !== "mock_imgbb_key") {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.data?.url) {
          setImage(data.data.url);
          toast.success("Image uploaded to ImgBB successfully!");
          return;
        }
      }

      // Fast Local FileReader Preview / Direct fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success("Image file processed!");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error("Failed to upload image to ImgBB");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload or provide an image for the service");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceName,
          category,
          description,
          price: parseFloat(price),
          duration: parseInt(duration, 10),
          image,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create service");

      toast.success("Service added to salon catalog!");
      router.push("/dashboard/admin/services");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-3xl space-y-6">
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-[#C98573] group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Service Catalog
        </Link>

        <div>
          <h1 className="text-2xl font-serif font-bold text-[#201C1B]">Add New Salon Service</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure treatment specifications, pricing, duration, and promotional imagery.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E8C5A8]/50 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Balayage Highlighting & Gloss"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#C98573]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#C98573]"
                >
                  <option value="active">Active (Visible in Catalog)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="85.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="45"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of the treatment, products utilized, and aesthetic results..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573]"
              />
            </div>

            {/* ImgBB Direct Upload or URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Service Image Upload (ImgBB)</label>
              <div className="border-2 border-dashed border-[#E8C5A8] rounded-2xl p-6 text-center hover:bg-[#FAF6F2]/40 transition-colors">
                <input
                  type="file"
                  id="service-image-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="service-image-input" className="cursor-pointer space-y-2 block">
                  <UploadCloud className="w-8 h-8 text-[#C98573] mx-auto" />
                  <p className="text-xs font-semibold text-[#201C1B]">
                    {uploading ? "Uploading to ImgBB..." : "Click to upload image or drag and drop"}
                  </p>
                  <p className="text-[10px] text-gray-400">PNG, JPG, or WEBP up to 10MB</p>
                </label>
              </div>

              {/* Or Direct Image URL input */}
              <div className="mt-3 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="url"
                  placeholder="Or enter direct image URL (https://images.unsplash.com/...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#C98573]"
                />
              </div>

              {image && (
                <div className="mt-3 relative h-36 w-full rounded-xl overflow-hidden border border-[#E8C5A8]">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C98573] hover:bg-[#B86B57] text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-60"
            >
              {submitting ? "Publishing Service..." : "Publish Service to Catalog"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
