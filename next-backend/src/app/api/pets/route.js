import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument } from "@/lib/petcare-api";
import { getSession } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(request) {
  const session = getSession(request);
  if (!session) return errorResponse("Please sign in to view pets", 401);
  try {
    const client = await getClientPromise();
    return successResponse({ pets: await collection(client, "pets").find({ ownerId: session.id }).sort({ createdAt: -1 }).toArray() });
  } catch (error) { printExceptionLog("GET pets", error); return errorResponse("Could not load pets", 500); }
}
export async function POST(request) {
  const session = getSession(request);
  if (!session) return errorResponse("Please sign in to add a pet", 401);
  try { const data = await request.json(); if (!String(data.name || "").trim() || !String(data.species || "").trim()) return errorResponse("Pet name and species are required", 400); const client = await getClientPromise(); const result = await collection(client, "pets").insertOne(createDocument({ ...data, name: data.name.trim(), species: data.species.trim(), ownerId: session.id, ownerName: session.name })); return successResponse({ pet: await collection(client, "pets").findOne({ _id: result.insertedId }) }, 201); }
  catch (error) { printExceptionLog("POST pet", error); return errorResponse("Could not create pet", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
