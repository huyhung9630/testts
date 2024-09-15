import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';
import { Options } from 'selenium-webdriver/chrome';

async function testMetaMask() {
    const extensionPath = path.resolve(__dirname, '..', 'temp', 'metamask-chrome');  // Replace with the actual MetaMask extension path

    // Set Chrome options to load MetaMask extension
    const options = new chrome.Options();
    options.addArguments(`--disable-extensions-except=${extensionPath}`);
    options.addArguments(`--load-extension=${extensionPath}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-setuid-sandbox');
    options.addArguments('--window-size=1280,800');

    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    driver.manage().setTimeouts({ implicit: 10000 });
    try {
        // Wait for MetaMask to load
        await driver.sleep(5000);

        // Switch to MetaMask window (it opens in a new tab usually)
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);

        // Click the terms and conditions checkbox and proceed
        await driver.findElement(By.css('input[data-testid="onboarding-terms-checkbox"]')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"Import an existing wallet")]')).click();

        // Opt out of MetaMetrics
        await driver.findElement(By.id('metametrics-opt-in')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"I agree")]')).click();

        // Entering secret recovery phrase
        const secretPhrases = [
            "noodle", "shy", "west", "loyal", "stone", 
            "present", "asthma", "target", "space", 
            "tattoo", "disorder", "desk"
        ];

        for (let i = 0; i < secretPhrases.length; i++) {
            await driver.findElement(By.css(`input[data-testid="import-srp__srp-word-${i}"]`)).sendKeys(secretPhrases[i]);
        }

        await driver.findElement(By.xpath('//button[contains(text(),"Confirm Secret Recovery Phrase")]')).click();

        // Create MetaMask password
        const password = "Hieu12344.";
        await driver.findElement(By.css('input[data-testid="create-password-new"]')).sendKeys(password);
        await driver.findElement(By.css('input[data-testid="create-password-confirm"]')).sendKeys(password);
        await driver.findElement(By.css('input[data-testid="create-password-terms"]')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"Import my wallet")]')).click();

        await driver.sleep(2000);

        await driver.findElement(By.xpath('//button[contains(text(),"Got it")]')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"Next")]')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"Done")]')).click();

        await driver.sleep(5000);  // Wait for setup

        // Switch network to Sepolia
        await driver.findElement(By.css('button[data-testid="network-display"]')).click();
        await driver.findElement(By.css('label[tabindex="0"]')).click();
        
        await driver.sleep(3000);
        
        await driver.findElement(By.xpath('//p[contains(text(),"Sepolia")]')).click();

        // Open a new tab and go to your external website
        await driver.switchTo().newWindow('tab');  // Open a new tab
        await driver.get('https://development.arttaca.io/');  // Navigate to the new page
        const newHandles = await driver.getAllWindowHandles();
        
        await driver.findElement(By.xpath('//button[contains(text(),"Connect")]')).click();
        await driver.findElement(By.xpath('//span[contains(text(),"Connect a Wallet")]')).click();
        await driver.findElement(By.xpath('//span[contains(text(),"MetaMask")]')).click();

        await driver.sleep(15000);  // Wait for MetaMask popup to appear
        const newestHandles = await driver.getAllWindowHandles();
        await driver.switchTo().window(newestHandles[4]);

        // Confirm connection
        await driver.findElement(By.xpath('//button[contains(text(),"Next")]')).click();
        await driver.findElement(By.xpath('//button[contains(text(),"Confirm")]')).click();

        await driver.switchTo().window(newestHandles[3]);
        await driver.findElement(By.css('button.css-hnz0pg')).click();

        await driver.sleep(7000);  // Wait for interaction
        await driver.switchTo().window(newestHandles[4]);
        await driver.findElement(By.xpath('//button[contains(text(),"Confirm")]')).click();

        await driver.sleep(60000);

    } finally {
        // Close the browser after testing
        await driver.quit();
    }
}

testMetaMask().catch(err => console.error(err));
