const puppeteer = require("puppeteer-extra")
const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
puppeteer.use(StealthPlugin())
puppeteer.use(UserAgentPlugin({makeWindows: true}))

module.exports.initiateBrowser = async function (browserDir, showWeb = false) {
    return await puppeteer.launch({
        headless: !showWeb,
        defaultViewport: null,
        userDataDir: browserDir,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [
            '--no-sandbox',
            '--disable-gpu',
            '--start-fullscreen',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
}

module.exports.initiatePage = async function (mainBrowser) {
    const mainPage = await mainBrowser.newPage();
    await mainPage.setViewport({
        width: 1366 + Math.floor(Math.random() * 100),
        height: 768 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false,
        isLandscape: false,
    });
    mainPage.on('error', async err => {
        console.error(err)
        if (this.mainPage.isClosed() === false) {
            await this.mainPage.reload();
        }
    });
    return mainPage;
}
