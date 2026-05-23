"use client";

import { useState } from "react";
import type { Question } from "@/types";

interface Props {
  questions: Question[];
  onFinish: (answers: Record<number, number>) => void;
  onBack: () => void;
}

export default function ReviewQuiz({ questions, onFinish, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = questions[index];
  const chosen = answers[q.id] ?? null;
  const isLast = index === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  function handleChoose(i: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: i }));
  }

  function goTo(i: number) {
    setIndex(i);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto flex gap-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2 sticky top-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Questions</p>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((_, i) => {
                const answered = answers[questions[i].id] !== undefined;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      i === index
                        ? "bg-blue-600 text-white"
                        : answered
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {allAnswered && (
              <button
                onClick={() => onFinish(answers)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                Submit
              </button>
            )}
          </div>
        </aside>

        {/* Question card */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            {/* Back + Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-xs font-medium">
                  ← Back
                </button>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {q.lectureId}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Question {index + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${
                      (Object.keys(answers).length / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {Object.keys(answers).length}/{questions.length} answered
              </p>
            </div>

            <p className="text-lg font-semibold text-gray-900 leading-snug">{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoose(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    chosen === i
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                  }`}
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

            <div className="flex justify-between pt-2">
              <button
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                ← Previous
              </button>
              {isLast ? (
                <button
                  onClick={() => onFinish(answers)}
                  disabled={!allAnswered}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => goTo(index + 1)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
