const fs = require("fs").promises;
const path = require("path");
const { chromium } = require("playwright-extra");
require("dotenv").config();

const stealth = require("puppeteer-extra-plugin-stealth")();

(async () => {
  let lastProcessedIndex = -1;
  chromium.use(stealth);

  try {
    // Read the results.json file
    const filePath = path.resolve(__dirname, "results.json");
    const data = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(data);

    // Define a realistic user-agent
    const userAgent = "Chrome/93.0.4577.63";

    // Launch Chromium with proxy settings
    let browser = await chromium.launch({
      headless: false, // Run in a non-headless mode so you can see what's happening
      proxy: {
        server: process.env.PROXY_SERVER,
        username: process.env.PROXY_USERNAME,
        password: process.env.PROXY_PASSWORD,
      },
    });

    // Create a new page directly from the browser
    let page = await browser.newPage();

    // Configure the page
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setExtraHTTPHeaders({
      "User-Agent": userAgent,
    });

    // Verify proxy connection
    try {
      await page.goto("https://geo.brdtest.com/welcome.txt");
      console.log("Successfully connected through proxy");
    } catch (error) {
      console.error("Proxy connection failed:", error);
      throw error;
    }

    let lastProcessedIndex = -1;

    // Loop through all products
    const startIndex = process.env.LAST_ITEM_SUCCESSFULLY_PROCESSED
      ? parseInt(process.env.LAST_ITEM_SUCCESSFULLY_PROCESSED)
      : 0;
    for (let i = startIndex; i < products.length; i++) {
      try {
        const product = products[i];
        console.log(
          `Processing product ${i + 1}/${products.length}: ${product.wineSearcherUrl}`,
        );

        // Visit wine-searcher.com using the pre-built URL
        await page.goto(product.wineSearcherUrl);

        // Perform random mouse movements for 3 seconds
        const startTime = Date.now();
        while (Date.now() - startTime < 3000) {
          const x = Math.floor(Math.random() * 800);
          const y = Math.floor(Math.random() * 600);
          await page.mouse.move(x, y, { steps: 25 });
          await page.waitForTimeout(Math.random() * 200); // Random pause between movements
        }

        // Check for captcha
        const hasCaptcha = await page.evaluate(() => {
          return document.body.textContent.includes("Press & Hold");
        });

        if (hasCaptcha) {
          console.log("Captcha detected - starting new session with fresh proxy...");
          
          // Close current page and browser session
          await page.close();
          await browser.close();

          // Start a new browser session with fresh proxy
          browser = await chromium.launch({
            headless: false,
            proxy: {
              server: process.env.PROXY_SERVER,
              username: process.env.PROXY_USERNAME,
              password: process.env.PROXY_PASSWORD,
            },
          });

          // Create new page with same configuration
          page = await browser.newPage();
          await page.setViewportSize({ width: 1280, height: 720 });
          await page.setExtraHTTPHeaders({
            "User-Agent": userAgent,
          });

          // Retry the same URL
          await page.goto(product.wineSearcherUrl);
          
          // Check if captcha is still present after new session
          const captchaStillPresent = await page.evaluate(() => {
            return document.body.textContent.includes("Press & Hold");
          });

          if (captchaStillPresent) {
            console.log("Captcha still present with new proxy - skipping this product");
            const scrapedData = {
              criticScore: null,
              userRating: null,
              amountOfUserRatings: null,
              amountOfCriticReviews: null,
              style: null,
              grapeVariety: null,
              foodPairing: null,
            };
            Object.assign(product, scrapedData);
            continue;
          }
        }

        // Check if page shows "Showing results for"
        const hasSearchResults = await page.evaluate(() => {
          return document.body.textContent.includes("Showing results for");
        });

        if (hasSearchResults) {
          console.log(
            "Search results page detected - skipping detailed scraping",
          );
          const scrapedData = {
            criticScore: null,
            userRating: null,
            amountOfUserRatings: null,
            style: null,
            grapeVariety: null,
            foodPairing: null,
          };
          Object.assign(product, scrapedData);
          await fs.writeFile(filePath, JSON.stringify(products, null, 2));
          lastProcessedIndex = i;
          continue;
        }

        // Wait for the profile section to load
        await page.waitForSelector(".prod-profile_rcs");

        // Extract Critic Score
        const criticScore = await page.evaluate(() => {
          const element = document.querySelector(
            ".prod-profile_rcs .badge-rating span:first-child",
          );
          return element ? parseInt(element.textContent.trim(), 10) : null;
        });

        // Extract User Rating
        const userRating = await page.evaluate(() => {
          const element = document.querySelector(".prod-profile_rcs .rating");
          if (!element || !element.getAttribute("aria-label")) return null;
          const match = element
            .getAttribute("aria-label")
            .match(/Rating ([\d.]+) of 5/);
          return match ? parseFloat(match[1]) : null;
        });

        // Extract Amount of User Ratings
        const amountOfUserRatings = await page.evaluate(() => {
          const elements = document.querySelectorAll(".prod-profile_rcs li");
          for (const el of elements) {
            if (el.textContent.includes("User Ratings")) {
              const spans = el.querySelectorAll("span");
              for (const span of spans) {
                if (
                  span.classList.length === 1 &&
                  span.classList.contains("font-light-bold") &&
                  span.textContent.trim().match(/^\d+$/)
                ) {
                  return parseInt(span.textContent.trim(), 10);
                }
              }
            }
          }
          return null;
        });

        // Extract Wine Style
        const style = await page.evaluate(() => {
          const elements = document.querySelectorAll(".prod-profile_rcs li");
          for (const el of elements) {
            if (el.textContent.includes("Style")) {
              const boldEl = el.querySelector(".font-light-bold");
              return boldEl ? boldEl.textContent.trim() : null;
            }
          }
          return null;
        });

        // Extract Grape Variety
        const grapeVariety = await page.evaluate(() => {
          const elements = document.querySelectorAll(".prod-profile_rcs li");
          for (const el of elements) {
            if (el.textContent.includes("Grape Variety")) {
              const boldEl = el.querySelector(".font-light-bold");
              return boldEl ? boldEl.textContent.trim() : null;
            }
          }
          return null;
        });

        // Extract Food Pairing
        const foodPairing = await page.evaluate(() => {
          const elements = document.querySelectorAll(".prod-profile_rcs li");
          for (const el of elements) {
            if (el.textContent.includes("Food Pairing")) {
              const boldEl = el.querySelector(".font-light-bold");
              return boldEl ? boldEl.textContent.trim() : null;
            }
          }
          return null;
        });

        // Extract Amount of Critic Reviews
        const amountOfCriticReviews = await page.evaluate(() => {
          const elements = document.querySelectorAll(".prod-profile_rcs li");
          for (const el of elements) {
            if (el.textContent.includes("Critic Review")) {
              const boldEl = el.querySelector(".font-light-bold");
              return boldEl ? parseInt(boldEl.textContent.trim(), 10) : null;
            }
          }
          return null;
        });

        // Create a new object for the scraped data
        const scrapedData = {
          criticScore,
          userRating,
          amountOfUserRatings,
          amountOfCriticReviews,
          style,
          grapeVariety,
          foodPairing,
        };

        console.log(JSON.stringify(scrapedData, null, 2));

        // Merge the scraped data with the current product
        Object.assign(product, scrapedData);

        // Write back after each successful scrape
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        lastProcessedIndex = i;

        // Close current page and browser session
        await page.close();
        await browser.close();

        // Start a new browser session with fresh proxy
        browser = await chromium.launch({
          headless: false,
          proxy: {
            server: process.env.PROXY_SERVER,
            username: process.env.PROXY_USERNAME,
            password: process.env.PROXY_PASSWORD,
          },
        });

        // Create new page with same configuration
        page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.setExtraHTTPHeaders({
          "User-Agent": userAgent,
        });
      } catch (error) {
        console.error(`Error processing product ${i + 1}:`, error);
        throw error;
      }
    }

    console.log("All products processed successfully!");
  } catch (error) {
    console.error("Error:", error);
    if (lastProcessedIndex >= 0) {
      console.log(
        `Last successfully processed product index: ${lastProcessedIndex}`,
      );
      console.log(
        `Resume from index ${lastProcessedIndex + 1} after fixing the error`,
      );
    }
  }
})();
