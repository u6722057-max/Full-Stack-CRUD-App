import { getClientPromise } from "@/lib/mongodb";
import { collection, objectId } from "@/lib/petcare-api";
import { getSession, isAdmin } from "@/lib/auth";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

async function id(params) { const { doctor_id } = await params; return objectId(doctor_id); }
function guard(request) { return isAdmin(getSession(request)); }
export async function PUT(request, { params }) { if (!guard(request)) return errorResponse("Administrator access required", 403); const _id = await id(params); if (!_id) return errorResponse("Invalid doctor id", 400); try { const data = await request.json(); if (data.rating !== undefined && (Number.isNaN(Number(data.rating)) || Number(data.rating) < 0 || Number(data.rating) > 5)) return errorResponse("Rating must be from 0.0 to 5.0", 400); const update = { updatedAt: new Date() }; for (const key of ["name", "clinicName", "specialty", "gender", "rating", "availableHours", "photoUrl"]) if (String(data[key] || "").trim()) update[key] = String(data[key]).trim(); const doctor = await collection(await getClientPromise(), "doctors").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" }); return doctor ? successResponse({ doctor }) : errorResponse("Doctor not found", 404); } catch (error) { printExceptionLog("PUT admin doctor", error); return errorResponse("Could not update doctor", 500); } }
export async function DELETE(request, { params }) { if (!guard(request)) return errorResponse("Administrator access required", 403); const _id = await id(params); if (!_id) return errorResponse("Invalid doctor id", 400); try { const result = await collection(await getClientPromise(), "doctors").deleteOne({ _id }); return result.deletedCount ? successResponse({ message: "Doctor deleted" }) : errorResponse("Doctor not found", 404); } catch (error) { printExceptionLog("DELETE admin doctor", error); return errorResponse("Could not delete doctor", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
