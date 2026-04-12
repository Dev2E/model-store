import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgsqcdjmfzepqyyzdymm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnc3FjZGptZnplcHF5eXpkeW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MzIyNzAsImV4cCI6MjAyMTAwODI3MH0.sJFXrBhTkfuHXNXPWu0eSvSHN4TyU35l71jTWvWIglc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .limit(3);

    if (error) {
      console.error('Erro:', error.message);
      return;
    }

    console.log('PRODUTOS NO BANCO:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkProducts();
