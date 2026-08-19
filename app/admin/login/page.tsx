"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify that this user is in the admins table
      const { data: adminRecord, error: adminErr } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .single();

      if (adminErr || !adminRecord) {
        await supabase.auth.signOut();
        throw new Error("Access Denied: You do not have admin privileges.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090d16",
        color: "#f8fafc",
        padding: "1.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#161f30",
          padding: "2.5rem",
          borderRadius: "12px",
          border: "1px solid #283548",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>🛡️</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#38bdf8" }}>Admin Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            Platform monitoring and super control
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "1.2rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "0.4rem" }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@agrishare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#0284c7",
              color: "#ffffff",
              padding: "0.8rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: "700",
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Authenticating..." : "Access Control Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}