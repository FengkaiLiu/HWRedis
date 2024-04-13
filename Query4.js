const Redis = require('ioredis');
const redis = new Redis();  // Connects to 127.0.0.1:6379 by default

async function createLeaderboard() {
    // Reset the leaderboard sorted set
    await redis.del('leaderboard');

    // Retrieve all tweet keys
    const tweetKeys = await redis.keys('tweet:*');

    for (const key of tweetKeys) {
        const screenName = await redis.hget(key, 'screen_name');
        if (screenName) {
            // Increment the user's score (tweet count) in the sorted set
            await redis.zincrby('leaderboard', 1, screenName);
        }
    }

    // Retrieve the top 10 users
    const topUsers = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

    console.log('Top 10 users with the most tweets:');
    topUsers.forEach((value, index) => {
        // Since results include user followed by score, pair them appropriately
        if (index % 2 === 0) {
            console.log(`${value}: ${topUsers[index + 1]} tweets`);
        }
    });

    redis.disconnect();
}

createLeaderboard();