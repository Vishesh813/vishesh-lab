"use client";

import { useState } from "react";
import { Highlight, type Language } from "prism-react-renderer";
import { Check, Copy, Terminal } from "./icons";

const languageAliases: Record<string, Language> = {
  c: "c",
  "c++": "cpp",
  cpp: "cpp",
  cplusplus: "cpp",
  cs: "clike",
  csharp: "clike",
  css: "css",
  go: "go",
  graphql: "graphql",
  html: "markup",
  java: "clike",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  kotlin: "kotlin",
  markdown: "markdown",
  md: "markdown",
  plain: "plain",
  plaintext: "plain",
  py: "python",
  python: "python",
  rust: "rust",
  sql: "sql",
  swift: "swift",
  text: "plain",
  ts: "typescript",
  tsx: "tsx",
  txt: "plain",
  typescript: "typescript",
  xml: "markup",
  yaml: "yaml",
  yml: "yaml",
};

const emptyTheme = { plain: {}, styles: [] };

function prismLanguage(language: string): Language {
  return languageAliases[language.toLowerCase().trim()] ?? "plain";
}

type Props = {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
};

export function CodeSnippet({
  code,
  language,
  filename,
  showLineNumbers = true,
  className,
}: Props) {
  const [copied, setCopied] = useState(false);
  const clean = code.replace(/\s+$/, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clean);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`code-snippet${className ? ` ${className}` : ""}`}>
      <div className="code-snippet-head">
        <span className="code-snippet-file">
          <Terminal width={13} height={13} aria-hidden="true" />
          {filename ?? "snippet"}
        </span>
        <span className="code-snippet-lang">{language}</span>
        <button
          type="button"
          className="code-snippet-copy"
          onClick={copy}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? (
            <Check width={12} height={12} aria-hidden="true" />
          ) : (
            <Copy width={12} height={12} aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="code-snippet-pre" tabIndex={0}>
        <code>
          <Highlight
            code={clean}
            language={prismLanguage(language)}
            theme={emptyTheme}
          >
            {({ tokens, getLineProps, getTokenProps }) => (
              <>
                {tokens.map((line, lineIndex) => {
                  const { style: lineStyle, ...lineProps } = getLineProps({ line });
                  void lineStyle;
                  return (
                    <span
                      {...lineProps}
                      className={`code-line ${lineProps.className ?? ""}`}
                      key={lineIndex}
                    >
                      {showLineNumbers ? (
                        <span className="code-line-number" aria-hidden="true">
                          {lineIndex + 1}
                        </span>
                      ) : null}
                      <span className="code-line-content">
                        {line.map((token, tokenIndex) => {
                          const { style: tokenStyle, ...tokenProps } = getTokenProps({
                            token,
                          });
                          void tokenStyle;
                          return <span {...tokenProps} key={tokenIndex} />;
                        })}
                      </span>
                    </span>
                  );
                })}
              </>
            )}
          </Highlight>
        </code>
      </pre>
    </div>
  );
}
