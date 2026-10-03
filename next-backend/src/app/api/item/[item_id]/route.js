import { getClientPromise } from "@/lib/mongodb";
import corsHeaders from "@/lib/cors";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const DELETED_STATUS = "DELETED";

function getItemCollection(client) {
  const db = client.db(process.env.DB_NAME || "sample_mflix");
  return db.collection("item");
}

function parseObjectId(itemId) {
  if (!ObjectId.isValid(itemId)) {
    return null;
  }

  return new ObjectId(itemId);
}

export async function GET(request, { params }) {
  const { item_id } = await params;
  const itemObjectId = parseObjectId(item_id);

  if (!itemObjectId) {
    return errorResponse("Invalid item id", 400);
  }

  try {
    const client = await getClientPromise();
    const item = await getItemCollection(client).findOne({
      _id: itemObjectId,
      status: { $ne: DELETED_STATUS },
    });

    if (!item) {
      return errorResponse("Item not found", 404);
    }

    return successResponse({ item });
  } catch (error) {
    printExceptionLog("GET Item", error);
    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function PUT(request, { params }) {
  const { item_id } = await params;
  const itemObjectId = parseObjectId(item_id);

  if (!itemObjectId) {
    return errorResponse("Invalid item id", 400);
  }

  try {
    const data = await request.json();
    const client = await getClientPromise();
    const updateResult = await getItemCollection(client).updateOne(
      { _id: itemObjectId, status: { $ne: DELETED_STATUS } },
      {
        $set: {
          name: data.name,
          category: data.category,
          price: data.price,
          amount: data.amount,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return errorResponse("Item not found", 404);
    }

    return successResponse({ message: "Item update success" });
  } catch (error) {
    printExceptionLog("PUT Item", error);
    return errorResponse("PUT Item Internal Error", 500);
  }
}

export async function DELETE(request, { params }) {
  const { item_id } = await params;
  const itemObjectId = parseObjectId(item_id);

  if (!itemObjectId) {
    return errorResponse("Invalid item id", 400);
  }

  try {
    const client = await getClientPromise();
    const updateResult = await getItemCollection(client).updateOne(
      { _id: itemObjectId, status: { $ne: DELETED_STATUS } },
      { $set: { status: DELETED_STATUS, deletedAt: new Date() } },
    );

    if (updateResult.matchedCount === 0) {
      return errorResponse("Item not found", 404);
    }

    return successResponse({ message: "Delete Success" });
  } catch (error) {
    printExceptionLog("DELETE Item", error);
    return errorResponse("DELETE Item Internal Error", 500);
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
