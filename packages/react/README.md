# @frontend-guard-org/react

React bindings for **frontend-guard-org**.

Provides React-specific helpers built on top of `@frontend-guard-org/core`.

## Installation

```bash
npm install @frontend-guard-org/react
```

> Peer dependency:
> react >= 18

## What it provides

- `GuardErrorBoundary`
- `GuardProvider`
- `useGuard`

## Usage

```tsx
import { GuardProvider, GuardErrorBoundary } from '@frontend-guard-org/react'

function App() {
  return (
    <GuardProvider fallback={(err) => <div>{err.message}</div>}>
      <GuardErrorBoundary>
        <MyComponent />
      </GuardErrorBoundary>
    </GuardProvider>
  )
}
```

## Notes

- Requires React environment (DOM)
- Uses `@frontend-guard-org/core` internally

## License

MIT
