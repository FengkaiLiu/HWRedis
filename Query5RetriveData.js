const Redis = require('ioredis');
const redis = new Redis();

async function getTweetsForUser(screenName) {
    const userTweetsKey = `tweets:${screenName}`;
    const tweetIds = await redis.lrange(userTweetsKey, 0, -1);
    const tweets = [];

    for (const tweetId of tweetIds) {
        const tweetData = await redis.hgetall(`tweet:${tweetId}`);
        tweets.push(tweetData);
    }

    console.log(`Tweets for ${screenName}:`, tweets);
    redis.disconnect();
}

// Replace 'duto_guerra' with the screen name of interest when calling
getTweetsForUser('duto_guerra');