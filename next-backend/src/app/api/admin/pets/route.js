import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(request) {
  if (!isAdmin(getSession(request))) return errorResponse("Administrator access required", 403);
  try {
    const pets = await collection(await getClientPromise(), "pets").find({}).sort({ createdAt: -1 }).toArray();
    return successResponse({ pets });
  } catch (error) { printExceptionLog("GET admin pets", error); return errorResponse("Could not load pets", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
