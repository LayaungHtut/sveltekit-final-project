/* lib/superbaseClient */

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://viwehmbmyfpienmywjxj.supabase.co', // replace with your URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpd2VobWJteWZwaWVubXl3anhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODc0MDAsImV4cCI6MjA3MTM2MzQwMH0.Ngv1ZA7pwMyeywRQv1GjLoovUr-ZC-igyARrLr1Xwf4'                  // replace with your anon key
);

