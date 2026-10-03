import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "./utils";

export function getDatabase(client) {
  return client.db(process.env.DB_NAME || "petcare");
}

export function collection(client, name) {
  return getDatabase(client).collection(name);
}

export function objectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export function idError() {
  return errorResponse("Invalid resource id", 400);
}

export function required(data, fields) {
  const missing = fields.filter((field) => !String(data[field] || "").trim());
  return missing.length ? `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}` : null;
}

export function createDocument(data) {
  return { ...data, createdAt: new Date(), updatedAt: new Date() };
}

export async function listDocuments(client, name, query = {}) {
  return collection(client, name).find(query).sort({ createdAt: -1 }).toArray();
}

export async function createResource(client, name, data, fields) {
  const message = required(data, fields);
  if (message) return errorResponse(message, 400);
  const result = await collection(client, name).insertOne(createDocument(data));
  const document = await collection(client, name).findOne({ _id: result.insertedId });
  return successResponse({ [name.slice(0, -1)]: document }, 201);
}

export async function getResource(client, name, id) {
  const _id = objectId(id);
  if (!_id) return idError();
  const document = await collection(client, name).findOne({ _id });
  return document ? successResponse({ [name.slice(0, -1)]: document }) : errorResponse("Resource not found", 404);
}

export async function updateResource(client, name, id, data, fields) {
  const _id = objectId(id);
  if (!_id) return idError();
  const message = required(data, fields);
  if (message) return errorResponse(message, 400);
  const result = await collection(client, name).findOneAndUpdate(
    { _id },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return result ? successResponse({ [name.slice(0, -1)]: result }) : errorResponse("Resource not found", 404);
}

export async function deleteResource(client, name, id) {
  const _id = objectId(id);
  if (!_id) return idError();
  const result = await collection(client, name).deleteOne({ _id });
  return result.deletedCount ? successResponse({ message: "Resource deleted" }) : errorResponse("Resource not found", 404);
}
