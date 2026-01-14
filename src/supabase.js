
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvfxouxsbhvczutopjfw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZnhvdXhzYmh2Y3p1dG9wamZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODc1MjQsImV4cCI6MjA4MzM2MzUyNH0.J-619gr8CGuWDN9J6Qd6itlg78Jvu-crWLcPdXeMeiU'

export const supabase = createClient(supabaseUrl, supabaseKey)
