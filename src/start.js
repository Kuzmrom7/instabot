const config = require("./config");
const ig = require('./instagram');

(async () => {
    await ig.initialize(config);

    await ig.login(config.INSTAGRAM_LOGIN, config.INSTAGRAM_PASSWORD);

    await ig.likeByTags(config.tags);

    await ig.close();
})();
