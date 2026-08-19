"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const CATEGORIES = [
  "Cows (Dairy & Manure)",
  "Bulls (Ploughing & Farming)",
  "Tractors",
  "Harvesters",
  "Tillers & Cultivators",
  "Drone Sprayers",
  "Pumps & Irrigation",
  "Other Implements",
];

export default function ListEquipmentPage() {
  const router = useRouter();
  const supabase = createClient();

  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    daily_rate: "",
    location: "",
    description: "",
  });

  // Guard: Ensure user is logged in before rendering form
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
      } else {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [supabase, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      let uploadedImageUrl = "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600";

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("equipment-images")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("equipment-images")
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("equipment_listings").insert({
        owner_id: user.id,
        title: formData.title,
        category: formData.category,
        daily_rate: parseFloat(formData.daily_rate),
        location: formData.location,
        description: formData.description,
        images: [uploadedImageUrl],
        is_available: true,
      });

      if (insertError) throw insertError;

      alert("Item listed successfully!");
      router.push("/rent");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Failed to list item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Verifying account...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "650px", margin: "0 auto", backgroundColor: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)" }}>
        
        <Link href="/rent" style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600", display: "inline-block", marginBottom: "1rem" }}>
          ← Back to Rentals
        </Link>

        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.3rem" }}>
          List Equipment or Cattle for Rent
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Set your rental pricing and connect directly with local farmers.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
              Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Indigenous Deoni Bull for Ploughing / Mahindra 575 DI"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff" }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
                Daily Rate / Monthly Rate (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="2000"
                value={formData.daily_rate}
                onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
              Location (Village / Taluk / District) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Village Tengli, Kalaburgi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
            {previewUrl && (
              <div style={{ marginTop: "0.8rem", width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden" }}>
                <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#334155", marginBottom: "0.4rem" }}>
              Description & Terms
            </label>
            <textarea
              rows={4}
              placeholder="Specify health conditions, fodder requirements, attachments included, or rental duration terms..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "0.9rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Publishing Listing..." : "Post for Rent"}
          </button>
        </form>
      </div>
    </div>
  );
}