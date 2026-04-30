import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare("SELECT id, type, material, quantity, location, note, created_at FROM movements ORDER BY id DESC")
    .all();
  return NextResponse.json(rows);
}
