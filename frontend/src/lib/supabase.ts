import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2NzI2MCwiZXhwIjoxOTYxNjQzMjYwfQ.dummy-anon-key-for-development';

// Note: Using dummy values for development. Replace with actual Supabase credentials.
console.warn('Using dummy Supabase values. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file for production.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      pastes: {
        Row: {
          id: string;
          room_id: string;
          content: string;
          passkey: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          content?: string;
          passkey?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          content?: string;
          passkey?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};