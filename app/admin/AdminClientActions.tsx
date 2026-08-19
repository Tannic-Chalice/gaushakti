"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminClientActions({
  type,
  id,
}: {
  type: "equipment" | "rental";
  id: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this item as admin?")) return;
    setLoading(true);

    try {
      const table = type === "equipment" ? "equipment_listings" : "rentals";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Delete failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        backgroundColor: "#7f1d1d",
        color: "#fca5a5",
        border: "1px solid #991b1b",
        padding: "0.35rem 0.75rem",
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: "600",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "..." : "Remove"}
    </button>
  );
}