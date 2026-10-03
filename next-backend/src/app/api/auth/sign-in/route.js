import { getClientPromise } from "@/lib/mongodb";
import { collection, required } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { adminEmail, publicUser, sessionResponse, verifyPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function POST(request) {
  try {
    const data = await request.json();
    const error = required(data, ["email", "password"]);
    if (error) return errorResponse(error, 400);
    const user = await collection(await getClientPromise(), "users").findOne({ email: data.email.trim().toLowerCase() });
    if (!user || !verifyPassword(data.password, user.passwordHash)) return errorResponse("Invalid email or password", 401);
    if (user.email === adminEmail() && user.role !== "admin") {
      user.role = "admin";
      await collection(await getClientPromise(), "users").updateOne({ _id: user._id }, { $set: { role: "admin", updatedAt: new Date() } });
    }
    return sessionResponse({ user: publicUser(user) }, user);
  } catch (error) { printExceptionLog("POST sign-in", error); return errorResponse("Could not sign in", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
