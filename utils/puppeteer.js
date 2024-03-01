const puppeteer = require("puppeteer-extra")
const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
puppeteer.use(StealthPlugin())
puppeteer.use(UserAgentPlugin({makeWindows: true}))

module.exports.initiateBrowser = async function (browserDir, showWeb = false) {
    let executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if (process.platform === "linux") {
        executablePath = "/usr/bin/google-chrome"
    }
    if (process.platform === "win32") {
        executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    }
    return await puppeteer.launch({
        headless: !showWeb,
        defaultViewport: null,
        userDataDir: browserDir,
        executablePath: executablePath,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [
            '--incognito',
            '--no-sandbox',
            '--disable-gpu',
            '--start-fullscreen',
            '--disable-notifications',
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
