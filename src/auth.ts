import { SignJWT, jwtVerify } from "jose";
import type { ReqEvent } from "./types";

const getSecret = (evt: ReqEvent) =>
  new TextEncoder().encode(evt.context.cloudflare.env.JWT_SECRET);

export interface SessionPayload {
  username: string;
}

export const generateJWT = (evt: ReqEvent) => async (username: string) => {
  const jwt = await new SignJWT({
    username,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5min")
    .sign(getSecret(evt));

  return jwt;
};

export const verifyJWT = (evt: ReqEvent) => async (jwt: string) => {
  try {
    const { payload } = await jwtVerify<SessionPayload>(jwt, getSecret(evt));
    return payload;
  } catch (err) {
    return undefined;
  }
};

export const getAuthCookie = (jwt: string) => {
  return `x-auth=${jwt}; Path=/; Max-Age=300; SameSite=strict; Secure; HttpOnly;`;
};
