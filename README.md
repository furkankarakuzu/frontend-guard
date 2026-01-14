# frontend-guard

A small, framework-agnostic utility for safe async execution, explicit error handling, and predictable fallback behavior in frontend applications.

No magic. No hidden retries. No opinionated data fetching.  
Just controlled execution and recovery.

---

## The Problem

In frontend applications, async logic usually ends up scattered across:

- try/catch blocks
- loading states
- error boundaries
- ad-hoc fallbacks
- inconsistent UX on failure

This leads to duplicated logic, unclear failure paths, and fragile recovery behavior.

frontend-guard introduces a single, explicit execution model for async operations.

---

## Core Idea

You wrap an async operation with `guard`.

Instead of throwing or silently failing, it returns a structured result:

- success → data
- failure → typed error

---

## Installation

```bash
npm install @frontend-guard-org/core
```

For React:

```bash
npm install @frontend-guard-org/react
```

---

## Core Usage

```ts
import { guard } from '@frontend-guard-org/core'

const result = await guard(async () => {
  const res = await fetch('/api/user')
  if (!res.ok) throw new Error('Network error')
  return res.json()
})

if (result.ok) {
  console.log(result.data)
} else {
  console.log(result.error.code)
}
```

---

## Guard Result Shape

```ts
type GuardResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: GuardError }
```

---

## React Usage (Minimal)

```tsx
import {
  GuardProvider,
  GuardErrorBoundary,
  useGuard,
} from '@frontend-guard-org/react'

function User() {
  const { run } = useGuard()

  const loadUser = async () => {
    const result = await run(() =>
      fetch('/api/user').then(r => r.json())
    )

    if (result.ok) {
      console.log(result.data)
    }
  }

  return <button onClick={loadUser}>Load user</button>
}

export function App() {
  return (
    <GuardProvider fallback={(error) => <div>Error: {error.code}</div>}>
      <GuardErrorBoundary>
        <User />
      </GuardErrorBoundary>
    </GuardProvider>
  )
}
```

---

## What frontend-guard is NOT

- Not a data-fetching library
- Not a retry mechanism
- Not a state manager
- Not an error tracking tool

It does one thing only:

Make async execution and failure handling explicit and predictable.

---

## When You Should NOT Use It

- If you already rely heavily on React Query, SWR, or TanStack Query
- If silent retries and background refetching are desired
- If errors should never surface to the UI

---

## Packages

- @frontend-guard-org/core — framework-agnostic logic
- @frontend-guard-org/react — React adapter

---

## Status

- MVP
- API intentionally small
- Tests intentionally deferred until API stabilizes

---

## License

MIT
