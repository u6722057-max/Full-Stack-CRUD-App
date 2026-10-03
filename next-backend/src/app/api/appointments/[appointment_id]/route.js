import { getClientPromise } from "@/lib/mongodb";
import { deleteResource, getResource, updateResource } from "@/lib/petcare-api";
import { errorResponse, printExceptionLog } from "@/lib/utils";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
import { getSession } from "@/lib/auth";

export async function GET(_, { params }) { try { const { appointment_id } = await params; return getResource(await getClientPromise(), "appointments", appointment_id); } catch (e) { printExceptionLog("GET appointment", e); return errorResponse("Could not load appointment", 500); } }
export async function PUT(request, { params }) { try { const { appointment_id } = await params; return updateResource(await getClientPromise(), "appointments", appointment_id, await request.json(), ["petId", "clinicName", "startsAt", "reason"]); } catch (e) { printExceptionLog("PUT appointment", e); return errorResponse("Could not update appointment", 500); } }
export async function DELETE(request, { params }) { const session = getSession(request); if (!session) return errorResponse("Please sign in", 401); try { const { appointment_id } = await params; const client = await getClientPromise(); const appointment = await getResource(client, "appointments", appointment_id); if (appointment.status !== 200) return appointment; const body = await appointment.json(); if (body.appointment.ownerId !== session.id) return errorResponse("You can only cancel your own appointment", 403); return deleteResource(client, "appointments", appointment_id); } catch (e) { printExceptionLog("DELETE appointment", e); return errorResponse("Could not cancel appointment", 500); } }
export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
