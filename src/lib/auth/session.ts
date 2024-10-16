import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const KEY = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

type SessionData = {
  user: {
    id: number;
  };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(KEY);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, KEY, {
    algorithms: ["HS256"],
  });

  return payload as SessionData;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) {
    return null;
  }

  return await verifyToken(session);
}

export async function setSession(user: any): Promise<void> {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1_000);
  const session: SessionData = {
    user: {
      id: user.id,
    },
    expires: expiresInOneDay.toISOString(),
  };

  const encryptedSession = await signToken(session);

  cookies().set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
