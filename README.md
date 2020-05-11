# Instagram bot

## Features

- login instagram
- like by tags 

## How to use

Go to `src/config.js` and enter login ans password

```js
const config = {
    COUNT_OF_LIKED_POST : 6, 
    WAIT_TIME_BETWEEN_LIKE: 1000,
    tags: [],
    HEADLESS: true,
    INSTAGRAM_LOGIN: 'YOUR_LOGIN',
    INSTAGRAM_PASSWORD: 'YOUR_PASSWORD'
};
```

Please don't forget write a tags.

## Run

```shell script
npm install
npm start
```
