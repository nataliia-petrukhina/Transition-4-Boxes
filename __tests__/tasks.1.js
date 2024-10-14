const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');
const { log } = require("console");
const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('CSS animation', () => {
    it("The page should contain 4 boxes with background color", async () => {
        // get all elements has background color
        const boxes = await page.evaluate(() => {
            const box = Array.from(document.querySelectorAll('*'));
            // return all computedStyle background color not white of all elements
            return box.map(item => window.getComputedStyle(item).getPropertyValue('background-color')).filter(item => item !== 'rgba(0, 0, 0, 0)');
        });
        expect(boxes.length).toBe(4);
    });
    it('boxes should be square', async () => {
        // get all elements has background color
        const boxes = await page.evaluate(() => {
            const box = Array.from(document.querySelectorAll('*'));
            // return all computedStyle background color not white of all elements
            return box.map(item => window.getComputedStyle(item).getPropertyValue('background-color')).filter(item => item !== 'rgba(0, 0, 0, 0)');
        });
        // get boxes computed style height and width values and compare them to each other to check if they are equal or not 
        const boxDimensions = await page.evaluate(() => {
            const boxes = Array.from(document.querySelectorAll('*'));
            return boxes.map(item => {
                return {
                    height: window.getComputedStyle(item).getPropertyValue('height'),
                    width: window.getComputedStyle(item).getPropertyValue('width'),
                    backgroundColor: window.getComputedStyle(item).getPropertyValue('background-color')
                }
            }).filter(item => item.height === item.width && item.backgroundColor !== 'rgba(0, 0, 0, 0)');
        }).catch(err => {
            console.log(err);
        }).then(item => {
            return item;
        }).catch(err => {
            console.log(err);
        })
        // expect all boxes to be square
        expect(boxDimensions.length).toBe(4);
    }),
    it("CSS 'transform' property should be defined for the boxes", async () => {
        const stylesheet = fs
        .readFileSync("./style.css")
        .toString("utf-8")
        .replace(/ /g, "");
        const transforms = stylesheet.match(/transform:([^;]+);/g);
        expect(transforms).toBeDefined();
        expect(transforms.length).toBeGreaterThanOrEqual(2);   
    });
});
