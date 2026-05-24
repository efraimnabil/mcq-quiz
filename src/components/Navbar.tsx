export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-2">
        <img src="/logo.svg" alt="MCQ Quiz" className="w-6 h-6" />
        <span className="text-sm font-semibold text-gray-800">اختبار MCQ</span>
      </div>
    </nav>
  );
}
