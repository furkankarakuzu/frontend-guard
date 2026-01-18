"use client";

import { useState } from "react";
import {
  GuardProvider,
  GuardErrorBoundary,
  useGuard,
} from "@frontend-guard-org/react";
import { guard, createGuardError } from "@frontend-guard-org/core";
import type { GuardError, GuardResult } from "@frontend-guard-org/react";

// ============================================
// Test 1: Basic guard() usage (Core Package)
// ============================================
function BasicGuardTest() {
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const runSuccessTest = async () => {
    setStatus("loading");
    setResult(null);

    const res = await guard(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id: 1, name: "John Doe", email: "john@example.com" };
    });

    if (res.ok) {
      setStatus("success");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("error");
      setResult(`Error: ${res.error.message}`);
    }
  };

  const runErrorTest = async () => {
    setStatus("loading");
    setResult(null);

    const res = await guard(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("Failed to fetch user data");
    });

    if (res.ok) {
      setStatus("success");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("error");
      setResult(
        JSON.stringify(
          {
            code: res.error.code,
            message: res.error.message,
            name: res.error.name,
          },
          null,
          2
        )
      );
    }
  };

  return (
    <div className="card">
      <h2>
        🛡️ Basic guard() <span className="badge success">Core</span>
      </h2>
      <p>Tests the core guard() function from @frontend-guard-org/core</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="button" onClick={runSuccessTest} disabled={status === "loading"}>
          {status === "loading" ? <span className="spinner" /> : null}
          Run Success Test
        </button>
        <button className="button secondary" onClick={runErrorTest} disabled={status === "loading"}>
          Run Error Test
        </button>
      </div>
      {result && (
        <div className={`result ${status}`}>
          {result}
        </div>
      )}
    </div>
  );
}

// ============================================
// Test 2: useGuard() Hook (React Package)
// ============================================
function UseGuardHookTest() {
  const { run } = useGuard();
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fetchData = async () => {
    setStatus("loading");
    setResult(null);

    const res = await run(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        products: [
          { id: 1, name: "Widget", price: 29.99 },
          { id: 2, name: "Gadget", price: 49.99 },
        ],
        total: 2,
      };
    });

    if (res.ok) {
      setStatus("success");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("error");
      setResult(`Error: ${res.error.code} - ${res.error.message}`);
    }
  };

  return (
    <div className="card">
      <h2>
        ⚛️ useGuard() Hook <span className="badge success">React</span>
      </h2>
      <p>Tests the useGuard() hook with its run() method</p>
      <button className="button" onClick={fetchData} disabled={status === "loading"}>
        {status === "loading" ? <span className="spinner" /> : null}
        Fetch Products
      </button>
      {result && (
        <div className={`result ${status}`}>
          {result}
        </div>
      )}
    </div>
  );
}

// ============================================
// Test 3: Typed Error Codes
// ============================================
function TypedErrorTest() {
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const testNetworkError = async () => {
    setStatus("loading");
    setResult(null);

    const res = await guard(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw createGuardError("Connection refused", {
        code: "NETWORK",
        meta: { url: "/api/users", attempt: 1 },
      });
    });

    if (!res.ok) {
      setStatus("error");
      setResult(JSON.stringify(res.error.toJSON(), null, 2));
    }
  };

  const testUnauthorizedError = async () => {
    setStatus("loading");
    setResult(null);

    const res = await guard(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw createGuardError("Session expired", {
        code: "UNAUTHORIZED",
        meta: { redirectTo: "/login" },
      });
    });

    if (!res.ok) {
      setStatus("error");
      setResult(JSON.stringify(res.error.toJSON(), null, 2));
    }
  };

  const testValidationError = async () => {
    setStatus("loading");
    setResult(null);

    const res = await guard(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw createGuardError("Invalid email format", {
        code: "VALIDATION",
        meta: { field: "email", value: "not-an-email" },
      });
    });

    if (!res.ok) {
      setStatus("error");
      setResult(JSON.stringify(res.error.toJSON(), null, 2));
    }
  };

  return (
    <div className="card">
      <h2>
        🏷️ Typed Error Codes <span className="badge error">Errors</span>
      </h2>
      <p>Tests createGuardError() with typed error codes</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="button" onClick={testNetworkError} disabled={status === "loading"}>
          NETWORK
        </button>
        <button className="button secondary" onClick={testUnauthorizedError} disabled={status === "loading"}>
          UNAUTHORIZED
        </button>
        <button className="button secondary" onClick={testValidationError} disabled={status === "loading"}>
          VALIDATION
        </button>
      </div>
      {result && (
        <div className={`result ${status}`}>
          {result}
        </div>
      )}
    </div>
  );
}

