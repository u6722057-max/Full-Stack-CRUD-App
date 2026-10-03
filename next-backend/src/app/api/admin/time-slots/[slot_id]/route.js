import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

function guard(request) { return isAdmin(getSession(request)); }
function valid(time) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(time)); }
async function id(params) { const { slot_id } = await params; return ObjectId.isValid(slot_id) ? new ObjectId(slot_id) : null; }
export async function PUT(request, { params }) { if (!guard(request)) return errorResponse("Administrator access required", 403); const _id = await id(params); if (!_id) return errorResponse("Invalid time slot", 400); try { const { time, active } = await request.json(); const update = { updatedAt: new Date() }; if (time !== undefined) { if (!valid(time)) return errorResponse("Use time format HH:MM", 400); update.time = time; } if (active !== undefined) update.active = Boolean(active); const slot = await collection(await getClientPromise(), "timeSlots").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" }); return slot ? successResponse({ timeSlot: slot }) : errorResponse("Time slot not found", 404); } catch { return errorResponse("Could not update time slot", 500); } }
export async function DELETE(request, { params }) { if (!guard(request)) return errorResponse("Administrator access required", 403); const _id = await id(params); if (!_id) return errorResponse("Invalid time slot", 400); try { const result = await collection(await getClientPromise(), "timeSlots").deleteOne({ _id }); return result.deletedCount ? successResponse({ message: "Time slot deleted" }) : errorResponse("Time slot not found", 404); } catch { return errorResponse("Could not delete time slot", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
