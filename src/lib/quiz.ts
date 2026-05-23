import type { Question, QuizSettings } from "@/types";

export function filterQuestions(
  questions: Question[],
  settings: QuizSettings
): Question[] {
  let filtered = questions;

  if (settings.selectedLectures.length > 0) {
    filtered = filtered.filter((q) =>
      settings.selectedLectures.includes(q.lectureId)
    );
  }

  if (settings.shuffle) {
    filtered = [...filtered].sort(() => Math.random() - 0.5);
  }

  return filtered;
}

export function calcScore(
  questions: Question[],
  answers: Record<number, number>
): number {
  return questions.filter((q) => answers[q.id] === q.correct).length;
}
