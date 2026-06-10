import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Trend = {
  id: string;
  name: string;
  traits: string[];
  description: string;
};

export type TrendImage = {
  id: string;
  trend_id: string;
  url: string;
  source: string;
  attribution: string;
  sort_order: number;
};

export type Moodboard = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type MoodboardImage = {
  id: string;
  moodboard_id: string;
  image_url: string;
  trend_name: string;
  attribution: string;
  sort_order: number;
  added_at: string;
};

export type TrendMatch = {
  trend_id: string;
  trend_name: string;
  rationale: string;
  traits: string[];
  images: TrendImage[];
};
