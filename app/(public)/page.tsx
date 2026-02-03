export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-4xl">
        <h1 className="text-6xl font-extrabold text-blue-950 mb-6">Find Your Perfect <span className="text-blue-600">Mentor</span></h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Unlock your potential with 1-on-1 personalized learning. LearnMentor connects top-tier tutors with students worldwide using AI-driven matching.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition">Get Started</a>
          <a href="/about" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition">Learn More</a>
        </div>
      </div>
      <div className="mt-16 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
        {/* Placeholder for an attractive AI image of a modern classroom/tutor */}
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Students learning" className="w-full h-[400px] object-cover" />
      </div>
    </div>
  );
}