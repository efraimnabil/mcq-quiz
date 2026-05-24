"use client";

import { useRef, useState } from "react";
import type { QuizData } from "@/types";
import { useLang } from "@/i18n";

const AI_PROMPT = `Convert the questions from this PDF into the following JSON format. Return only valid JSON, no extra text.

{
  "title": "Course Name",
  "lectures": [
    { "id": "lec-1", "name": "Lecture 1: Topic Name" }
  ],
  "questions": [
    {
      "id": 1,
      "lectureId": "lec-1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Optional explanation of why the answer is correct."
    }
  ]
}

Rules:
- "correct" is the 0-based index of the right option in the "options" array
- "explanation" is optional but helpful for studying
- Group questions by lecture using consistent lectureId values
- Each question must have a unique numeric "id"`;

interface Props {
  onLoad: (data: QuizData) => void;
}

function parseAndValidate(text: string): QuizData {
  const parsed = JSON.parse(text);
  if (!parsed.title || !Array.isArray(parsed.lectures) || !Array.isArray(parsed.questions)) {
    throw new Error('Missing required fields: "title", "lectures", "questions"');
  }
  if (parsed.questions.length === 0) throw new Error("questions array is empty");
  return parsed as QuizData;
}

export default function LoadScreen({ onLoad }: Props) {
  const { t } = useLang();
  const [tab, setTab] = useState<"file" | "paste">("file");
  const [pasteText, setPasteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = parseAndValidate(ev.target?.result as string);
        setError(null);
        onLoad(data);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    reader.readAsText(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handlePasteLoad() {
    try {
      const data = parseAndValidate(pasteText.trim());
      setError(null);
      onLoad(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="MCQ Quiz" className="w-11 h-11 shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.appTitle}</h1>
            <p className="text-gray-500 mt-1 text-sm">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl border border-gray-200 p-1 gap-1">
          {(["file", "paste"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => { setTab(tabKey); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === tabKey
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tabKey === "file" ? t.uploadFile : t.pasteJSON}
            </button>
          ))}
        </div>

        {/* File upload */}
        {tab === "file" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <p className="text-3xl mb-3">📂</p>
            <p className="text-sm font-medium text-gray-700">
              {t.dropFile.split(".json")[0]}
              <code className="bg-gray-100 px-1 rounded text-xs">.json</code>
              {t.dropFile.includes(".json") ? t.dropFile.split(".json")[1] : ""}
            </p>
            <p className="text-xs text-gray-400 mt-1">{t.orClickToBrowse}</p>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileInput} />
          </div>
        )}

        {/* Paste */}
        {tab === "paste" && (
          <div className="space-y-3">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={t.pasteHere}
              rows={10}
              className="w-full border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handlePasteLoad}
              disabled={!pasteText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t.loadQuestions}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <strong>{t.invalidJSON}</strong> {error}
          </div>
        )}

        {/* AI prompt guide */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowPrompt((v) => !v)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <span>{showPrompt ? "▾" : "▸"}</span>
            {t.howToGenerate}
          </button>

          {showPrompt && (
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p>
                {t.aiGuideText.split(".json")[0]}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">.json</code>
                {t.aiGuideText.includes(".json") ? t.aiGuideText.split(".json")[1] : ""}
              </p>
              <div className="bg-gray-900 rounded-xl p-4 relative">
                <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
{AI_PROMPT}
                </pre>
                <button
                  onClick={copyPrompt}
                  className="absolute top-3 right-3 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <details>
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700 text-xs font-medium">
                  {t.viewSchema}
                </summary>
                <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 overflow-x-auto">{`{
  "title": string,
  "lectures": [{ "id": string, "name": string }],
  "questions": [{
    "id": number,
    "lectureId": string,
    "question": string,
    "options": string[],  // exactly 4
    "correct": number,    // 0-based index
    "explanation": string // optional
  }]
}`}</pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
