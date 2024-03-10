import { server } from "@passwordless-id/webauthn";
import { CredentialKey } from "@passwordless-id/webauthn/dist/esm/types";
import { KeyGen } from "~/src/storage";
import { AuthenticateBody } from "~/src/types";
import { generateJWT, getAuthCookie } from "~/src/auth";

export default defineEventHandler(async (event) => {
  const body: AuthenticateBody = await readBody(event);
  const origin = event.context.cloudflare.env.ORIGIN;
  const { challenge, username } = body;
  const challengeKey = KeyGen.challenge(challenge);

  const validChallenge = await event.context.cloudflare.env.KV.get(
    challengeKey
  );

  if (!validChallenge) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid challenge",
    });
  }
  event.context.cloudflare.env.KV.delete(challengeKey);

  const credentialStr = await event.context.cloudflare.env.KV.get(
    KeyGen.credential(username)
  );

  const credential = JSON.parse(credentialStr || "") as CredentialKey;

  if (!credential) {
    throw createError({
      statusCode: 404,
      statusMessage: "Credential not found",
    });
  }

  const auth = await server.verifyAuthentication(
    body.authentication,
    credential,
    {
      challenge,
      origin,
      userVerified: true,
    }
  );

  const jwt = await generateJWT(event)(username);
  event.node.res.setHeader("Set-Cookie", getAuthCookie(jwt));

  return { message: "ok", auth };
});
