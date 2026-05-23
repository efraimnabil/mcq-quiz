"use client";

import { useState } from "react";
import type { Question } from "@/types";

interface Props {
  questions: Question[];
  answers: Record<number, number>;
  onRestart: () => void;
}

export default function ResultsScreen({ questions, answers, onRestart }: Props) {
  const [index, setIndex] = useState(0);

  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  const pct = Math.round((score / questions.length) * 100);

  const grade =
    pct >= 90 ? { label: "Excellent!", color: "text-green-600", bg: "bg-green-50 border-green-200" } :
    pct >= 70 ? { label: "Good job!", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" } :
    pct >= 50 ? { label: "Keep studying!", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
    { label: "Needs improvement", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  const q = questions[index];
  const userAnswer = answers[q.id];
  const isCorrect = userAnswer === q.correct;

  function optionStyle(i: number) {
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

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Question {index + 1} of {questions.length}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {isCorrect ? "✓ Correct" : "✗ Wrong"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <p className="text-base font-semibold text-gray-900 leading-snug">{q.question}</p>

          {/* All options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-medium flex items-center gap-3 ${optionStyle(i)}`}
              >
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {i === q.correct && (
                  <span className="text-green-600 font-bold text-xs shrink-0">✓ correct</span>
                )}
                {i === userAnswer && i !== q.correct && (
                  <span className="text-red-500 font-bold text-xs shrink-0">✗ your answer</span>
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

          {/* Navigation */}
          <div className="flex justify-between pt-1">
            <button
              onClick={() => setIndex((i) => i - 1)}
              disabled={index === 0}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIndex((i) => i + 1)}
              disabled={index === questions.length - 1}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white text-sm font-semibold transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Back to setup */}
        <button
          onClick={onRestart}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          ↩ Back to Setup
        </button>

      </div>
    </div>
  );
}
