import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const DELETED_STATUS = "DELETED";

function getCommentsCollection(client) {
  return client.db("sample_mflix").collection("comments");
}

function getObjectId(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

export async function GET() {
  try {
    const client = await getClientPromise();
    const result = await getCommentsCollection(client)
      .find({ status: { $ne: DELETED_STATUS } })
      .skip(0)
      .limit(10)
      .toArray();

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error("MongoDB test route failed:", error);
    return NextResponse.json(
      { error: "Unable to retrieve MongoDB comments." },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(request) {
  try {
    const id = getObjectId(request);

    if (!id) {
      return NextResponse.json(
        { error: "A valid item id is required." },
        { status: 400, headers: corsHeaders },
      );
    }

    const client = await getClientPromise();
    const result = await getCommentsCollection(client).updateOne(
      { _id: id, status: { $ne: DELETED_STATUS } },
      { $set: { status: DELETED_STATUS, deletedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Item not found." },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { message: "Item deleted successfully." },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("MongoDB delete route failed:", error);
    return NextResponse.json(
      { error: "Unable to delete MongoDB comment." },
      { status: 500, headers: corsHeaders },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
