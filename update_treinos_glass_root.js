const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');

const regexRootDiv = /return \(\s*<div style=\{\{ animation: 'fade-in 0.4s ease-out', paddingBottom: '40px', width: '100%', maxWidth: '600px', margin: '0 auto' \}\}>/;

const replaceStr = `return (
                <div style={{ 
                    animation: 'fade-in 0.4s ease-out', 
                    paddingBottom: '40px', 
                    width: '100%',
                    minHeight: '100vh',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #020617, #0f172a, #000000)'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: "url('muscles.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none'
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>`;

const newCode = code.replace(regexRootDiv, replaceStr);

fs.writeFileSync('index.html', newCode, 'utf8');
console.log(newCode.includes("url('muscles.png')") ? "Success" : "Failed");
