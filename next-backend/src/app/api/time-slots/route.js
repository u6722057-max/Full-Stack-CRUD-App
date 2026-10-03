import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { errorResponse, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

const defaults = ["09:30", "10:30", "11:30", "13:30", "15:30", "17:30"];
export async function GET() { try { const slots = await collection(await getClientPromise(), "timeSlots").find({ active: { $ne: false } }).sort({ time: 1 }).toArray(); return successResponse({ slots: slots.length ? slots : defaults.map(time => ({ time, default: true })) }); } catch { return errorResponse("Could not load appointment slots", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
