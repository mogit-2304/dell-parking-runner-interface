
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jqmyhansgyuyloklelht.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbXloYW5zZ3l1eWxva2xlbGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODM2MTcsImV4cCI6MjA2MzA1OTYxN30.u_SrXMgMqoS4LPsU96CfS-Kq-U_Ene65gc_gMC74PFs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
