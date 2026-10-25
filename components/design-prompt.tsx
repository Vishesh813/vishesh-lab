"use client";

import { useState } from "react";
import { Check, Copy, Timer } from "./icons";

export function DesignPrompt({
  prompt,
  minutes = 15,
}: {
  prompt: string;
  minutes?: number;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="design-prompt" aria-labelledby="design-prompt-title">
      <div className="design-prompt-head">
        <span className="card-label">
          <Timer width={12} height={12} /> Design prompt
        </span>
        <span className="mono-note">{minutes} min · say it out loud</span>
      </div>
      <p id="design-prompt-title">{prompt}</p>
      <div className="design-prompt-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={copy}>
          {copied ? <Check width={13} height={13} /> : <Copy width={13} height={13} />}
          {copied ? "Copied" : "Copy prompt"}
        </button>
        <a className="btn btn-ghost btn-sm" href="/board/">
          <Timer width={13} height={13} />
          Take it to the board
        </a>
      </div>
    </section>
  );
}
