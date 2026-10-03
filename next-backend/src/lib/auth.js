import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { collection } from "./petcare-api";
import corsHeaders from "./cors";

const SESSION_COOKIE = "petcare_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value && process.env.NODE_ENV !== "production") {
    return "petcare-local-development-session-secret-change-before-deployment";
  }
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long");
  }
  return value;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  const [salt, storedHash] = String(storedValue || "").split(":");
  if (!salt || !storedHash) return false;
  const calculated = crypto.scryptSync(password, salt, 64).toString("base64url");
  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(storedHash));
}

export function createSession(user) {
  const payload = Buffer.from(JSON.stringify({ id: user._id.toString(), name: user.name, email: user.email, role: user.role || "user", exp: Date.now() + SESSION_LIFETIME_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getSession(request) {
  const value = request.cookies.get(SESSION_COOKIE)?.value || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expectedSignature = sign(payload);
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.exp > Date.now() ? session : null;
  } catch { return null; }
}

export function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone || "", gender: user.gender || "Female", photoUrl: user.photoUrl || "", role: user.role || "user", createdAt: user.createdAt };
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
}

export function isAdmin(session) {
  return session?.role === "admin";
}

export function sessionResponse(data, user) {
  const token = createSession(user);
  const response = NextResponse.json({ ...data, sessionToken: token }, { headers: corsHeaders });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: SESSION_LIFETIME_SECONDS,
    path: "/",
  });
  return response;
}

export function logoutResponse() {
  const response = NextResponse.json({ message: "Signed out" }, { headers: corsHeaders });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "none", secure: true, maxAge: 0, path: "/" });
  return response;
}
