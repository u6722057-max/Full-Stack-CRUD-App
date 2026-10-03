import { getClientPromise } from "@/lib/mongodb";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import corsHeaders from "@/lib/cors";
import { NextResponse } from "next/server";

const ACTIVE_STATUS = "ACTIVE";
const DELETED_STATUS = "DELETED";

function getItemCollection(client) {
  const db = client.db(process.env.DB_NAME || "sample_mflix");
  return db.collection("item");
}

export async function GET() {
  try {
    const client = await getClientPromise();
    const itemList = await getItemCollection(client)
      .find({ status: { $ne: DELETED_STATUS } })
      .toArray();

    return successResponse({ itemList });
  } catch (error) {
    printExceptionLog("GET Items", error);
    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await getClientPromise();
    const insertResult = await getItemCollection(client).insertOne({
      name: data.name,
      category: data.category,
      price: data.price,
      amount: data.amount,
      status: ACTIVE_STATUS,
    });

    return successResponse({ id: insertResult.insertedId }, 201);
  } catch (error) {
    printExceptionLog("POST Items", error);
    return errorResponse("POST Item Internal Error", 500);
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
