"use client";

import { useState } from "react";
import type { QuizData, QuizSettings, QuizMode } from "@/types";

interface Props {
  data: QuizData;
  onStart: (settings: QuizSettings) => void;
  onChangeData: () => void;
}

export default function SetupScreen({ data, onStart, onChangeData }: Props) {
  const [mode, setMode] = useState<QuizMode>("instant");
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [selectedLectures, setSelectedLectures] = useState<string[]>([]);

  const allSelected = selectedLectures.length === 0;

  function toggleLecture(id: string) {
    setSelectedLectures((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }

  const questionCount =
    selectedLectures.length === 0
      ? data.questions.length
      : data.questions.filter((q) => selectedLectures.includes(q.lectureId)).length;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {data.questions.length} questions · {data.lectures.length} lectures
            </p>
          </div>
          <button
            onClick={onChangeData}
            className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors pt-1"
          >
            Change ↗
          </button>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quiz Mode</p>
          <div className="grid grid-cols-2 gap-3">
            {(["instant", "review"] as QuizMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {m === "instant" ? "⚡ Instant Feedback" : "📋 End-of-Quiz Review"}
              </button>
            ))}
          </div>
        </div>

        {/* Lectures */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter by Lecture</p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedLectures([])}
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                allSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              All Lectures
            </button>
            {data.lectures.map((lec) => {
              const count = data.questions.filter((q) => q.lectureId === lec.id).length;
              const selected = selectedLectures.includes(lec.id);
              return (
                <button
                  key={lec.id}
                  onClick={() => toggleLecture(lec.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors flex justify-between items-center ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span>{lec.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selected ? "bg-blue-100" : "bg-gray-100"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shuffle toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Shuffle Questions</p>
              <p className="text-xs text-gray-400">Randomize question order</p>
            </div>
            <button
              onClick={() => setShuffle((s) => !s)}
              className={`relative w-11 h-6 rounded-full transition-colors ${shuffle ? "bg-blue-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  shuffle ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Shuffle Options</p>
              <p className="text-xs text-gray-400">Randomize A / B / C / D order</p>
            </div>
            <button
              onClick={() => setShuffleOptions((s) => !s)}
              className={`relative w-11 h-6 rounded-full transition-colors ${shuffleOptions ? "bg-blue-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  shuffleOptions ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Start */}
        <button
          disabled={questionCount === 0}
          onClick={() => onStart({ mode, shuffle, shuffleOptions, selectedLectures })}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {questionCount === 0
            ? "No questions in selection"
            : `Start Quiz — ${questionCount} Questions`}
        </button>
      </div>
    </div>
  );
}
