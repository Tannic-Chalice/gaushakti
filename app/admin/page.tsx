import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminClientActions from "./AdminClientActions";

export const revalidate = 0; // Live platform data

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRecord } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRecord) {
    redirect("/admin/login");
  }

  // Fetch all platform data
  const [equipmentRes, rentalsRes, usersRes] = await Promise.all([
    supabase
      .from("equipment_listings")
      .select(`
        id,
        title,
        category,
        daily_rate,
        location,
        is_available,
        created_at,
        profiles:owner_id (
          full_name,
          email,
          phone
        )
      `)
      .order("created_at", { ascending: false }),

    supabase
      .from("rentals")
      .select(`
        id,
        start_date,
        end_date,
        total_price,
        status,
        created_at,
        equipment:equipment_id (title),
        renter:renter_id (full_name, email, phone)
      `)
      .order("created_at", { ascending: false }),

    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const listings = equipmentRes.data || [];
  const rentals = rentalsRes.data || [];
  const totalUsers = usersRes.count || 0;
  const totalVolume = rentals.reduce((acc, r) => acc + (Number(r.total_price) || 0), 0);

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" }}>
        Platform Monitoring & Control
      </h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "2.5rem" }}>
        <div style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937" }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: "600" }}>TOTAL REGISTERED USERS</span>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#38bdf8", marginTop: "0.4rem" }}>{totalUsers}</div>
        </div>
        <div style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937" }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: "600" }}>ACTIVE LISTINGS</span>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#4ade80", marginTop: "0.4rem" }}>{listings.length}</div>
        </div>
        <div style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937" }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: "600" }}>TOTAL TRANSACTIONS</span>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fbbf24", marginTop: "0.4rem" }}>{rentals.length}</div>
        </div>
        <div style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937" }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: "600" }}>TOTAL RENTAL VOLUME</span>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#f472b6", marginTop: "0.4rem" }}>₹{totalVolume.toLocaleString()}</div>
        </div>
      </div>

      {/* Equipment Moderation */}
      <section style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>
          All Equipment Listings ({listings.length})
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
                <th style={{ padding: "0.75rem" }}>Title</th>
                <th style={{ padding: "0.75rem" }}>Category</th>
                <th style={{ padding: "0.75rem" }}>Daily Rate</th>
                <th style={{ padding: "0.75rem" }}>Owner</th>
                <th style={{ padding: "0.75rem" }}>Location</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No machinery listed yet.</td></tr>
              ) : (
                listings.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>{item.title}</td>
                    <td style={{ padding: "0.75rem", color: "#9ca3af" }}>{item.category}</td>
                    <td style={{ padding: "0.75rem" }}>₹{item.daily_rate}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>{item.profiles?.full_name || "Unknown"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{item.profiles?.phone || item.profiles?.email}</div>
                    </td>
                    <td style={{ padding: "0.75rem", color: "#9ca3af" }}>{item.location}</td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <AdminClientActions type="equipment" id={item.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rental Log */}
      <section style={{ backgroundColor: "#111827", padding: "1.5rem", borderRadius: "10px", border: "1px solid #1f2937" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>
          All Peer-to-Peer Bookings ({rentals.length})
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
                <th style={{ padding: "0.75rem" }}>Equipment</th>
                <th style={{ padding: "0.75rem" }}>Renter</th>
                <th style={{ padding: "0.75rem" }}>Dates</th>
                <th style={{ padding: "0.75rem" }}>Amount</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No bookings initiated yet.</td></tr>
              ) : (
                rentals.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>{r.equipment?.title || "Deleted item"}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>{r.renter?.full_name || "Farmer"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{r.renter?.phone || r.renter?.email}</div>
                    </td>
                    <td style={{ padding: "0.75rem", color: "#9ca3af" }}>{r.start_date} to {r.end_date}</td>
                    <td style={{ padding: "0.75rem", fontWeight: "700", color: "#4ade80" }}>₹{r.total_price}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ textTransform: "capitalize", fontSize: "0.85rem", fontWeight: "700" }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}