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

  if (settings.shuffleOptions) {
    filtered = filtered.map((q) => {
      const pairs = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }));
      const shuffled = [...pairs].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffled.map((p) => p.opt),
        correct: shuffled.findIndex((p) => p.isCorrect),
      };
    });
  }

  return filtered;
}

export function calcScore(
  questions: Question[],
  answers: Record<number, number>
): number {
  return questions.filter((q) => answers[q.id] === q.correct).length;
}
