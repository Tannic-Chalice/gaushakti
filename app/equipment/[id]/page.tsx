import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BookingForm from "./BookingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("equipment_listings")
    .select(`
      id,
      title,
      category,
      daily_rate,
      location,
      description,
      images,
      is_available,
      owner_id,
      profiles:owner_id (
        full_name,
        phone
      )
    `)
    .eq("id", id)
    .single();

  if (!item) notFound();

  const ownerProfile = item.profiles as unknown as { full_name: string; phone: string } | null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600", display: "inline-block", marginBottom: "1.5rem" }}>
          ← Back to All Machinery
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ width: "100%", height: "350px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#e2e8f0" }}>
              <img
                src={item.images?.[0] || "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800"}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase" }}>
                {item.category}
              </span>
              <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: "0.3rem 0" }}>
                {item.title}
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1rem" }}>
                📍 Location: <strong>{item.location}</strong>
              </p>
              <p style={{ color: "#334155", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Owner: <strong>{ownerProfile?.full_name || "Verified Farmer"}</strong>
              </p>

              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>
                Description & Terms
              </h3>
              <p style={{ color: "#475569", lineHeight: "1.6", fontSize: "0.95rem" }}>
                {item.description || "No specific instructions provided by owner."}
              </p>
            </div>
          </div>

          <div>
            <BookingForm equipmentId={item.id} dailyRate={item.daily_rate} isAvailable={item.is_available} />
          </div>
        </div>
      </div>
    </div>
  );
}