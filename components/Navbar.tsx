"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2.5rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ fontSize: "1.8rem" }}>🚜</span>
        <div>
          <span style={{ fontSize: "1.35rem", fontWeight: "800", color: "#15803d" }}>GauShakti</span>
          <span style={{ fontSize: "0.7rem", display: "block", color: "#64748b", fontWeight: "700" }}>
            AGRI & CATTLE RENTALS
          </span>
        </div>
      </Link>

      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {/* Public marketplace link */}
        <Link
          href="/rent"
          style={{ padding: "0.55rem 0.9rem", fontSize: "0.9rem", color: "#334155", fontWeight: "600" }}
        >
          Browse Rentals
        </Link>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {/* Restored: My Bookings & Rentals Dashboard */}
            <Link
              href="/my-rentals"
              style={{
                padding: "0.55rem 0.9rem",
                fontSize: "0.9rem",
                color: "#15803d",
                fontWeight: "700",
              }}
            >
              📋 My Bookings
            </Link>

            {/* List Machinery / Cattle */}
            <Link
              href="/list-equipment"
              style={{
                backgroundColor: "#16a34a",
                color: "#ffffff",
                padding: "0.55rem 1.1rem",
                borderRadius: "7px",
                fontWeight: "700",
                fontSize: "0.9rem",
              }}
            >
              + List Equipment / Cattle
            </Link>

            {/* Farmer Profile */}
            <Link
              href="/profile"
              style={{
                fontSize: "0.85rem",
                color: "#1e293b",
                fontWeight: "600",
                backgroundColor: "#f1f5f9",
                padding: "0.45rem 0.8rem",
                borderRadius: "6px",
              }}
            >
              👤 Profile
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              style={{
                border: "1px solid #fca5a5",
                backgroundColor: "#fff",
                padding: "0.45rem 0.8rem",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.85rem",
                color: "#dc2626",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            style={{
              border: "1.5px solid #cbd5e1",
              padding: "0.5rem 1.1rem",
              borderRadius: "7px",
              fontWeight: "600",
              fontSize: "0.9rem",
              color: "#1e293b",
            }}
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}