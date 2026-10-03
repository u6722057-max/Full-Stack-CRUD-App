import corsHeaders from "@/lib/cors";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { message: "Hello from the Next.js API!" },
    { headers: corsHeaders },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
