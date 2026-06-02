const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove script / styles da wistia no header
const wistiaHeadRegex = /<script src="https:\/\/fast\.wistia\.com\/player\.js" async><\/script>[\s\S]*?<style>[\s\S]*?wistia-player\[media-id='62fxa7yq9p'\]:not\(:defined\) \{[\s\S]*?\}[\s\S]*?<\/style>/m;
content = content.replace(wistiaHeadRegex, '');

// 2. Substituir a tag wistia no body por vídeo HTML5
const wistiaTagRegex = /<wistia-player media-id="62fxa7yq9p" aspect="[^"]+"><\/wistia-player>/;
const html5Video = '<video src="./instalar_app.mp4" controls playsinline preload="metadata" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);"></video>';
content = content.replace(wistiaTagRegex, html5Video);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Video updated to local HTML5 video');
