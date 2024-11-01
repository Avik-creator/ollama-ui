// app/api/localModels/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tags`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch installed models");
    }

    const models = await response.json();
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
