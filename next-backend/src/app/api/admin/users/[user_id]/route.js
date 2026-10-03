import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { getSession, isAdmin, publicUser } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

function userId(value) { return ObjectId.isValid(value) ? new ObjectId(value) : null; }
function guard(request) { return isAdmin(getSession(request)); }

export async function PUT(request, { params }) {
  if (!guard(request)) return errorResponse("Administrator access required", 403);
  const { user_id } = await params; const _id = userId(user_id);
  if (!_id) return errorResponse("Invalid user id", 400);
  try {
    const data = await request.json();
    const update = { updatedAt: new Date() };
    if (String(data.name || "").trim()) update.name = data.name.trim();
    if (String(data.email || "").trim()) update.email = data.email.trim().toLowerCase();
    if (data.phone !== undefined) update.phone = String(data.phone).trim();
    if (["Female", "Male"].includes(data.gender)) update.gender = data.gender;
    if (data.photoUrl !== undefined) update.photoUrl = String(data.photoUrl).trim();
    const user = await collection(await getClientPromise(), "users").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" });
    return user ? successResponse({ user: publicUser(user) }) : errorResponse("User not found", 404);
  } catch (error) { printExceptionLog("PUT admin user", error); return errorResponse("Could not update user", 500); }
}

export async function DELETE(request, { params }) {
  if (!guard(request)) return errorResponse("Administrator access required", 403);
  const { user_id } = await params; const _id = userId(user_id);
  if (!_id) return errorResponse("Invalid user id", 400);
  const session = getSession(request);
  if (session.id === _id.toString()) return errorResponse("An administrator cannot delete their own account", 400);
  try {
    const users = collection(await getClientPromise(), "users");
    const user = await users.findOne({ _id });
    if (!user) return errorResponse("User not found", 404);
    await Promise.all([
      users.deleteOne({ _id }),
      collection(await getClientPromise(), "pets").deleteMany({ ownerId: _id.toString() }),
      collection(await getClientPromise(), "healthRecords").deleteMany({ ownerId: _id.toString() }),
      collection(await getClientPromise(), "appointments").deleteMany({ ownerId: _id.toString() }),
    ]);
    return successResponse({ message: "User and related data deleted" });
  } catch (error) { printExceptionLog("DELETE admin user", error); return errorResponse("Could not delete user", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
