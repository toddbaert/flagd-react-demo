import { useState } from "react";
import {
  useContextMutator,
  useFlag,
  useOpenFeatureClientStatus,
} from "@openfeature/react-sdk";
import "./App.css";

function ProviderStatus() {
  const status = useOpenFeatureClientStatus();
  return (
    <p className="status">
      provider status: <code>{status}</code>
    </p>
  );
}

function Flags() {
  const welcome = useFlag("welcome-message", false);
  const color = useFlag("hex-color", "#999999");
  const algo = useFlag("fib-algo", "recursive");

  return (
    <section className="flags">
      <div
        className="swatch"
        style={{ background: color.value }}
        title={`hex-color = ${color.value} (${color.reason})`}
      />
      <h2>{welcome.value ? "Welcome!" : "Hello."}</h2>

      <ul>
        <li>
          <strong>welcome-message</strong>: <code>{String(welcome.value)}</code>{" "}
          <em>
            ({String(welcome.reason)}
            {welcome.variant ? `, variant=${welcome.variant}` : ""})
          </em>
        </li>
        <li>
          <strong>hex-color</strong>: <code>{color.value}</code>{" "}
          <em>
            ({String(color.reason)}
            {color.variant ? `, variant=${color.variant}` : ""})
          </em>
        </li>
        <li>
          <strong>fib-algo</strong>: <code>{algo.value}</code>{" "}
          <em>
            ({String(algo.reason)}
            {algo.variant ? `, variant=${algo.variant}` : ""})
          </em>
        </li>
      </ul>
    </section>
  );
}

function ContextEditor() {
  const { setContext } = useContextMutator();
  const [targetingKey, setTargetingKey] = useState("user-1");
  const [tier, setTier] = useState("free");

  const apply = () => {
    setContext({ targetingKey, tier });
  };

  return (
    <section className="context">
      <h3>Evaluation context</h3>
      <label>
        targetingKey
        <input
          value={targetingKey}
          onChange={(e) => setTargetingKey(e.target.value)}
        />
      </label>
      <label>
        tier
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="free">free</option>
          <option value="premium">premium</option>
        </select>
      </label>
      <button type="button" onClick={apply}>
        Apply context
      </button>
      <p className="hint">
        Set <code>tier=premium</code> to turn the swatch green
        (<code>TARGETING_MATCH</code>). Change <code>targetingKey</code> to see
        the fractional bucketing pick a different <code>fib-algo</code>.
      </p>
    </section>
  );
}

export default function App() {
  return (
    <main className="page">
      <header>
        <h1>flagd + OFREP + React SDK</h1>
        <ProviderStatus />
      </header>
      <Flags />
      <ContextEditor />
      <footer>
        <p className="hint">
          Edit <code>flags/demo.flagd.json</code> while the app is running.
          flagd reloads the file automatically and the React SDK re-renders on
          the next poll (~2s).
        </p>
      </footer>
    </main>
  );
}
