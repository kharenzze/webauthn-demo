import type { RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types";

export interface RegisterBody {
  challenge: string;
  registration: RegistrationEncoded;
}
