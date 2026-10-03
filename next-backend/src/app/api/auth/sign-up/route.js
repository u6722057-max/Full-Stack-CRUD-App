import { getClientPromise } from "@/lib/mongodb";
import { collection, createDocument, required } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { adminEmail, hashPassword, publicUser, sessionResponse } from "@/lib/auth";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function POST(request) {
  try {
    const data = await request.json();
    const error = required(data, ["name", "email", "password", "phone", "gender"]);
    if (error) return errorResponse(error, 400);
    if (data.password.length < 8) return errorResponse("Password must be at least 8 characters", 400);
    if (!["Female", "Male"].includes(data.gender)) return errorResponse("Choose Female or Male", 400);
    const users = collection(await getClientPromise(), "users");
    const email = data.email.trim().toLowerCase();
    if (await users.findOne({ email })) return errorResponse("An account already uses this email", 409);
    const user = createDocument({ name: data.name.trim(), email, phone: data.phone.trim(), gender: data.gender, passwordHash: hashPassword(data.password), role: email === adminEmail() ? "admin" : "user" });
    const result = await users.insertOne(user);
    user._id = result.insertedId;
    return sessionResponse({ user: publicUser(user) }, user);
  } catch (error) { printExceptionLog("POST sign-up", error); return errorResponse("Could not create account", 500); }
}
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
