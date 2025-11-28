import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thpecvbrfrxvyigvrfll.supabase.co';
const supabaseKey = 'sb_publishable_bsan-HYYLaUgLxVhsuYafQ_RIOanXqT';

export const supabase = createClient(supabaseUrl, supabaseKey);