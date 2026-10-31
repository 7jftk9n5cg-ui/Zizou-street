import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://enuwuwynbobwzfiulori.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_vI3Z5EzxcF9AaGPOKfxmng_XlEuiy0O';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
