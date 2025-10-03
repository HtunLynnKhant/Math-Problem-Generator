import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

// For backward
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

export type Database = {
  public: {
    Tables: {
      math_problem_sessions: {
        Row: {
          id: string;
          created_at: string;
          problem_text: string;
          correct_answer: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          problem_text: string;
          correct_answer: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          problem_text?: string;
          correct_answer?: number;
        };
      };
      math_problem_submissions: {
        Row: {
          id: string;
          session_id: string;
          user_answer: number;
          is_correct: boolean;
          feedback_text: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_answer: number;
          is_correct: boolean;
          feedback_text: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_answer?: number;
          is_correct?: boolean;
          feedback_text?: string;
        };
      };
    };
  };
};
