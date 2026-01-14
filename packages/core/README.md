# @frontend-guard-org/core

Framework-agnostic error and guard utilities for frontend applications.

This package contains the core logic of **frontend-guard-org** and does not depend on any UI framework.

## Installation

```bash
npm install @frontend-guard-org/core
```

## What it provides

- `guard(...)` – safe execution wrapper
- `GuardError` – normalized error model
- Error normalization utilities

## Usage

```ts
import { guard } from '@frontend-guard-org/core'

const result = guard(() => {
  // risky logic
})

if (!result.ok) {
  console.error(result.error)
}
```

## Scope

- No framework dependencies
- Designed to be consumed by adapters (React, Vue, etc.)

## License

MIT
