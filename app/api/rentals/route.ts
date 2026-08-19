import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/rentals -> Fetch user's rented items & booking requests on their listings
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Rentals booked by this user
    const myBookingsPromise = supabase
      .from("rentals")
      .select(`
        id,
        start_date,
        end_date,
        total_price,
        status,
        created_at,
        equipment:equipment_id (
          id,
          title,
          category,
          daily_rate,
          location,
          images,
          profiles:owner_id (full_name, phone)
        )
      `)
      .eq("renter_id", user.id)
      .order("created_at", { ascending: false });

    // 2. Incoming requests on equipment owned by this user
    const incomingRequestsPromise = supabase
      .from("rentals")
      .select(`
        id,
        start_date,
        end_date,
        total_price,
        status,
        created_at,
        equipment:equipment_id!inner (
          id,
          title,
          owner_id
        ),
        renter:renter_id (
          full_name,
          phone,
          location
        )
      `)
      .eq("equipment.owner_id", user.id)
      .order("created_at", { ascending: false });

    const [myBookingsRes, incomingRequestsRes] = await Promise.all([
      myBookingsPromise,
      incomingRequestsPromise,
    ]);

    return NextResponse.json({
      my_bookings: myBookingsRes.data || [],
      incoming_requests: incomingRequestsRes.data || [],
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/rentals -> Create booking
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { equipment_id, start_date, end_date, total_price } = body;

    const { data, error } = await supabase
      .from("rentals")
      .insert({
        equipment_id,
        renter_id: user.id,
        start_date,
        end_date,
        total_price,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, rental: data }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}