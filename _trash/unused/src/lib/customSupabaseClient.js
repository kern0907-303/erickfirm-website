import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbbnjasjyfuatkvnoogi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYm5qYXNqeWZ1YXRrdm5vb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDI2NjIsImV4cCI6MjA4MzAxODY2Mn0.uy7vPbCoviDntEMh9lG4UdTmoWhAODFAQ71BMJqCX2c';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
