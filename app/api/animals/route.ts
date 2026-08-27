import { NextRequest, NextResponse } from "next/server";
import { getSql, ensureTables } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureTables();
  const sql = getSql();
  const { searchParams } = new URL(req.url);
  const species = searchParams.get("species");
  const county = searchParams.get("county");
  const status = searchParams.get("status") || "available";

  let rows;
  if (species) {
    rows = await sql`SELECT * FROM animals WHERE status = ${status} AND species = ${species} ORDER BY created_at DESC LIMIT 50`;
  } else if (county) {
    rows = await sql`SELECT * FROM animals WHERE status = ${status} AND county = ${county} ORDER BY created_at DESC LIMIT 50`;
  } else {
    rows = await sql`SELECT * FROM animals WHERE status = ${status} ORDER BY created_at DESC LIMIT 50`;
  }

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureTables();
  const sql = getSql();
  const body = await req.json();

  const {
    owner_id,
    shelter_id,
    name,
    species,
    breed,
    age,
    age_text,
    gender,
    size,
    location,
    county,
    lat,
    lng,
    image,
    description,
    child_friendly,
    transport_help,
    indoor_outdoor,
    gets_along_with_others,
    vaccinated,
    neutered,
    pickup_line,
  } = body;

  if (!name || !species) {
    return NextResponse.json({ error: "Név és faj kötelező" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO animals (
      shelter_id, owner_id, name, species, breed, age, age_text, gender, size,
      location, county, lat, lng, image, description,
      child_friendly, transport_help, indoor_outdoor, gets_along_with_others,
      vaccinated, neutered, pickup_line
    ) VALUES (
      ${shelter_id || null}, ${owner_id || null}, ${name}, ${species},
      ${breed || null}, ${age || null}, ${age_text || null}, ${gender || null},
      ${size || null}, ${location || null}, ${county || null},
      ${lat || null}, ${lng || null}, ${image || null}, ${description || null},
      ${child_friendly ? 1 : 0}, ${transport_help ? 1 : 0},
      ${indoor_outdoor || "mindkettő"}, ${gets_along_with_others !== false ? 1 : 0},
      ${vaccinated ? 1 : 0}, ${neutered ? 1 : 0}, ${pickup_line || null}
    ) RETURNING *
  `;

  return NextResponse.json(rows[0], { status: 201 });
}
