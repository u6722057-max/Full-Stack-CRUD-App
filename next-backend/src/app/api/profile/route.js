import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { getSession, publicUser } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

function sessionUser(request) { const session = getSession(request); return session?.id && ObjectId.isValid(session.id) ? session : null; }

export async function GET(request) {
  const session = sessionUser(request); if (!session) return errorResponse("Please sign in", 401);
  try { const user = await collection(await getClientPromise(), "users").findOne({ _id: new ObjectId(session.id) }); return user ? successResponse({ user: publicUser(user) }) : errorResponse("User not found", 404); }
  catch (error) { printExceptionLog("GET profile", error); return errorResponse("Could not load profile", 500); }
}

export async function PUT(request) {
  const session = sessionUser(request); if (!session) return errorResponse("Please sign in", 401);
  try { const data = await request.json(); const update = { updatedAt: new Date() }; if (String(data.name || "").trim()) update.name = data.name.trim(); if (String(data.email || "").trim()) update.email = data.email.trim().toLowerCase(); if (data.phone !== undefined) update.phone = String(data.phone).trim(); if (["Female", "Male"].includes(data.gender)) update.gender = data.gender; if (data.photoUrl !== undefined) update.photoUrl = String(data.photoUrl).trim(); const users = collection(await getClientPromise(), "users"); if (update.email) { const used = await users.findOne({ email: update.email, _id: { $ne: new ObjectId(session.id) } }); if (used) return errorResponse("That email is already in use", 409); } const user = await users.findOneAndUpdate({ _id: new ObjectId(session.id) }, { $set: update }, { returnDocument: "after" }); return user ? successResponse({ user: publicUser(user) }) : errorResponse("User not found", 404); }
  catch (error) { printExceptionLog("PUT profile", error); return errorResponse("Could not update profile", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
