import { guard } from "@frontend-guard-org/core";

export function useGuard() {
  return { run: guard };
}
