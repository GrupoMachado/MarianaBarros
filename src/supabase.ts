import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wutjxjubudszwgvxedgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDY4NjYsImV4cCI6MjA5MDcyMjg2Nn0.aCdviWK8v_OwkRAVt7lLJW7ezv1lcpCokNCFu8XnFQc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
