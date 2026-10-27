/**
 * On-demand revalidation, called by the admin panel after a save.
 * Security: requires a Firebase ID token. The token signature is verified against Google's
 * public keys, then the caller's admin record is read from Firestore *as that user* — so the
 * same Security Rules that protect admin data decide whether the request is allowed.
 * No service-account credentials are needed or stored.
 */
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";
import { firebaseConfig, isFirebaseConfigured, useEmulators } from "@/lib/firebase/config";
import { restGetAsUser } from "@/lib/firebase/rest";

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

export async function POST(req: Request) {
  if (!isFirebaseConfigured) return NextResponse.json({ ok: false, error: "Firebase not configured" }, { status: 503 });
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 401 });

  let uid = "";
  try {
    if (useEmulators) {
      uid = String(decodeJwt(token).user_id ?? decodeJwt(token).sub ?? ""); // emulator tokens are unsigned
    } else {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
        audience: firebaseConfig.projectId,
      });
      uid = String(payload.sub ?? "");
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
  if (!uid) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

  const admin = await restGetAsUser(`admins/${uid}`, token);
  if (!admin || admin.active !== true) return NextResponse.json({ ok: false, error: "Not an administrator" }, { status: 403 });

  revalidateTag("content");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
