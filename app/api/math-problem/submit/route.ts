import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getModel() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('Missing GOOGLE_API_KEY')
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sessionId: string | undefined = body?.session_id
    const userAnswer: number | undefined = typeof body?.user_answer === 'number' ? body.user_answer : Number(body?.user_answer)

    if (!sessionId || !Number.isFinite(userAnswer)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Get session to retrieve problem and correct answer
    const { data: session, error: fetchErr } = await supabase
      .from('math_problem_sessions')
      .select('id, problem_text, correct_answer')
      .eq('id', sessionId)
      .single()

    if (fetchErr || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const isCorrect = Number(userAnswer) === Number(session.correct_answer)

    // Ask AI for personalized feedback
    let feedbackText = ''
    try {
      const model = getModel()
      const prompt = `You are a helpful Primary 5 math tutor. Provide short, constructive feedback for the student based on their answer.
Problem: ${session.problem_text}
Correct Answer: ${session.correct_answer}
Student Answer: ${userAnswer}
Result: ${isCorrect ? 'Correct' : 'Incorrect'}

Instructions:
- Keep it under 120 words.
- If correct: briefly praise and explain why the answer is correct.
- If incorrect: explain the mistake in simple terms, show the correct approach, and encourage.
- Use friendly tone and simple language suitable for a 10-11 year old.`
      const result = await model.generateContent(prompt)
      feedbackText = result.response.text().trim()
    } catch (aiErr) {
      // Fallback feedback if AI fails
      feedbackText = isCorrect
        ? 'Great job! Your answer is correct. You applied the right steps to solve the problem.'
        : `Not quite. The correct answer is ${session.correct_answer}. Review your steps and try to see where the numbers were added, subtracted, multiplied, or divided wrongly.`
    }

    // Save submission
    const { error: insertErr } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: session.id,
        user_answer: Number(userAnswer),
        is_correct: isCorrect,
        feedback_text: feedbackText,
      })

    if (insertErr) {
      console.error(insertErr)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }

    return NextResponse.json({ is_correct: isCorrect, feedback: feedbackText })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || 'Failed to submit answer' }, { status: 500 })
  }
}
