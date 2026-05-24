export const t = {
  // LoadScreen
  appTitle: "اختبار MCQ",
  appSubtitle: "حمّل أسئلتك عشان تبدأ",
  uploadFile: "ارفع ملف",
  pasteJSON: "الصق JSON",
  dropFile: "اسقّط ملف .json هنا",
  orClickToBrowse: "أو اضغط عشان تختار",
  pasteHere: "الصق الـ JSON هنا…",
  loadQuestions: "حمّل الأسئلة",
  invalidJSON: "الـ JSON غلط:",
  howToGenerate: "إزاي تعمل JSON من PDF",
  aiGuideText:
    "ابعت الـ PDF لأي AI (ChatGPT أو Claude أو Gemini…) مع البرومبت اللي تحت، وبعدين الصق النتيجة أو احفظها كملف .json",
  copied: "اتنسخ!",
  copy: "انسخ",
  viewSchema: "شوف الـ JSON schema",
  // SetupScreen
  questionsLectures: (q: number, l: number) => `${q} سؤال · ${l} محاضرة`,
  copiedLink: "اتنسخ! ✓",
  failed: "فشل",
  share: "شارك ↗",
  change: "غيّر ↗",
  quizMode: "نوع الامتحان",
  instantFeedback: "⚡ جواب فوري",
  endOfQuizReview: "📋 مراجعة في الآخر",
  filterByLecture: "اختار المحاضرة",
  allLectures: "كل المحاضرات",
  shuffleQuestions: "خلّط الأسئلة",
  shuffleQuestionsDesc: "رتّبهم بشكل عشوائي",
  shuffleOptions: "خلّط الإجابات",
  shuffleOptionsDesc: "رتّب الخيارات بشكل عشوائي",
  noQuestions: "مفيش أسئلة في الاختيار ده",
  startQuiz: (n: number) => `ابدأ الامتحان — ${n} سؤال`,
  // InstantQuiz + ReviewQuiz shared
  back: "رجوع →",
  questionOf: (current: number, total: number) => `السؤال ${current} من ${total}`,
  explanation: "الشرح:",
  correct: "✓ صح!",
  incorrect: (answer: string) => `✗ غلط — الإجابة الصح: ${answer}`,
  seeResults: "شوف النتيجة",
  nextQuestion: "← السؤال الجاي",
  // ReviewQuiz
  questionsNav: "الأسئلة",
  submit: "سلّم",
  previous: "اللي فات →",
  submitQuiz: "سلّم الامتحان",
  next: "← الجاي",
  answered: (done: number, total: number) => `${done}/${total} اتجاوبوا`,
  // ResultsScreen
  correctOf: (score: number, total: number) => `${score} صح من ${total}`,
  excellent: "ممتاز!",
  goodJob: "كويس!",
  keepStudying: "ذاكر أكتر!",
  needsImprovement: "لازم تذاكر أكتر",
  retry: (n: number) => `🔁 عيد ${n} إجابة غلط`,
  backToSetup: "↩ ارجع للإعداد",
};

export function useLang() {
  return { t };
}
