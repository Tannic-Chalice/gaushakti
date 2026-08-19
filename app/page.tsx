import Link from "next/link";

export default function LandingPage() {
  const COW_PLANS = [
    { name: "Basic Monthly", duration: "1 Month", price: "₹2,000", tag: "Standard Rental", desc: "Pure A2 milk and daily domestic manure" },
    { name: "Quarterly Plan", duration: "3 Months", price: "₹5,500", tag: "Save ₹500", desc: "Short lactation & seasonal dairy use" },
    { name: "Half-Yearly Plan", duration: "6 Months", price: "₹10,500", tag: "Save ₹1,500", desc: "Continuous organic farming & dairy supply" },
    { name: "Yearly Plan", duration: "12 Months", price: "₹20,000", tag: "Best Value", desc: "Full year of A2 milk, manure, & calf care" },
  ];

  const BULL_PLANS = [
    { name: "Basic Monthly", duration: "1 Month", price: "₹2,000", tag: "Farming & Breeding", desc: "Single-month ploughing & soil aeration" },
    { name: "Seasonal Farming", duration: "4 Months", price: "₹7,500", tag: "Crop Season Special", desc: "Complete coverage for Kharif/Rabi tilling" },
    { name: "Half-Yearly Plan", duration: "6 Months", price: "₹11,000", tag: "Discounted Rate", desc: "Tillage, weeding, and haulage operations" },
    { name: "Yearly Plan", duration: "12 Months", price: "₹20,000", tag: "Long-Term Usage", desc: "Year-round traditional zero-diesel farming" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfbf7", color: "#1c1917", fontFamily: "sans-serif" }}>
      
      {/* 1. Hero Section */}
      <section
        style={{
          background: "linear-gradient(180deg, #ecfdf5 0%, #fdfbf7 100%)",
          padding: "4.5rem 1.5rem 3.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: "30px",
              backgroundColor: "#d1fae5",
              color: "#065f46",
              fontSize: "0.85rem",
              fontWeight: "700",
              marginBottom: "1.2rem",
            }}
          >
            <span>🐂</span> TRADITIONAL CATTLE RENTAL & ORGANIC FARMING
          </div>

          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              color: "#064e3b",
              lineHeight: 1.2,
              marginBottom: "1.2rem",
            }}
          >
            GauShakti: Empowering Farmers with Indigenous Deoni Cattle
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#047857", lineHeight: "1.6", marginBottom: "2.5rem" }}>
            Affordable monthly and yearly cow & bull subscriptions for ploughing, pure A2 milk, and organic compost. Preserve traditional practices, boost soil fertility, and prevent cattle slaughter.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/rent"
              style={{
                backgroundColor: "#16a34a",
                color: "#ffffff",
                padding: "0.9rem 2rem",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1.05rem",
                boxShadow: "0 4px 6px -1px rgba(22, 163, 74, 0.3)",
              }}
            >
              Browse & Rent Cattle →
            </Link>
            <Link
              href="/list-equipment"
              style={{
                backgroundColor: "#ffffff",
                color: "#166534",
                border: "1.5px solid #16a34a",
                padding: "0.9rem 2rem",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1.05rem",
              }}
            >
              List Cattle or Implements
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars / Startup Vision */}
      <section style={{ maxWidth: "1150px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#064e3b" }}>Our Core Mission</h2>
          <p style={{ color: "#78716c", fontSize: "1rem" }}>Sustainable farming, economic value, and livestock welfare</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "1.8rem", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>🚜</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1c1917" }}>Bull Rental for Ploughing</h3>
            <p style={{ color: "#78716c", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Strong, climate-resilient Deoni bulls for traditional tillage and chemical-free, zero-diesel soil preparation.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", padding: "1.8rem", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>🥛</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1c1917" }}>Cow Rental for Dairy & A2 Milk</h3>
            <p style={{ color: "#78716c", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Healthy cows providing high-nutrition A2 milk for rural families and immediate organic compost generation.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", padding: "1.8rem", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>♻️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1c1917" }}>Cow Dung to Prosperity</h3>
            <p style={{ color: "#78716c", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Convert cattle waste into vermicompost and bio-gas. Sell excess dung back to the platform for guaranteed extra income.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", padding: "1.8rem", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>🩺</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1c1917" }}>24/7 Veterinary Care & GPS</h3>
            <p style={{ color: "#78716c", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Complete healthcare, balanced nutrition packages, real-time GPS tracking, and digital health records included.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Subscription Pricing Plans */}
      <section style={{ backgroundColor: "#f0fdf4", padding: "4rem 1.5rem", borderTop: "1px solid #dcfce7", borderBottom: "1px solid #dcfce7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ color: "#16a34a", fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Transparent Subscriptions</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "900", color: "#064e3b", marginTop: "0.3rem" }}>Flexible Rental Plans for Every Season</h2>
            <p style={{ color: "#047857", fontSize: "1rem" }}>Choose between milking cows or ploughing bulls on monthly and yearly terms</p>
          </div>

          {/* Cow Plans Grid */}
          <div style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#065f46", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🐄</span> Cow Rental Plans (Dairy & Organic Manure)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
              {COW_PLANS.map((plan) => (
                <div key={plan.name} style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #bbf7d0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase" }}>{plan.tag}</span>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0.3rem 0" }}>{plan.name}</h4>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", margin: "0.5rem 0" }}>
                    {plan.price} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>/ {plan.duration}</span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{plan.desc}</p>
                  <Link
                    href="/rent"
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      textAlign: "center",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                    }}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bull Plans Grid */}
          <div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#065f46", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🐂</span> Bull Rental Plans (Farming & Ploughing)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
              {BULL_PLANS.map((plan) => (
                <div key={plan.name} style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #bbf7d0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase" }}>{plan.tag}</span>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0.3rem 0" }}>{plan.name}</h4>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", margin: "0.5rem 0" }}>
                    {plan.price} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>/ {plan.duration}</span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{plan.desc}</p>
                  <Link
                    href="/rent"
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#065f46",
                      color: "#fff",
                      textAlign: "center",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                    }}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Why the Indigenous Deoni Breed */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <span style={{ color: "#16a34a", fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase" }}>Pride of Karnataka & Maharashtra</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "900", color: "#1c1917", margin: "0.4rem 0 1.2rem 0" }}>
              Why We Choose the Indigenous Deoni Breed
            </h2>
            <p style={{ color: "#57534e", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Deoni is an exceptional dual-purpose indigenous breed known for rugged stamina in dry climates, disease resistance, and high-quality milk production.
            </p>

            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "#292524" }}>
                <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> <strong>Dual Purpose:</strong> Sturdy draught bulls for ploughing & productive cows for dairy.
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "#292524" }}>
                <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> <strong>Disease & Heat Resistant:</strong> Highly adapted to Indian tropical field conditions.
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "#292524" }}>
                <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> <strong>Rich A2 Milk:</strong> Healthier milk with superior nutritional and medicinal value.
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "#292524" }}>
                <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> <strong>Low Maintenance:</strong> Thrives on balanced local fodder and silage packages.
              </li>
            </ul>
          </div>

          <div style={{ backgroundColor: "#f5f5f4", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1rem", color: "#1c1917" }}>
              Additional Services & Safety
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e7e5e4", paddingBottom: "0.5rem" }}>
                <span style={{ color: "#57534e" }}>Refundable Security Deposit</span>
                <strong>₹5,000 - ₹10,000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e7e5e4", paddingBottom: "0.5rem" }}>
                <span style={{ color: "#57534e" }}>Safe Cattle Transportation</span>
                <strong>₹1,000 - ₹3,000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e7e5e4", paddingBottom: "0.5rem" }}>
                <span style={{ color: "#57534e" }}>Fodder & Nutrition Pack</span>
                <strong>₹1,500 / month</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e7e5e4", paddingBottom: "0.5rem" }}>
                <span style={{ color: "#57534e" }}>Livestock Insurance Cover</span>
                <strong>₹2,000 / year</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#57534e" }}>Emergency Veterinary Visits</span>
                <strong>₹500 / visit</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Smart Technology & Impact Footer Banner */}
      <section style={{ backgroundColor: "#064e3b", color: "#ecfdf5", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1rem" }}>
            Smart Technology. Healthy Animals. Prosperous Farmers.
          </h2>
          <p style={{ color: "#a7f3d0", fontSize: "1rem", lineHeight: "1.6", marginBottom: "2rem" }}>
            Equipped with real-time GPS tracking, digital vaccination records, bio-gas partnerships, and legal customer agreements governed by Kalaburgi court jurisdiction.
          </p>
          <Link
            href="/rent"
            style={{
              backgroundColor: "#22c55e",
              color: "#052e16",
              padding: "0.9rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "1rem",
            }}
          >
            Start Your Rental Subscription
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={{ backgroundColor: "#022c22", color: "#6ee7b7", padding: "2rem 1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
        <p>© 2026 GauShakti Agri Rentals. Village Tengli, Kalaburgi, Karnataka. Empowering Farmers, Protecting Cows, Enriching Nature.</p>
      </footer>
    </div>
  );
}