// ============================================
// Test 4: Error Boundary Test
// ============================================
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw createGuardError("Component crashed!", { code: "INTERNAL" });
  }
  return (
    <div className="result success">
      ✅ Component rendered successfully!
    </div>
  );
}

function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  const triggerError = () => {
    setShouldThrow(true);
    setKey((k) => k + 1);
  };

  const reset = () => {
    setShouldThrow(false);
    setKey((k) => k + 1);
  };

  return (
    <div className="card">
      <h2>
        🚨 GuardErrorBoundary <span className="badge error">React</span>
      </h2>
      <p>Tests GuardErrorBoundary with custom fallback</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button className="button" onClick={triggerError}>
          Trigger Error
        </button>
        <button className="button secondary" onClick={reset}>
          Reset
        </button>
      </div>
      <GuardErrorBoundary
        key={key}
        fallback={(error) => (
          <div className="error-boundary-fallback">
            <h3>💥 Error Caught!</h3>
            <p>Code: {error.code}</p>
            <p>Message: {error.message}</p>
          </div>
        )}
      >
        <BuggyComponent shouldThrow={shouldThrow} />
      </GuardErrorBoundary>
    </div>
  );
}

// ============================================
// Test 5: Real API Call (with potential failure)
// ============================================
function RealApiTest() {
  const { run } = useGuard();
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fetchRealApi = async () => {
    setStatus("loading");
    setResult(null);

    const res = await run(async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
      if (!response.ok) {
        throw createGuardError(`HTTP ${response.status}`, { code: "NETWORK" });
      }
      return response.json();
    });

    if (res.ok) {
      setStatus("success");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("error");
      setResult(`${res.error.code}: ${res.error.message}`);
    }
  };

  const fetchBadUrl = async () => {
    setStatus("loading");
    setResult(null);

    const res = await run(async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/invalid-endpoint-12345");
      if (!response.ok) {
        throw createGuardError(`HTTP ${response.status}: Not Found`, { code: "NOT_FOUND" });
      }
      return response.json();
    });

    if (res.ok) {
      setStatus("success");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("error");
      setResult(JSON.stringify({ code: res.error.code, message: res.error.message }, null, 2));
    }
  };

  return (
    <div className="card">
      <h2>
        🌐 Real API Call <span className="badge network">Network</span>
      </h2>
      <p>Tests guard with actual HTTP requests</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="button" onClick={fetchRealApi} disabled={status === "loading"}>
          {status === "loading" ? <span className="spinner" /> : null}
          Fetch Valid API
        </button>
        <button className="button secondary" onClick={fetchBadUrl} disabled={status === "loading"}>
          Fetch Invalid URL
        </button>
      </div>
      {result && (
        <div className={`result ${status}`}>
          {result}
        </div>
      )}
    </div>
  );
}

// ============================================
// Main App Component
// ============================================
export default function Home() {
  return (
    <GuardProvider
      fallback={(error) => (
        <div className="error-boundary-fallback">
          <h3>Global Error Handler</h3>
          <p>{error.message}</p>
        </div>
      )}
    >
      <div className="container">
        <header className="header">
          <h1>🛡️ Frontend Guard Test App</h1>
          <p>Testing @frontend-guard-org/core and @frontend-guard-org/react packages</p>
        </header>

        <div className="grid">
          <BasicGuardTest />
          <UseGuardHookTest />
          <TypedErrorTest />
          <ErrorBoundaryTest />
          <RealApiTest />
        </div>
      </div>
    </GuardProvider>
  );
}
