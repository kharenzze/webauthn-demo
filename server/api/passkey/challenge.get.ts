export default defineEventHandler(async (event) => {
  const challenge = crypto.randomUUID();
  const key = "challenge-" + challenge;
  event.context.cloudflare.env.KV.put(challenge, "true", {
    expirationTtl: 60, //seconds
  });
  return { challenge };
});
