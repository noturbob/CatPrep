import katex from "katex";

/** Display formula, rendered to HTML at build time; no KaTeX JS reaches the browser. */
export function Tex({ children }: { children: string }) {
  return (
    <div
      className="relative overflow-x-auto rounded-sm border-2 border-line bg-card px-3 py-4 text-center sm:px-5"
      dangerouslySetInnerHTML={{ __html: katex.renderToString(children, { displayMode: true, throwOnError: true }) }}
    />
  );
}
