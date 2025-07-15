import { createClient } from '@supabase/supabase-js';

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
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});

// Optional: Debug log (remove/comment out in production)
console.log('[Supabase] Using URL:', supabaseUrl);
console.log('[Supabase] Using ANON KEY:', supabaseAnonKey?.slice(0, 8) + '...');

// Types
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
