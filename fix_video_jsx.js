const fs = require('fs');
const filePath = 'c:/Users/rafae/Desktop/APP/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /<video src="\.\/instalar_app\.mp4" controls playsinline preload="metadata" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba\(0,0,0,0\.5\);"><\/video>/;
const jsxVideo = '<video src="./instalar_app.mp4" controls playsInline preload="metadata" style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}></video>';

if (regex.test(content)) {
    content = content.replace(regex, jsxVideo);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Video JSX properties fixed');
} else {
    console.log('Regex did not match');
}
