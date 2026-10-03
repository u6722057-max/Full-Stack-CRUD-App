import { getClientPromise } from "@/lib/mongodb";
import { createResource, listDocuments } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET() { try { return successResponse({ doctors: await listDocuments(await getClientPromise(), "doctors") }); } catch (error) { printExceptionLog("GET doctors", error); return errorResponse("Could not load doctors", 500); } }
export async function POST(request) { try { return createResource(await getClientPromise(), "doctors", await request.json(), ["name", "clinicName", "specialty"]); } catch (error) { printExceptionLog("POST doctor", error); return errorResponse("Could not create doctor", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
