const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com';
const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

function getTagUrl(tag) {
    return `${BASE_URL}/explore/tags/${tag}`;
}

const InstMethods = {
    browser: null,
    page: null,
    config: null,
    wait: async (ms) => {
        await InstMethods.page.waitFor(ms)
    },
    goto: async (url) => {
        await InstMethods.page.goto(url, {waitUntil: 'networkidle2'})
    },
    close: async () => {
        console.log('---> close');
        await InstMethods.browser.close();
    },
    initialize: async (config = {}) => {
        console.log('---> initialize');

        /* Set config */
        InstMethods.config = config;

        InstMethods.browser = await puppeteer.launch({
            headless: InstMethods.config.HEADLESS || false
        });

        InstMethods.page = await InstMethods.browser.newPage();

        await InstMethods.page.setUserAgent(USER_AGENT);

        console.log(InstMethods.config);

        await InstMethods.page.goto(BASE_URL, {waitUntil: 'networkidle2'})
    },
    login: async (username, password) => {
        console.log('---> login');
        // go to page
        await InstMethods.page.goto(BASE_URL, {waitUntil: 'networkidle2'});

        await InstMethods.wait(1000);

        // get inputs
        await InstMethods.page.type('input[name="username"]', username, {delay: 50});
        await InstMethods.page.type('input[name="password"]', password, {delay: 50});

        // click to LogIn button
        let loginButton = await InstMethods.page.$('button[type="submit"]');
        await loginButton.click();
        await InstMethods.wait(3000);
    },
    likeByTags: async (tags = []) => {

        console.log('---> likeByTags');

        for (let tag of tags) {

            console.log('---> likeByTags ---> tag=', tag);

            await InstMethods.goto(getTagUrl(tag));
            await InstMethods.wait(1000);

            let posts = await InstMethods.page.$$('article > div:nth-child(3) img[decoding="auto"]');

            if (posts.length === 0) {
                posts = await InstMethods.page.$$('article > div:nth-child(1) img[decoding="auto"]');
            }


            for (let i = 0; i < InstMethods.config.COUNT_OF_LIKED_POST; i++) {
                console.log('---> likeByTags ---> tag=', tag, " ---> post number=", i);
                let post = posts[i];
                await post.click();

                await InstMethods.page.waitFor(('div[role="dialog"]'));
                await InstMethods.wait(1000);

                let isLikable = await InstMethods.page.$('svg[aria-label="Like"]');

                await InstMethods.wait(1000);

                if (isLikable) {
                    let like = await InstMethods.page.$('svg[aria-label="Like"]');
                    await like.click();
                }

                await InstMethods.wait(3000);

                // Close the modal
                let closeModalButton = await InstMethods.page.$('svg[aria-label="Close"]');
                await closeModalButton.click();

                await InstMethods.wait(1000);

            }

            await InstMethods.wait(InstMethods.config.WAIT_TIME_BETWEEN_LIKE || 30000);
        }
    }
};


module.exports = InstMethods;

