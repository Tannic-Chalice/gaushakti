"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BookingForm({
  equipmentId,
  dailyRate,
  isAvailable,
}: {
  equipmentId: string;
  dailyRate: number;
  isAvailable: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * dailyRate;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to book equipment.");
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("rentals").insert({
        equipment_id: equipmentId,
        renter_id: user.id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: "pending",
      });

      if (error) throw error;

      alert("Rental request submitted! The owner will review your booking.");
      router.push("/my-rentals");
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>₹{dailyRate}</span>
        <span style={{ color: "#64748b" }}>/ day</span>
      </div>

      <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}>Start Date</label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}>End Date</label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>₹{dailyRate} × {totalDays} {totalDays === 1 ? "day" : "days"}</span>
            <span>₹{totalPrice}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", borderTop: "1px solid #e2e8f0", paddingTop: "0.5rem" }}>
            <span>Total:</span>
            <span style={{ color: "#15803d" }}>₹{totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isAvailable}
          style={{
            backgroundColor: isAvailable ? "#15803d" : "#94a3b8",
            color: "#ffffff",
            padding: "0.9rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "700",
            cursor: isAvailable ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Sending..." : isAvailable ? "Request to Book" : "Currently Unavailable"}
        </button>
      </form>
    </div>
  );
}