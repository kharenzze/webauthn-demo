import { KeyGen } from "~/src/storage";

export default defineEventHandler(async (event) => {
  const challenge = crypto.randomUUID();
  const key = KeyGen.challenge(challenge);
  await event.context.cloudflare.env.KV.put(key, "true", {
    expirationTtl: 60, //seconds
  });
  return { challenge };
});
