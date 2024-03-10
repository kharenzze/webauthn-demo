import { verifyJWT, type SessionPayload } from "~/src/auth";

export const useJWTSession = async () => {
  const session = useState<SessionPayload | undefined>("session");
  if (process.server) {
    const jwt = useCookie("x-auth");
    console.log("coo", jwt.value);
    const evt = useRequestEvent();
    await callOnce(async () => {
      if (!jwt.value || !evt) {
        return undefined;
      }
      session.value = await verifyJWT(evt)(jwt.value);
    });
  }
  return session;
};
