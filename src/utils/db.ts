import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  // Use Supabase in production (Vercel)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  export const db = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Use local PostgreSQL in development
  const connectionString = process.env.DATABASE_URL!;
  const client = postgres(connectionString);
  export const db = drizzle(client);
} 