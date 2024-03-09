import type {
  AuthenticationEncoded,
  RegistrationEncoded,
} from "@passwordless-id/webauthn/dist/esm/types";

export interface RegisterBody {
  challenge: string;
  registration: RegistrationEncoded;
}

export interface AuthenticateBody {
  challenge: string;
  authentication: AuthenticationEncoded;
  username: string;
}
