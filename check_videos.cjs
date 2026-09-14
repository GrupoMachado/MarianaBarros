
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient('https://wutjxjubudszwgvxedgm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDY4NjYsImV4cCI6MjA5MDcyMjg2Nn0.aCdviWK8v_OwkRAVt7lLJW7ezv1lcpCokNCFu8XnFQc');

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(false);
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

async function run() {
  console.log('Fetching exercises...');
  const { data: exercises, error } = await supabase.from('exercises').select('id, title, video_url');
  if (error) { console.error(error); return; }
  
  console.log('Found ' + exercises.length + ' exercises. Checking URLs...');
  
  let deletedCount = 0;
  const batchSize = 10;
  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);
    await Promise.all(batch.map(async (ex) => {
      const isAlive = await checkUrl(ex.video_url);
      if (!isAlive) {
        console.log('[DEAD] Deleting: ' + ex.title + ' (' + ex.video_url + ')');
        await supabase.from('exercises').delete().eq('id', ex.id);
        deletedCount++;
      } else {
        console.log('[OK] ' + ex.title);
      }
    }));
  }
  
  console.log('Done! Deleted ' + deletedCount + ' broken exercises.');
}
run();

