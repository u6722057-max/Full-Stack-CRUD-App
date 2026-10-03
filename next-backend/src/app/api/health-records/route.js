import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument } from "@/lib/petcare-api";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(request) {
  const session = getSession(request); if (!session) return errorResponse("Please sign in to view health records", 401);
  try { const petId = new URL(request.url).searchParams.get("petId"); const client = await getClientPromise(); return successResponse({ healthRecords: await collection(client, "healthRecords").find({ ownerId: session.id, ...(petId ? { petId } : {}) }).sort({ recordDate: -1 }).toArray() }); }
  catch (e) { printExceptionLog("GET health records", e); return errorResponse("Could not load health records", 500); }
}
export async function POST(request) { const session = getSession(request); if (!session) return errorResponse("Please sign in to add a health record", 401); try { const data = await request.json(); const missing = ["petId", "type", "title", "recordDate"].filter(key => !String(data[key] || "").trim()); if (missing.length) return errorResponse(`Missing required fields: ${missing.join(", ")}`, 400); if (!ObjectId.isValid(data.petId)) return errorResponse("Invalid pet", 400); const client = await getClientPromise(); const pet = await collection(client, "pets").findOne({ _id: new ObjectId(data.petId), ownerId: session.id }); if (!pet) return errorResponse("Pet not found", 404); const record = createDocument({ ...data, ownerId: session.id, petName: pet.name }); const result = await collection(client, "healthRecords").insertOne(record); return successResponse({ healthRecord: await collection(client, "healthRecords").findOne({ _id: result.insertedId }) }, 201); } catch (e) { printExceptionLog("POST health record", e); return errorResponse("Could not create health record", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
