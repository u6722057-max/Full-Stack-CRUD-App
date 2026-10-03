import { getClientPromise } from "@/lib/mongodb";
import { deleteResource, getResource, updateResource } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(_, { params }) { try { const { record_id } = await params; return getResource(await getClientPromise(), "healthRecords", record_id); } catch (e) { printExceptionLog("GET health record", e); return errorResponse("Could not load health record", 500); } }
export async function PUT(request, { params }) { try { const { record_id } = await params; return updateResource(await getClientPromise(), "healthRecords", record_id, await request.json(), ["petId", "type", "title", "recordDate"]); } catch (e) { printExceptionLog("PUT health record", e); return errorResponse("Could not update health record", 500); } }
export async function DELETE(_, { params }) { try { const { record_id } = await params; return deleteResource(await getClientPromise(), "healthRecords", record_id); } catch (e) { printExceptionLog("DELETE health record", e); return errorResponse("Could not delete health record", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
