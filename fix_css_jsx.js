const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const styleBlock = `<style>
            @keyframes spinWave { 100% { transform: rotate(360deg); } }
            .water-circle-container {
                position: relative;
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: rgba(14, 165, 233, 0.1);
                border: 4px solid rgba(14, 165, 233, 0.3);
                overflow: hidden;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .water-wave {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.9) 100%);
                left: -50%;
                border-radius: 40%;
                animation: spinWave 6s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-wave-2 {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(14, 165, 233, 0.6) 0%, rgba(3, 105, 161, 0.8) 100%);
                left: -50%;
                border-radius: 35%;
                animation: spinWave 4s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 24px;
                font-weight: 900;
                z-index: 10;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1;
            }
            .water-amount {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255,255,255,0.9);
                margin-top: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>`;

// Remove the <style> block from wherever it is inside the JSX
let cleanedHtml = c;

// Let's find the exact string inside EvolucaoCorporal and remove it
const jsxStyleBlock = `                        <style>
            @keyframes spinWave { 100% { transform: rotate(360deg); } }
            .water-circle-container {
                position: relative;
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: rgba(14, 165, 233, 0.1);
                border: 4px solid rgba(14, 165, 233, 0.3);
                overflow: hidden;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .water-wave {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.9) 100%);
                left: -50%;
                border-radius: 40%;
                animation: spinWave 6s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-wave-2 {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(14, 165, 233, 0.6) 0%, rgba(3, 105, 161, 0.8) 100%);
                left: -50%;
                border-radius: 35%;
                animation: spinWave 4s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 24px;
                font-weight: 900;
                z-index: 10;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1;
            }
            .water-amount {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255,255,255,0.9);
                margin-top: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>`;

if(cleanedHtml.includes(jsxStyleBlock)) {
    cleanedHtml = cleanedHtml.replace(jsxStyleBlock, '');
} else {
    // try replacing via regex if whitespace is slightly different
    cleanedHtml = cleanedHtml.replace(/<style>\s*@keyframes spinWave[\s\S]*?<\/style>/, '');
}

// Inject into the actual global head styles
if(!cleanedHtml.includes('keyframes spinWave')) {
    cleanedHtml = cleanedHtml.replace('</style>', `
            @keyframes spinWave { 100% { transform: rotate(360deg); } }
            .water-circle-container {
                position: relative;
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: rgba(14, 165, 233, 0.1);
                border: 4px solid rgba(14, 165, 233, 0.3);
                overflow: hidden;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .water-wave {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.9) 100%);
                left: -50%;
                border-radius: 40%;
                animation: spinWave 6s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-wave-2 {
                position: absolute;
                width: 200%;
                height: 200%;
                background: linear-gradient(180deg, rgba(14, 165, 233, 0.6) 0%, rgba(3, 105, 161, 0.8) 100%);
                left: -50%;
                border-radius: 35%;
                animation: spinWave 4s linear infinite;
                transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .water-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 24px;
                font-weight: 900;
                z-index: 10;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1;
            }
            .water-amount {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255,255,255,0.9);
                margin-top: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>`);
}

fs.writeFileSync('index.html', cleanedHtml);
console.log('Fixed CSS syntax in JSX!');
