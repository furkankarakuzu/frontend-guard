import { GuardError } from "../error/GuardError";

export function normalizeError(error: unknown): GuardError {
  if (error instanceof GuardError) {
    return error;
  }

  if (error instanceof Error) {
    return new GuardError({
      message: error.message,
      cause: error,
    });
  }

  return new GuardError({
    message: "Unknown error",
    cause: error,
  });
}
