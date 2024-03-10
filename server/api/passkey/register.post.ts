import { server } from "@passwordless-id/webauthn";
import { generateJWT, getAuthCookie } from "~/src/auth";
import { KeyGen } from "~/src/storage";
import { RegisterBody } from "~/src/types";

export default defineEventHandler(async (event) => {
  const body: RegisterBody = await readBody(event);
  const origin = event.context.cloudflare.env.ORIGIN;
  const challenge = body.challenge;
  const key = KeyGen.challenge(challenge);

  const validChallenge = await event.context.cloudflare.env.KV.get(key);
  if (!validChallenge) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid challenge",
    });
  }
  await event.context.cloudflare.env.KV.delete(key);

  const registration = await server.verifyRegistration(body.registration, {
    origin,
    challenge,
  });

  const username = registration.username;

  await event.context.cloudflare.env.KV.put(
    KeyGen.credential(username),
    JSON.stringify(registration.credential),
    {
      expirationTtl: 60 * 60, //secs
    }
  );

  const jwt = await generateJWT(event)(username);
  event.node.res.setHeader("Set-Cookie", getAuthCookie(jwt));

  return { message: "ok", registration };
});
