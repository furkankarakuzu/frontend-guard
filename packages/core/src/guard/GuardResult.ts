import type { GuardError } from "../error/GuardError";

export type GuardResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: GuardError };
