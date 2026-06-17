import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";
import App from "./App.tsx";
import "./index.css";

// flagd serves OFREP on port 8016 by default (also on 8013 alongside gRPC).
// pollInterval makes the provider re-fetch the flag set periodically, so edits
// to flags/demo.flagd.json show up in the UI without a reload.
OpenFeature.setProvider(
  new OFREPWebProvider({
    baseUrl: "http://localhost:8016",
    pollInterval: 2_000,
  }),
);

// seed an initial evaluation context so targeting rules have something to chew on
OpenFeature.setContext({
  targetingKey: "user-1",
  tier: "free",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpenFeatureProvider>
      <App />
    </OpenFeatureProvider>
  </StrictMode>,
);
