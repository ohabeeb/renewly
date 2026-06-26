import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://optopjrtabraofhkhghq.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdG9wanJ0YWJyYW9maGtoZ2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjc4MTEsImV4cCI6MjA5NzkwMzgxMX0.UxaXjGlWqYfiyppPfRnGVQtyulxJYtS_BgAfc6kJqEQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
