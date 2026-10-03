import { getClientPromise } from "@/lib/mongodb";
import { deleteResource, getResource, updateResource } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function GET(_, { params }) { try { const { pet_id } = await params; return getResource(await getClientPromise(), "pets", pet_id); } catch (e) { printExceptionLog("GET pet", e); return errorResponse("Could not load pet", 500); } }
export async function PUT(request, { params }) { try { const { pet_id } = await params; return updateResource(await getClientPromise(), "pets", pet_id, await request.json(), ["name", "species"]); } catch (e) { printExceptionLog("PUT pet", e); return errorResponse("Could not update pet", 500); } }
export async function DELETE(_, { params }) { try { const { pet_id } = await params; return deleteResource(await getClientPromise(), "pets", pet_id); } catch (e) { printExceptionLog("DELETE pet", e); return errorResponse("Could not delete pet", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
