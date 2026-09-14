import { supabase } from './supabase.js';

async function test() {
  const { data, error } = await supabase.from('evolucao_corporal').insert({
    peso: 75,
    altura: 1.80
  }).select();
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
