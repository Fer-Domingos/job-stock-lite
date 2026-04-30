import { NextResponse } from "next/server";
import { addMovement, getMovements, MovementType } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getMovements());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const type = body?.type as MovementType;
  const material = String(body?.material ?? "").trim();
  const quantity = Number(body?.quantity ?? 0);
  const location = String(body?.location ?? "").trim();
  const note = String(body?.note ?? "").trim();

  if (!["IN", "OUT"].includes(type) || !material || quantity <= 0 || !location) {
    return NextResponse.json({ error: "Invalid movement payload" }, { status: 400 });
  }

  const movement = addMovement({
    type,
    material,
    quantity,
    location,
    note: note || null
  });

  return NextResponse.json(movement, { status: 201 });
}
