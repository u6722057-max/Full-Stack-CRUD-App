import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

const env = fs.readFileSync(path.resolve(".env.local"), "utf8");
const uri = env.match(/^MONGODB_URI=(.+)$/m)?.[1]?.trim();
const dbName = env.match(/^DB_NAME=(.+)$/m)?.[1]?.trim() || "petcare";
if (!uri) throw new Error("MONGODB_URI is missing from .env.local");

const email = "admin@petcare.local";
const password = "admin123";
const salt = crypto.randomBytes(16).toString("base64url");
const passwordHash = `${salt}:${crypto.scryptSync(password, salt, 64).toString("base64url")}`;

const client = new MongoClient(uri);
await client.connect();
await client.db(dbName).collection("users").updateOne(
  { email },
  {
    $set: { name: "admin", email, role: "admin", passwordHash, updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true },
);
await client.close();
console.log("Admin account is ready.");
