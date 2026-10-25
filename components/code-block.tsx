import { CodeSnippet } from "./code-snippet";

type Props = {
  code: string;
  language: string;
  filename: string;
};

export function CodeBlock({ code, language, filename }: Props) {
  return <CodeSnippet code={code} language={language} filename={filename} />;
}
