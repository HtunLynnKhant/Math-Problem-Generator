'use client'

import { useState, FormEvent } from 'react'

interface MathProblem {
  problem_text: string
  final_answer: number
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const generateProblem = async () => {
    setIsLoading(true)
    setFeedback('')
    setIsCorrect(null)
    setUserAnswer('')
    try {
      const res = await fetch('/api/math-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to generate problem')
      }
      const data: { session_id: string; problem: MathProblem } = await res.json()
      setSessionId(data.session_id)
      setProblem(data.problem)
    } catch (err: any) {
      console.error(err)
      setFeedback('Error generating problem. Please try again.')
      setIsCorrect(null)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async (e: FormEvent) => {
    e.preventDefault()
    if (!sessionId || !problem) return
    setIsLoading(true)
    setFeedback('')
    try {
      const res = await fetch('/api/math-problem/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: Number(userAnswer),
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to submit answer')
      }
      const data: { is_correct: boolean; feedback: string } = await res.json()
      setIsCorrect(data.is_correct)
      setFeedback(data.feedback)
    } catch (err: any) {
      console.error(err)
      setFeedback('Error submitting answer. Please try again.')
      setIsCorrect(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full animate-float blur-xl" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        
        {/* overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="glass-morphism-dark sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <span className="text-lg sm:text-2xl">📟</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">MathGenius AI</h1>
                <p className="text-xs sm:text-sm text-gray-300">Primary 5 Math Practice</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs sm:text-sm font-medium">Powered by 
            linn</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight px-2">
            Master Math with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
              AI Precision
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4">
            Experience personalized learning with our intelligent math problem generator. 
            Each question is crafted specifically for Primary 5 students with instant, detailed feedback.
          </p>
        </div>

        {/* Generate Problem Section */}
        <div className="glass-morphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-16 card-hover animate-scale-in border border-white/20">
          <div className="text-center mb-8 sm:mb-10">
            <div className="relative inline-block mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs sm:text-sm">⚡</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
              Generate Your Challenge
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Our AI creates unique problems tailored to your learning level. Each question comes with step-by-step guidance and personalized feedback.
            </p>
          </div>
          
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-12 rounded-xl sm:rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl relative overflow-hidden btn-hover-lift group focus-ring"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span className="font-semibold text-sm sm:text-base">Crafting Your Problem...</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl">🎯</span>
                  <span className="font-semibold text-sm sm:text-base">Generate New Problem</span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Problem Display */}
        {problem && (
          <div className="glass-morphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-16 card-hover animate-bounce-in border border-white/20">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <span className="text-2xl sm:text-2xl md:text-3xl">📋</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Your Problem</h2>
                  <div className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                    <span className="text-green-300 text-xs sm:text-sm font-semibold">AI Generated</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
                  <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed font-medium">
                    {problem.problem_text}
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={submitAnswer} className="space-y-6 sm:space-y-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                <label htmlFor="answer" className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-base sm:text-lg">💭</span>
                  </div>
                  Your Answer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-lg sm:text-xl md:text-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 text-white font-semibold placeholder-gray-400 focus-ring"
                    placeholder="Enter your answer here..."
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:pr-8">
                    <span className="text-blue-400 text-xl sm:text-2xl md:text-3xl">🔢</span>
                  </div>
                </div>
              </div>
              
              <button
                type={isCorrect === true ? "button" : "submit"}
                onClick={isCorrect === true ? generateProblem : undefined}
                disabled={!userAnswer || isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-12 rounded-xl sm:rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl relative overflow-hidden btn-hover-lift group focus-ring"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span className="font-semibold text-sm sm:text-base">
                      {isCorrect === true ? "Generating New Problem..." : "Analyzing Answer..."}
                    </span>
                  </>
                ) : isCorrect === true ? (
                  <>
                    <span className="text-xl sm:text-2xl md:text-3xl">🎯</span>
                    <span className="font-semibold text-sm sm:text-base">Generate New Problem</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl md:text-3xl">🚀</span>
                    <span className="font-semibold text-sm sm:text-base">Submit Answer</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className={`glass-morphism rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 animate-bounce-in card-hover border ${
            isCorrect 
              ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-green-500/10' 
              : 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10'
          }`}>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow ${
                  isCorrect 
                    ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500' 
                    : 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500'
                }`}>
                  <span className="text-2xl sm:text-3xl md:text-4xl">
                    {isCorrect ? '🎉' : '🎯'}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                    isCorrect ? 'text-emerald-300' : 'text-amber-300'
                  }`}>
                    {isCorrect ? 'Outstanding!' : 'Keep Learning!'}
                  </h2>
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border ${
                    isCorrect 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                      : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className="text-xs sm:text-sm font-semibold">
                      {isCorrect ? 'Correct' : 'Try Again'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-medium">
                    {feedback}
                  </p>
                </div>
                {isCorrect && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                    <span className="text-2xl sm:text-3xl">🌟</span>
                    <div className="text-center sm:text-left">
                      <p className="text-emerald-300 font-bold text-base sm:text-lg">Excellent work!</p>
                      <p className="text-emerald-400 text-sm sm:text-base">Your next challenge is loading automatically...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="glass-morphism-dark border-t border-white/10 mt-12 sm:mt-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-base sm:text-lg">🤖</span>
              </div>
              <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">MathGenius AI</span>
            </div>
            <p className="text-gray-400 text-base sm:text-lg font-medium mb-3 sm:mb-4 px-4">
              Empowering students with intelligent math practice
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
              <span>Built with Next.js & AI</span>
              <span className="hidden sm:inline">•</span>
              <span>Tailored for Primary 5</span>
              <span className="hidden sm:inline">•</span>
              <span>Instant Feedback</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}