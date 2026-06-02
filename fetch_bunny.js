const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'video.bunnycdn.com',
  path: '/library/630822/videos?page=1&itemsPerPage=1000',
  method: 'GET',
  headers: {
    'AccessKey': 'df691b76-928c-4f85-a140faa5fa1f-8c5f-40b7',
    'accept': 'application/json'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        if (json && json.items) {
            const list = json.items.map(v => ({
                title: v.title,
                url: `https://vz-f56588b2-589.b-cdn.net/${v.guid}/play_720p.mp4`
            }));
            
            let html = fs.readFileSync('C:\\Users\\rafae\\Desktop\\APP\\admin-triage.html', 'utf8');
            
            // Replace fetchVideos implementation
            const newFetchVideos = `
        async function fetchVideos() {
            videoList = ${JSON.stringify(list, null, 4)};
            if(videoList.length > 0) {
                currentIndex = 0;
                showAlert(\`\${videoList.length} vídeos injetados nativamente!\`, 'success');
                
                elName.disabled = false;
                elGroup.disabled = false;
                elTarget.disabled = false;
                elSaveBtn.disabled = false;
                elSetup.style.display = 'none';
                
                updateUI();
            } else {
                showAlert('A biblioteca está vazia.', 'error');
                elSetup.textContent = 'Nenhum vídeo encontrado.';
            }
        }
            `;
            
            html = html.replace(/async function fetchVideos\(\) \{[\s\S]*?\n        \}/, newFetchVideos);
            
            fs.writeFileSync('C:\\Users\\rafae\\Desktop\\APP\\admin-triage.html', html, 'utf8');
            console.log("Successfully retrieved " + list.length + " videos and updated admin-triage.html.");
        } else {
            console.error("Invalid response format:", json);
        }
    } catch(e) {
        console.error("Error parsing/writing:", e);
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
