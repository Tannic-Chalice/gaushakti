import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0; // Fresh data on every load

interface EquipmentListing {
  id: string;
  title: string;
  category: string;
  daily_rate: number;
  location: string;
  images: string[];
  is_available: boolean;
  profiles: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category || "All";
  const searchFilter = params.search || "";

  const supabase = await createClient();

  let query = supabase
    .from("equipment_listings")
    .select(`
      id,
      title,
      category,
      daily_rate,
      location,
      images,
      is_available,
      profiles:owner_id (
        full_name,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  if (categoryFilter !== "All") {
    query = query.eq("category", categoryFilter);
  }

  if (searchFilter) {
    query = query.or(`title.ilike.%${searchFilter}%,location.ilike.%${searchFilter}%`);
  }

  const { data: listings } = await query;
  const equipmentList = (listings as unknown as EquipmentListing[]) || [];

  const CATEGORIES = [
    { label: "All Equipment", value: "All", icon: "🌾" },
    { label: "Tractors", value: "Tractors", icon: "🚜" },
    { label: "Harvesters", value: "Harvesters", icon: "🌾" },
    { label: "Tillers & Cultivators", value: "Tillers & Cultivators", icon: "⚙️" },
    { label: "Drone Sprayers", value: "Drone Sprayers", icon: "🛸" },
    { label: "Pumps & Irrigation", value: "Pumps & Irrigation", icon: "💧" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2.5rem",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.8rem" }}>🚜</span>
          <div>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#15803d" }}>AgriShare</span>
            <span style={{ fontSize: "0.75rem", display: "block", color: "#64748b", fontWeight: "600" }}>
              FARM EQUIPMENT RENTAL
            </span>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/my-rentals" style={{ padding: "0.55rem 1rem", fontSize: "0.95rem", color: "#334155", fontWeight: "600" }}>
            My Bookings
          </Link>
          <Link
            href="/list-equipment"
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            + List Your Equipment
          </Link>
          <Link
            href="/auth/login"
            style={{
              border: "1.5px solid #cbd5e1",
              padding: "0.55rem 1.2rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#1e293b",
            }}
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ background: "linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: "900", color: "#064e3b", marginBottom: "0.8rem" }}>
            Rent Farm Machinery Directly from Nearby Farmers
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#047857", marginBottom: "2rem" }}>
            Find available agricultural equipment on demand or list yours to earn extra income.
          </p>

          <form method="GET" style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              name="search"
              defaultValue={searchFilter}
              placeholder="Search tractors, harvesters, districts..."
              style={{
                flex: 1,
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            {categoryFilter !== "All" && <input type="hidden" name="category" value={categoryFilter} />}
            <button
              type="submit"
              style={{
                backgroundColor: "#15803d",
                color: "#fff",
                border: "none",
                padding: "0.85rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem", width: "100%" }}>
        <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat.value;
            const queryParams = new URLSearchParams();
            if (cat.value !== "All") queryParams.set("category", cat.value);
            if (searchFilter) queryParams.set("search", searchFilter);

            return (
              <Link
                key={cat.value}
                href={`/?${queryParams.toString()}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "30px",
                  border: isActive ? "2px solid #15803d" : "1px solid #cbd5e1",
                  backgroundColor: isActive ? "#dcfce7" : "#ffffff",
                  color: isActive ? "#15803d" : "#475569",
                  fontWeight: isActive ? "700" : "500",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem 4rem 1.5rem", width: "100%", flex: 1 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem" }}>
          Available Machinery ({equipmentList.length})
        </h2>

        {equipmentList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "2.5rem" }}>🌾</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "0.8rem" }}>No listings found</h3>
            <p style={{ color: "#64748b", marginTop: "0.4rem" }}>Be the first to list equipment in this category!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {equipmentList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "190px", backgroundColor: "#f1f5f9" }}>
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600"}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: item.is_available ? "rgba(22, 163, 74, 0.9)" : "rgba(220, 38, 38, 0.9)",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                    }}
                  >
                    {item.is_available ? "Available" : "Rented Out"}
                  </span>
                </div>

                <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", margin: "0.3rem 0" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.8rem" }}>📍 {item.location}</p>
                  <p style={{ color: "#475569", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    Owner: <strong>{item.profiles?.full_name || "Verified Farmer"}</strong>
                  </p>

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.8rem" }}>
                    <div>
                      <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>₹{item.daily_rate}</span>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}> / day</span>
                    </div>
                    <Link
                      href={`/equipment/${item.id}`}
                      style={{
                        backgroundColor: "#15803d",
                        color: "#ffffff",
                        padding: "0.45rem 0.9rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}