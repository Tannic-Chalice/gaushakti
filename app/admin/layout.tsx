import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If viewing the admin login page itself, don't guard
  // Otherwise, verify presence in public.admins
  if (!user) {
    // If not authenticated, let the login page render itself or redirect
    return <>{children}</>;
  }

  const { data: adminRecord } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f8fafc", fontFamily: "sans-serif" }}>
      {adminRecord && (
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2.5rem",
            backgroundColor: "#111827",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "1.4rem" }}>🛡️</span>
            <div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#38bdf8" }}>GauShakti Admin Control</span>
              <span style={{ fontSize: "0.75rem", display: "block", color: "#9ca3af" }}>
                Platform Monitoring & Super Control
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{user.email}</span>
            <Link
              href="/"
              style={{
                fontSize: "0.85rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                backgroundColor: "#1f2937",
                color: "#f8fafc",
                textDecoration: "none",
              }}
            >
              ← View Main Site
            </Link>
          </div>
        </header>
      )}

      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}