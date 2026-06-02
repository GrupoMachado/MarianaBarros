const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE ERROR:', error.message);
    });

    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index.html', { waitUntil: 'networkidle0' });
    
    // Check if #root is empty
    const rootHtml = await page.$eval('#root', el => el.innerHTML).catch(() => 'NO_ROOT');
    console.log('ROOT HTML LENGTH:', rootHtml.length);
    console.log('ROOT CONTENT (first 100 chars):', rootHtml.substring(0, 100));

    await browser.close();
})();
