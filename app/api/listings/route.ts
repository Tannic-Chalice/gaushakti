import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/listings?category=Tractors&search=Deoni
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = supabase
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
        created_at,
        profiles:owner_id (
          full_name,
          phone,
          location
        )
      `)
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ listings: data });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/listings -> Post new cattle / equipment listing
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, daily_rate, location, description, images } = body;

    if (!title || !category || !daily_rate || !location) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("equipment_listings")
      .insert({
        owner_id: user.id,
        title,
        category,
        daily_rate: parseFloat(daily_rate),
        location,
        description,
        images: images || [],
        is_available: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, listing: data }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}