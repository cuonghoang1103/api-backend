'use client';

import dynamic from 'next/dynamic';

// Monaco is client-only; load it lazily so it never runs during SSR/build.
const Monaco = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>
      Loading editor…
    </div>
  ),
});

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
}: {
  value: string;
  onChange: (v: string) => void;
  language?: string;
}) {
  return (
    <Monaco
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      options={{
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        automaticLayout: true,
        lineNumbersMinChars: 3,
        padding: { top: 10 },
      }}
    />
  );
}
