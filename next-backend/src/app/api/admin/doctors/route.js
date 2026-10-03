import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument, required } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

function guard(request) { return isAdmin(getSession(request)); }
export async function GET(request) { if (!guard(request)) return errorResponse("Administrator access required", 403); try { return successResponse({ doctors: await collection(await getClientPromise(), "doctors").find({}).sort({ createdAt: -1 }).toArray() }); } catch (error) { printExceptionLog("GET admin doctors", error); return errorResponse("Could not load doctors", 500); } }
export async function POST(request) { if (!guard(request)) return errorResponse("Administrator access required", 403); try { const data = await request.json(); const message = required(data, ["name", "clinicName", "specialty"]); if (message) return errorResponse(message, 400); if (data.rating !== undefined && (Number.isNaN(Number(data.rating)) || Number(data.rating) < 0 || Number(data.rating) > 5)) return errorResponse("Rating must be from 0.0 to 5.0", 400); const result = await collection(await getClientPromise(), "doctors").insertOne(createDocument(data)); return successResponse({ doctor: await collection(await getClientPromise(), "doctors").findOne({ _id: result.insertedId }) }, 201); } catch (error) { printExceptionLog("POST admin doctor", error); return errorResponse("Could not create doctor", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
