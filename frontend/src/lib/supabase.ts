import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      pastes: {
        Row: {
          id: string;
          room_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      visit_counts: {
        Row: {
          id: number;
          count: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          count?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          count?: number;
          updated_at?: string;
        };
      };
    };
    Functions: {
      increment_count: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
};

// Get values from .env (must be set in root)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hard error if not set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] Missing environment variables! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});
