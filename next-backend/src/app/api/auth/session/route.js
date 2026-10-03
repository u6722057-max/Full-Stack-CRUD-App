import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";
import { collection } from "@/lib/petcare-api";
import { getSession, logoutResponse, publicUser } from "@/lib/auth";
import { errorResponse, successResponse, printExceptionLog } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(request) {
  const session = getSession(request);
  if (!session) return errorResponse("Not signed in", 401);
  if (!ObjectId.isValid(session.id)) return errorResponse("Not signed in", 401);
  try {
    const user = await collection(await getClientPromise(), "users").findOne({ _id: new ObjectId(session.id) });
    return user ? successResponse({ user: publicUser(user) }) : errorResponse("User not found", 404);
  } catch (error) {
    printExceptionLog("GET session", error);
    return errorResponse("Could not load session", 500);
  }
}
export function DELETE() { return logoutResponse(); }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
