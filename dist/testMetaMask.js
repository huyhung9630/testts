"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");
function testMetaMask() {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionPath = path.resolve(__dirname, '..', 'temp', 'metamask-chrome'); // Replace with the actual MetaMask extension path
        // Set Chrome options to load MetaMask extension
        const options = new chrome.Options();
        options.addArguments(`--disable-extensions-except=${extensionPath}`);
        options.addArguments(`--load-extension=${extensionPath}`);
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-setuid-sandbox');
        options.addArguments('--window-size=1280,800');
        const driver = yield new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        driver.manage().setTimeouts({ implicit: 10000 });
        try {
            // Wait for MetaMask to load
            yield driver.sleep(5000);
            // Switch to MetaMask window (it opens in a new tab usually)
            const handles = yield driver.getAllWindowHandles();
            yield driver.switchTo().window(handles[1]);
            // Click the terms and conditions checkbox and proceed
            yield driver.findElement(selenium_webdriver_1.By.css('input[data-testid="onboarding-terms-checkbox"]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Import an existing wallet")]')).click();
            // Opt out of MetaMetrics
            yield driver.findElement(selenium_webdriver_1.By.id('metametrics-opt-in')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"I agree")]')).click();
            // Entering secret recovery phrase
            const secretPhrases = [
                "noodle", "shy", "west", "loyal", "stone",
                "present", "asthma", "target", "space",
                "tattoo", "disorder", "desk"
            ];
            for (let i = 0; i < secretPhrases.length; i++) {
                yield driver.findElement(selenium_webdriver_1.By.css(`input[data-testid="import-srp__srp-word-${i}"]`)).sendKeys(secretPhrases[i]);
            }
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Confirm Secret Recovery Phrase")]')).click();
            // Create MetaMask password
            const password = "Hieu12344.";
            yield driver.findElement(selenium_webdriver_1.By.css('input[data-testid="create-password-new"]')).sendKeys(password);
            yield driver.findElement(selenium_webdriver_1.By.css('input[data-testid="create-password-confirm"]')).sendKeys(password);
            yield driver.findElement(selenium_webdriver_1.By.css('input[data-testid="create-password-terms"]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Import my wallet")]')).click();
            yield driver.sleep(2000);
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Got it")]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Next")]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Done")]')).click();
            yield driver.sleep(5000); // Wait for setup
            // Switch network to Sepolia
            yield driver.findElement(selenium_webdriver_1.By.css('button[data-testid="network-display"]')).click();
            yield driver.findElement(selenium_webdriver_1.By.css('label[tabindex="0"]')).click();
            yield driver.sleep(3000);
            yield driver.findElement(selenium_webdriver_1.By.xpath('//p[contains(text(),"Sepolia")]')).click();
            // Open a new tab and go to your external website
            yield driver.switchTo().newWindow('tab'); // Open a new tab
            yield driver.get('https://development.arttaca.io/'); // Navigate to the new page
            const newHandles = yield driver.getAllWindowHandles();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Connect")]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//span[contains(text(),"Connect a Wallet")]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//span[contains(text(),"MetaMask")]')).click();
            yield driver.sleep(15000); // Wait for MetaMask popup to appear
            const newestHandles = yield driver.getAllWindowHandles();
            yield driver.switchTo().window(newestHandles[4]);
            // Confirm connection
            // await driver.findElement(By.xpath('//button[contains(text(),"Next")]')).click();
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Confirm")]')).click();
            yield driver.switchTo().window(newestHandles[3]);
            yield driver.findElement(selenium_webdriver_1.By.css('button.css-hnz0pg')).click();
            yield driver.sleep(7000); // Wait for interaction
            yield driver.switchTo().window(newestHandles[4]);
            yield driver.findElement(selenium_webdriver_1.By.xpath('//button[contains(text(),"Confirm")]')).click();
            yield driver.sleep(60000);
        }
        finally {
            // Close the browser after testing
            yield driver.quit();
        }
    });
}
testMetaMask().catch(err => console.error(err));
