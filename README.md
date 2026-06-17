# flagd-react-demo

Tiny React + Vite demo evaluating flags from [flagd](https://flagd.dev) over
[OFREP](https://openfeature.dev/specification/appendix-c) via the
[OpenFeature React SDK](https://www.npmjs.com/package/@openfeature/react-sdk).

Versions:
- flagd `v0.16.0` (`ghcr.io/open-feature/flagd:v0.16.0`)
- `@openfeature/react-sdk` `^1.4.0`
- `@openfeature/web-sdk` `^1.9.0`
- `@openfeature/ofrep-web-provider` `^0.4.1`

## Run

```bash
docker compose up    # flagd: OFREP on :8016, RPC on :8013
npm install
npm run dev          # http://localhost:5173
```

## What to try

The React SDK re-renders automatically on both flag and context changes:

1. **Flag changes.** Edit `flags/demo.flagd.json`. flagd reloads the file; the
   OFREP provider polls every 2s and re-evaluates. Try flipping
   `welcome-message.defaultVariant`.

2. **Context changes.** Use the "Evaluation context" form:
   - `tier = premium` -> `hex-color` swatch goes green (`TARGETING_MATCH`).
   - Change `targetingKey` -> `fib-algo` fractional bucketing picks a
     different variant (deterministic 25/25/25/25 split).

## Wiring

`src/main.tsx`:

```ts
OpenFeature.setProvider(
  new OFREPWebProvider({ baseUrl: "http://localhost:8016", pollInterval: 2_000 }),
);
OpenFeature.setContext({ targetingKey: "user-1", tier: "free" });
```

`src/App.tsx` just calls `useFlag(key, defaultValue)`; the SDK handles
re-renders on `PROVIDER_CONFIGURATION_CHANGED` and context reconciliation.

## Poking with curl

```bash
curl -s -X POST http://localhost:8016/ofrep/v1/evaluate/flags \
  -H 'Content-Type: application/json' \
  -d '{"context":{"targetingKey":"user-1","tier":"premium"}}' | jq
```

flagd also exposes RPC on `:8013` and metrics/probes on `:8014`.

## Notes

- `--cors-origin=*` is set so the browser can call OFREP from Vite. Scope this
  to your real origin in production.
- 2s polling is for snappy demos; production can rely on visibility refresh
  (default) with a longer interval, or disable polling.
