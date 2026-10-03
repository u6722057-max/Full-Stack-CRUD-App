import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

function guard(request) { return isAdmin(getSession(request)); }
function valid(time) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(time)); }
export async function GET(request) { if (!guard(request)) return errorResponse("Administrator access required", 403); try { const slots = collection(await getClientPromise(), "timeSlots"); let timeSlots = await slots.find({}).sort({ time: 1 }).toArray(); if (!timeSlots.length) { await slots.insertMany(["09:30", "10:30", "11:30", "13:30", "15:30", "17:30"].map(time => createDocument({ time, active: true }))); timeSlots = await slots.find({}).sort({ time: 1 }).toArray(); } return successResponse({ timeSlots }); } catch { return errorResponse("Could not load time slots", 500); } }
export async function POST(request) { if (!guard(request)) return errorResponse("Administrator access required", 403); try { const { time } = await request.json(); if (!valid(time)) return errorResponse("Use time format HH:MM", 400); const slots = collection(await getClientPromise(), "timeSlots"); if (await slots.findOne({ time })) return errorResponse("This time slot already exists", 409); const result = await slots.insertOne(createDocument({ time, active: true })); return successResponse({ timeSlot: await slots.findOne({ _id: result.insertedId }) }, 201); } catch { return errorResponse("Could not add time slot", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
