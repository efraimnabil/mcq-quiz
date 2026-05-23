export interface Lecture {
  id: string;
  name: string;
}

export interface Question {
  id: number;
  lectureId: string;
  question: string;
  options: string[];
  correct: number; // index into options[]
  explanation?: string;
}

export interface QuizData {
  title: string;
  lectures: Lecture[];
  questions: Question[];
}

export type QuizMode = "instant" | "review";

export interface QuizSettings {
  mode: QuizMode;
  shuffle: boolean;
  selectedLectures: string[]; // lecture ids; empty = all
}

export interface Answer {
  questionId: number;
  chosen: number; // index into options[]
}
