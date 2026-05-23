# MCQ Quiz

A clean, fast multiple-choice quiz app for self-study. Load any question set from a JSON file, filter by lecture, shuffle, and get instant or end-of-quiz feedback.

## Features

- **Two quiz modes** — Instant Feedback (see right/wrong after each answer) or End-of-Quiz Review (answer all, then submit)
- **Lecture filter** — study only the lectures you need
- **Shuffle** — randomize question order
- **Explanations** — optional per-question explanations shown after answering
- **Load from file or paste** — drag-and-drop a `.json` file or paste JSON directly
- **AI prompt included** — built-in prompt to convert any PDF into the correct format using ChatGPT, Claude, or Gemini

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Your Own Questions

1. Take your PDF (lecture slides, textbook, past exams, etc.)
2. Open any AI assistant (ChatGPT, Claude, Gemini…)
3. Upload the PDF and paste the prompt below
4. Save the JSON output as a `.json` file (or copy it)
5. Load it in the app via **Upload File** or **Paste JSON**

The app has this prompt built in — click **"How to generate JSON from a PDF"** on the load screen to copy it.

```
Convert the questions from this PDF into the following JSON format. Return only valid JSON, no extra text.

{
  "title": "Course Name",
  "lectures": [
    { "id": "lec-1", "name": "Lecture 1: Topic Name" }
  ],
  "questions": [
    {
      "id": 1,
      "lectureId": "lec-1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Optional explanation of why the answer is correct."
    }
  ]
}

Rules:
- "correct" is the 0-based index of the right option in the "options" array
- "explanation" is optional but helpful for studying
- Group questions by lecture using consistent lectureId values
- Each question must have a unique numeric "id"
```

## JSON Schema

```json
{
  "title": "string — displayed as the quiz title",
  "lectures": [
    { "id": "string — unique identifier", "name": "string — display name" }
  ],
  "questions": [
    {
      "id": "number — unique",
      "lectureId": "string — must match a lecture id",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correct": "number — 0-based index into options",
      "explanation": "string — optional"
    }
  ]
}
```

## Project Structure

```
src/
  app/
    page.tsx          # Main state machine (load → setup → quiz → results)
    layout.tsx
  components/
    LoadScreen.tsx    # File upload + paste JSON + AI prompt guide
    SetupScreen.tsx   # Mode, lecture filter, shuffle settings
    InstantQuiz.tsx   # Instant feedback quiz mode
    ReviewQuiz.tsx    # End-of-quiz review mode
    ResultsScreen.tsx # Score breakdown
  lib/
    quiz.ts           # filterQuestions, calcScore utilities
  types/
    index.ts          # TypeScript types
```

## Tech Stack

- [Next.js](https://nextjs.org) 15 (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

---

> © 2026 [Efraim Nabil](https://www.linkedin.com/in/efraimnabil) — All rights reserved.
