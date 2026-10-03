import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) return errorResponse("Choose an image file", 400);
    const extension = allowedTypes.get(file.type);
    if (!extension) return errorResponse("Use a JPG, PNG, or WebP image", 400);
    if (file.size > MAX_FILE_SIZE) return errorResponse("Image must be 5 MB or smaller", 400);

    const directory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(directory, { recursive: true });
    const filename = `${crypto.randomUUID()}.${extension}`;
    await fs.writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    return successResponse({ photoUrl: `/uploads/${filename}` }, 201);
  } catch (error) {
    printExceptionLog("POST upload", error);
    return errorResponse("Could not upload image", 500);
  }
}

export function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders }); }
