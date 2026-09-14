
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wutjxjubudszwgvxedgm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDY4NjYsImV4cCI6MjA5MDcyMjg2Nn0.aCdviWK8v_OwkRAVt7lLJW7ezv1lcpCokNCFu8XnFQc');

async function run() {
  const { data, error } = await supabase.from('exercises').select('id, title').ilike('title', 'glúteos %');
  if (error) throw error;
  
  // Parse the numbers
  let gluteos = data.map(ex => {
    const num = parseInt(ex.title.replace(/glúteos /i, ''), 10);
    return { ...ex, num };
  }).filter(ex => !isNaN(ex.num));
  
  // Find and delete 1 and 3 if they exist
  const toDelete = gluteos.filter(ex => ex.num === 1 || ex.num === 3);
  for (const ex of toDelete) {
    console.log('Deleting', ex.title);
    await supabase.from('exercises').delete().eq('id', ex.id);
  }
  
  // Filter out the deleted ones from our array
  gluteos = gluteos.filter(ex => ex.num !== 1 && ex.num !== 3);
  
  // Sort the remaining by original number
  gluteos.sort((a, b) => a.num - b.num);
  
  // Rename sequentially starting from 1
  for (let i = 0; i < gluteos.length; i++) {
    const newTitle = 'Glúteos ' + (i + 1);
    if (gluteos[i].title !== newTitle) {
      console.log('Renaming ' + gluteos[i].title + ' -> ' + newTitle);
      await supabase.from('exercises').update({ title: newTitle }).eq('id', gluteos[i].id);
    }
  }
  console.log('Finished updating Glúteos. Count: ' + gluteos.length);
}
run();

