"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const CATEGORIES = [
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

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    daily_rate: "",
    location: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in first to list equipment.");
        router.push("/auth/login");
        return;
      }

      let imageUrl = "";

      // Upload file to Supabase Storage if chosen
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("equipment-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("equipment-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // Insert record into PostgreSQL
      const { error: insertError } = await supabase
        .from("equipment_listings")
        .insert({
          owner_id: user.id,
          title: formData.title,
          category: formData.category,
          daily_rate: parseFloat(formData.daily_rate),
          location: formData.location,
          description: formData.description,
          images: imageUrl ? [imageUrl] : [],
          is_available: true,
        });

      if (insertError) throw insertError;

      alert("Equipment listed successfully!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to list equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", padding: "2.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600", marginBottom: "1rem", display: "inline-block" }}>
          ← Back to Marketplace
        </Link>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.4rem" }}>
          List Your Equipment
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Earn money from your idle machinery by renting it to nearby farmers.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Equipment Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. John Deere 5050 D 50HP"
              value={formData.title}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Daily Rate (₹) *</label>
              <input
                type="number"
                name="daily_rate"
                required
                placeholder="2000"
                value={formData.daily_rate}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Location (Village/District) *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Mandya, Karnataka"
              value={formData.location}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Machinery Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.4rem" }}>Description & Terms</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Provide specifications, attachment details (e.g. rotavator included), fuel terms..."
              value={formData.description}
              onChange={handleChange}
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
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Publishing..." : "Post Equipment for Rent"}
          </button>
        </form>
      </div>
    </div>
  );
}