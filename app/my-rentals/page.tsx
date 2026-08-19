"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface RentalItem {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "approved" | "rejected" | "completed";
  equipment: {
    title: string;
    location: string;
  } | null;
  renter: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

export default function MyRentalsDashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"owner" | "renter">("owner");
  const [ownerRentals, setOwnerRentals] = useState<RentalItem[]>([]);
  const [renterRentals, setRenterRentals] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch bookings requested on this user's listed equipment
      const { data: ownerData } = await supabase
        .from("rentals")
        .select(`
          id,
          start_date,
          end_date,
          total_price,
          status,
          equipment:equipment_id (title, location, owner_id),
          renter:renter_id (full_name, phone)
        `)
        .order("created_at", { ascending: false });

      // Fetch bookings this user made on others' equipment
      const { data: renterData } = await supabase
        .from("rentals")
        .select(`
          id,
          start_date,
          end_date,
          total_price,
          status,
          equipment:equipment_id (title, location),
          renter:renter_id (full_name, phone)
        `)
        .eq("renter_id", user.id)
        .order("created_at", { ascending: false });

      if (ownerData) {
        // Filter where current user is equipment owner
        const filteredOwner = ownerData.filter(
          (r: any) => r.equipment?.owner_id === user.id
        );
        setOwnerRentals(filteredOwner as unknown as RentalItem[]);
      }

      if (renterData) {
        setRenterRentals(renterData as unknown as RentalItem[]);
      }

      setLoading(false);
    }

    loadData();
  }, [supabase]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const { error } = await supabase
      .from("rentals")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      setOwnerRentals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a" }}>Rental Hub</h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Manage machinery requests and your active hires</p>
          </div>
          <Link href="/" style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600" }}>
            ← Home
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setActiveTab("owner")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderBottom: activeTab === "owner" ? "3px solid #16a34a" : "3px solid transparent",
              backgroundColor: "transparent",
              fontWeight: activeTab === "owner" ? "700" : "500",
              color: activeTab === "owner" ? "#16a34a" : "#64748b",
              cursor: "pointer",
            }}
          >
            Requests on My Equipment ({ownerRentals.length})
          </button>
          <button
            onClick={() => setActiveTab("renter")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderBottom: activeTab === "renter" ? "3px solid #16a34a" : "3px solid transparent",
              backgroundColor: "transparent",
              fontWeight: activeTab === "renter" ? "700" : "500",
              color: activeTab === "renter" ? "#16a34a" : "#64748b",
              cursor: "pointer",
            }}
          >
            My Rented Bookings ({renterRentals.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>Loading your bookings...</p>
        ) : activeTab === "owner" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ownerRentals.length === 0 ? (
              <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>No rental requests on your equipment yet.</p>
            ) : (
              ownerRentals.map((req) => (
                <div key={req.id} style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>{req.equipment?.title}</h3>
                    <p style={{ color: "#475569", fontSize: "0.9rem", margin: "0.2rem 0" }}>
                      Renter: <strong>{req.renter?.full_name || "Farmer"}</strong> {req.renter?.phone && `(${req.renter.phone})`}
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>📅 {req.start_date} to {req.end_date}</p>
                    <p style={{ color: "#15803d", fontWeight: "700", marginTop: "0.4rem" }}>Total: ₹{req.total_price}</p>
                  </div>

                  <div>
                    {req.status === "pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "approved")}
                          style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          backgroundColor: req.status === "approved" ? "#dcfce7" : "#fee2e2",
                          color: req.status === "approved" ? "#15803d" : "#b91c1c",
                          textTransform: "capitalize",
                        }}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {renterRentals.length === 0 ? (
              <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>You haven&apos;t booked any equipment yet.</p>
            ) : (
              renterRentals.map((booking) => (
                <div key={booking.id} style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>{booking.equipment?.title}</h3>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.2rem 0" }}>📍 {booking.equipment?.location}</p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>📅 {booking.start_date} to {booking.end_date}</p>
                    <p style={{ color: "#15803d", fontWeight: "700", marginTop: "0.3rem" }}>Total: ₹{booking.total_price}</p>
                  </div>
                  <span
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      backgroundColor: booking.status === "approved" ? "#dcfce7" : booking.status === "pending" ? "#fef3c7" : "#fee2e2",
                      color: booking.status === "approved" ? "#15803d" : booking.status === "pending" ? "#92400e" : "#b91c1c",
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}