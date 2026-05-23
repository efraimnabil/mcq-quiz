"use client";

import { useState } from "react";
import type { QuizSettings, Question, QuizData } from "@/types";
import { filterQuestions } from "@/lib/quiz";
import LoadScreen from "@/components/LoadScreen";
import SetupScreen from "@/components/SetupScreen";
import InstantQuiz from "@/components/InstantQuiz";
import ReviewQuiz from "@/components/ReviewQuiz";
import ResultsScreen from "@/components/ResultsScreen";

type Phase = "load" | "setup" | "quiz" | "results";

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [phase, setPhase] = useState<Phase>("load");
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function handleLoad(data: QuizData) {
    setQuizData(data);
    setPhase("setup");
  }

  function handleStart(s: QuizSettings) {
    const qs = filterQuestions(quizData!.questions, s);
    setSettings(s);
    setActiveQuestions(qs);
    setAnswers({});
    setPhase("quiz");
  }

  function handleFinish(a: Record<number, number>) {
    setAnswers(a);
    setPhase("results");
  }

  if (phase === "load") {
    return <LoadScreen onLoad={handleLoad} />;
  }

  if (phase === "setup" && quizData) {
    return (
      <SetupScreen
        data={quizData}
        onStart={handleStart}
        onChangeData={() => setPhase("load")}
      />
    );
  }

  if (phase === "quiz" && settings) {
    if (settings.mode === "instant") {
      return <InstantQuiz questions={activeQuestions} onFinish={handleFinish} onBack={() => setPhase("setup")} />;
    }
    return <ReviewQuiz questions={activeQuestions} onFinish={handleFinish} onBack={() => setPhase("setup")} />;
  }

  return (
    <ResultsScreen
      questions={activeQuestions}
      answers={answers}
      onRestart={() => setPhase("setup")}
    />
  );
}
