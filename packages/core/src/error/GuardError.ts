import type { GuardErrorCode } from "./GuardErrorCode";

export class GuardError extends Error {
  readonly code: GuardErrorCode;
  readonly cause?: unknown;
  readonly meta?: Record<string, unknown>;

  constructor(params: {
    message: string;
    code?: GuardErrorCode;
    cause?: unknown;
    meta?: Record<string, unknown>;
  }) {
    super(params.message);

    this.name = "GuardError";
    this.code = params.code ?? "UNKNOWN";
    this.cause = params.cause;
    this.meta = params.meta;

    // Fix prototype chain (important for instanceof)
    Object.setPrototypeOf(this, GuardError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      meta: this.meta,
    };
  }
}
