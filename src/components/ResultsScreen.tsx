"use client";

import type { Question } from "@/types";

interface Props {
  questions: Question[];
  answers: Record<number, number>;
  onRestart: () => void;
  onRetry: (wrong: Question[]) => void;
}

export default function ResultsScreen({ questions, answers, onRestart, onRetry }: Props) {
  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  const wrong = questions.filter((q) => answers[q.id] !== q.correct);
  const pct = Math.round((score / questions.length) * 100);

  const grade =
    pct >= 90 ? { label: "Excellent!", color: "text-green-600", bg: "bg-green-50 border-green-200" } :
    pct >= 70 ? { label: "Good job!", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" } :
    pct >= 50 ? { label: "Keep studying!", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
    { label: "Needs improvement", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  function optionStyle(q: Question, i: number) {
    const userAnswer = answers[q.id];
    if (i === q.correct) return "border-green-500 bg-green-50 text-green-800";
    if (i === userAnswer) return "border-red-400 bg-red-50 text-red-700";
    return "border-gray-100 text-gray-400";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-16">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Score card */}
        <div className={`rounded-2xl border p-6 text-center space-y-1 ${grade.bg}`}>
          <p className={`text-4xl font-bold ${grade.color}`}>{pct}%</p>
          <p className={`text-base font-semibold ${grade.color}`}>{grade.label}</p>
          <p className="text-gray-500 text-sm">{score} correct out of {questions.length}</p>
        </div>

        {/* Per-question breakdown */}
        {questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;
          return (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">

              {/* Question header */}
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {isCorrect ? "✓" : "✗"}
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {i + 1}. {q.question}
                </p>
              </div>

              {/* All options */}
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium flex items-center gap-3 ${optionStyle(q, j)}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + j)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {j === q.correct && (
                      <span className="text-green-600 font-bold text-xs shrink-0">✓</span>
                    )}
                    {j === userAnswer && j !== q.correct && (
                      <span className="text-red-500 font-bold text-xs shrink-0">✗</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  <span className="font-semibold">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Actions */}
        <div className="space-y-3">
          {wrong.length > 0 && (
            <button
              onClick={() => onRetry(wrong)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              🔁 Retry {wrong.length} wrong answer{wrong.length !== 1 ? "s" : ""}
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            ↩ Back to Setup
          </button>
        </div>

      </div>
    </div>
  );
}
