import type { GuardResult } from "./GuardResult";
import { normalizeError } from "./normalizeError";

export async function guard<T>(
  fn: () => T | Promise<T>
): Promise<GuardResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: normalizeError(error),
    };
  }
}
