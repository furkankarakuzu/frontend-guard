import React from "react";
import { GuardError } from "@frontend-guard-org/core";
import { useGuardContext } from "./GuardContext";

type Props = {
  fallback?: (error: GuardError) => React.ReactNode;
  children: React.ReactNode;
};

type State = {
  error: GuardError | null;
};

export class GuardErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    if (error instanceof GuardError) {
      return { error };
    }

    return {
      error: new GuardError({
        message: "Unhandled error",
        cause: error,
      }),
    };
  }

  render() {
    const { error } = this.state;
    const ctx = this.context as ReturnType<typeof useGuardContext>;

    if (error) {
      const fallback = this.props.fallback ?? ctx?.fallback ?? (() => null);

      return <>{fallback(error)}</>;
    }

    return this.props.children;
  }
}

GuardErrorBoundary.contextType = React.createContext(null);
