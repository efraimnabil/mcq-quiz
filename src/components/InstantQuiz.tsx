"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/types";

interface Props {
  questions: Question[];
  onFinish: (answers: Record<number, number>) => void;
  onBack: () => void;
}

export default function InstantQuiz({ questions, onFinish, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mcq-quiz-session");
      if (raw) {
        const s = JSON.parse(raw);
        const idx = Math.min(s.index ?? 0, questions.length - 1);
        const ans = s.answers ?? {};
        setIndex(idx);
        setAnswers(ans);
        setChosen(ans[questions[idx]?.id] ?? null);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("mcq-quiz-session", JSON.stringify({ index, answers }));
    } catch {}
  }, [ready, index, answers]);

  const q = questions[index];
  const answered = chosen !== null;
  const isLast = index === questions.length - 1;

  function handleChoose(i: number) {
    if (answered) return;
    setChosen(i);
    setAnswers((prev) => ({ ...prev, [q.id]: i }));
  }

  function handleNext() {
    if (isLast) {
      onFinish({ ...answers });
    } else {
      setIndex((i) => i + 1);
      setChosen(null);
    }
  }

  function optionStyle(i: number) {
    if (!answered) {
      return "border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
    }
    if (i === q.correct) return "border-green-500 bg-green-50 text-green-800";
    if (i === chosen) return "border-red-400 bg-red-50 text-red-800";
    return "border-gray-200 text-gray-500";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-xl p-8 space-y-6">
        {/* Back + Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-xs font-medium">
              ← Back
            </button>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {questions[index].lectureId}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Question {index + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <p className="text-lg font-semibold text-gray-900 leading-snug">{q.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoose(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${optionStyle(i)}`}
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {answered && q.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <span className="font-semibold">Explanation: </span>
            {q.explanation}
          </div>
        )}

        {/* Result badge */}
        {answered && (
          <div
            className={`text-sm font-semibold ${
              chosen === q.correct ? "text-green-600" : "text-red-600"
            }`}
          >
            {chosen === q.correct ? "✓ Correct!" : `✗ Incorrect — correct answer: ${q.options[q.correct]}`}
          </div>
        )}

        {/* Next */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
