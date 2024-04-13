const Redis = require('ioredis');
const redis = new Redis();

async function addTweetToRedis(tweet) {
    const tweetIdKey = `tweet:${tweet.id}`;
    const userTweetsKey = `tweets:${tweet.screen_name}`;

    await redis.rpush(userTweetsKey, tweet.id);
    await redis.hmset(tweetIdKey, {
        'user_name': tweet.screen_name,
        'text': tweet.text,
        'created_at': tweet.created_at
    });
}

async function populateRedis() {
    const tweets = [
        { id: 123, screen_name: 'duto_guerra', text: 'Hello Redis!', created_at: '2021-01-01' },
        { id: 143, screen_name: 'duto_guerra', text: 'Redis is fun!', created_at: '2021-01-02' }
    ];

    for (const tweet of tweets) {
        await addTweetToRedis(tweet);
    }

    console.log('All tweets added to Redis.');
    redis.disconnect();
}

populateRedis();