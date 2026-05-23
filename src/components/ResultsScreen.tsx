"use client";

import type { Question } from "@/types";

interface Props {
  questions: Question[];
  answers: Record<number, number>;
  onRestart: () => void;
}

export default function ResultsScreen({ questions, answers, onRestart }: Props) {
  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  const pct = Math.round((score / questions.length) * 100);

  const grade =
    pct >= 90 ? { label: "Excellent!", color: "text-green-600", bg: "bg-green-50 border-green-200" } :
    pct >= 70 ? { label: "Good job!", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" } :
    pct >= 50 ? { label: "Keep studying!", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
    { label: "Needs improvement", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score card */}
        <div className={`rounded-2xl border p-8 text-center space-y-2 ${grade.bg}`}>
          <p className={`text-5xl font-bold ${grade.color}`}>{pct}%</p>
          <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
          <p className="text-gray-600 text-sm">
            {score} correct out of {questions.length} questions
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const correct = userAnswer === q.correct;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-5 space-y-3 ${
                  correct ? "border-green-200" : "border-red-200"
                }`}
              >
                <div className="flex gap-3">
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {correct ? "✓" : "✗"}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    {i + 1}. {q.question}
                  </p>
                </div>

                <div className="pl-9 space-y-1 text-sm">
                  {userAnswer !== undefined && userAnswer !== q.correct && (
                    <p className="text-red-600">
                      Your answer: {q.options[userAnswer]}
                    </p>
                  )}
                  <p className="text-green-700 font-medium">
                    Correct: {q.options[q.correct]}
                  </p>
                  {q.explanation && (
                    <p className="text-gray-500 pt-1">{q.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Back to Setup
        </button>
      </div>
    </div>
  );
}
