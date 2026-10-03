import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument } from "@/lib/petcare-api";
import { getSession } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const session = getSession(request);
  if (!session) return errorResponse("Please sign in to view appointments", 401);
  try { const petId = new URL(request.url).searchParams.get("petId"); const query = { ownerId: session.id, ...(petId ? { petId } : {}) }; const client = await getClientPromise(); const appointments = await collection(client, "appointments").find(query).sort({ startsAt: 1 }).toArray(); return successResponse({ appointments }); }
  catch (e) { printExceptionLog("GET appointments", e); return errorResponse("Could not load appointments", 500); }
}
export async function POST(request) {
  const session = getSession(request);
  if (!session) return errorResponse("Please sign in to book an appointment", 401);
  try { const data = await request.json(); const missing = ["petId", "doctorId", "doctorName", "clinicName", "startsAt", "reason"].filter(key => !String(data[key] || "").trim()); if (missing.length) return errorResponse(`Missing required fields: ${missing.join(", ")}`, 400); const startsAt = new Date(data.startsAt); if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() <= Date.now()) return errorResponse("Please choose a future appointment date and time", 400); if (!ObjectId.isValid(data.petId)) return errorResponse("Invalid pet", 400); const client = await getClientPromise(); const pet = await collection(client, "pets").findOne({ _id: new ObjectId(data.petId), ownerId: session.id }); if (!pet) return errorResponse("Selected pet was not found", 404); const appointment = createDocument({ ...data, ownerId: session.id, ownerName: session.name, status: "Booked" }); const result = await collection(client, "appointments").insertOne(appointment); return successResponse({ appointment: await collection(client, "appointments").findOne({ _id: result.insertedId }) }, 201); }
  catch (e) { printExceptionLog("POST appointment", e); return errorResponse("Could not create appointment", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
