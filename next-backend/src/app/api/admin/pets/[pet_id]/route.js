import { getClientPromise } from "@/lib/mongodb";
import { collection, objectId } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

async function id(params) { const { pet_id } = await params; return objectId(pet_id); }
function guard(request) { return isAdmin(getSession(request)); }
export async function PUT(request, { params }) {
  if (!guard(request)) return errorResponse("Administrator access required", 403);
  const _id = await id(params); if (!_id) return errorResponse("Invalid pet id", 400);
  try { const data = await request.json(); const update = { updatedAt: new Date() }; for (const key of ["name", "species", "age", "weight", "color", "sex", "photoUrl"]) if (String(data[key] || "").trim()) update[key] = String(data[key]).trim(); const pet = await collection(await getClientPromise(), "pets").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" }); return pet ? successResponse({ pet }) : errorResponse("Pet not found", 404); }
  catch (error) { printExceptionLog("PUT admin pet", error); return errorResponse("Could not update pet", 500); }
}
export async function DELETE(request, { params }) {
  if (!guard(request)) return errorResponse("Administrator access required", 403);
  const _id = await id(params); if (!_id) return errorResponse("Invalid pet id", 400);
  try { const result = await collection(await getClientPromise(), "pets").deleteOne({ _id }); return result.deletedCount ? successResponse({ message: "Pet deleted" }) : errorResponse("Pet not found", 404); }
  catch (error) { printExceptionLog("DELETE admin pet", error); return errorResponse("Could not delete pet", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
