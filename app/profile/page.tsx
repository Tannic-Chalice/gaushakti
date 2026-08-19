"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    email: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, location, email")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          location: profile.location || "",
          email: user.email || "",
        });
      }
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      alert("Failed to update profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>Loading profile...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "550px", margin: "0 auto", backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600", display: "inline-block", marginBottom: "1rem" }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.3rem" }}>
          Farmer Profile
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
          Your contact details are shared when booking requests are accepted.
        </p>

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={formData.email}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "#f1f5f9", color: "#64748b" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
              Phone Number (with WhatsApp) *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "0.3rem" }}>
              Default Location / Village / District *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mandya District, Karnataka"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: "#16a34a",
              color: "#fff",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "700",
              cursor: saving ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}