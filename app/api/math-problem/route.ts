import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Helper to get Gemini model
function getModel() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('Missing GOOGLE_API_KEY')
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

export async function POST() {
  try {
    const model = getModel()

    const prompt = `You are an assistant generating ONE Primary 5 level math word problem suitable for 10-11 year olds in Singapore.
Return ONLY a strict JSON object with keys problem_text (string) and final_answer (number). The number must be the final numeric answer without units.
Constraints:
- Problem should be solvable with whole numbers, no complex fractions.
- Keep it short (2-4 sentences).
- Topics can include: four operations, multi-step arithmetic, time, money, simple ratios, simple averages.
Example JSON format:
{"problem_text":"A shop had 60 apples. It sold 35 in the morning and 15 in the afternoon. How many apples are left?","final_answer":10}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Try to parse JSON in the model's response (strip code fences if present)
    const jsonText = text.replace(/^```json\n?|\n?```$/g, '').trim()
    let parsed: { problem_text: string; final_answer: number }
    try {
      parsed = JSON.parse(jsonText)
    } catch (e) {
      throw new Error('AI did not return valid JSON')
    }

    if (
      !parsed ||
      typeof parsed.problem_text !== 'string' ||
      (typeof parsed.final_answer !== 'number' && typeof parsed.final_answer !== 'string')
    ) {
      throw new Error('AI JSON missing required fields')
    }

    const finalAnswerNum = Number(parsed.final_answer)
    if (!Number.isFinite(finalAnswerNum)) {
      throw new Error('final_answer is not a valid number')
    }

    // Save to Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('math_problem_sessions')
      .insert({ problem_text: parsed.problem_text, correct_answer: finalAnswerNum })
      .select('id')
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ 
        error: 'Failed to save session', 
        details: insertError.message,
        code: insertError.code 
      }, { status: 500 })
    }

    return NextResponse.json({
      session_id: insertData.id,
      problem: {
        problem_text: parsed.problem_text,
        final_answer: finalAnswerNum,
      },
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || 'Failed to generate problem' }, { status: 500 })
  }
}
