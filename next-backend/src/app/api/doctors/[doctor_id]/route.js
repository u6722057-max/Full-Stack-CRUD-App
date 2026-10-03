import { getClientPromise } from "@/lib/mongodb";
import { deleteResource, getResource, updateResource } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(_, { params }) { try { const { doctor_id } = await params; return getResource(await getClientPromise(), "doctors", doctor_id); } catch (error) { printExceptionLog("GET doctor", error); return errorResponse("Could not load doctor", 500); } }
export async function PUT(request, { params }) { try { const { doctor_id } = await params; return updateResource(await getClientPromise(), "doctors", doctor_id, await request.json(), ["name", "clinicName", "specialty"]); } catch (error) { printExceptionLog("PUT doctor", error); return errorResponse("Could not update doctor", 500); } }
export async function DELETE(_, { params }) { try { const { doctor_id } = await params; return deleteResource(await getClientPromise(), "doctors", doctor_id); } catch (error) { printExceptionLog("DELETE doctor", error); return errorResponse("Could not delete doctor", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
