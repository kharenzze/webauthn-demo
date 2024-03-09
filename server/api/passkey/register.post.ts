import { server } from "@passwordless-id/webauthn";
import { RegisterBody } from "~/src/types";

export default defineEventHandler(async (event) => {
  const body: RegisterBody = await readBody(event);
  const origin = event.context.cloudflare.env.ORIGIN;
  const challenge = body.challenge;
  const key = "challenge-" + challenge;

  const validChallenge = await event.context.cloudflare.env.KV.get(key);
  if (!validChallenge) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid challenge",
    });
  }
  event.context.cloudflare.env.KV.delete(key);

  const registration = await server.verifyRegistration(body.registration, {
    origin,
    challenge,
  });

  const username = registration.username;

  await event.context.cloudflare.env.KV.put(
    "auth-" + username,
    JSON.stringify(registration.credential),
    {
      expirationTtl: 60 * 5, //secs
    }
  );

  return { message: "ok" };
  // ... Do whatever you want here
});
