import { verifyJWT, type SessionPayload } from "~/src/auth";
import type { Opt } from "~/src/types";

export const useJWTSession = async () => {
  const session = useState<Opt<SessionPayload>>("session");
  if (process.server) {
    const jwt = useCookie("x-auth");
    const evt = useRequestEvent();
    await callOnce(async () => {
      if (jwt.value && evt) {
        session.value = await verifyJWT(evt)(jwt.value);
      }
    });
  }
  return session;
};
