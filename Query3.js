const Redis = require('ioredis');
const redis = new Redis();  // Connects to 127.0.0.1:6379 by default

async function countDistinctUsers() {
    // Initialize an empty set for screen names
    await redis.del('screen_names');  // Optional: clear previous data

    // Assuming you know the range or have a way to get all tweet IDs
    const tweetKeys = await redis.keys('tweet:*');  // Get all tweet keys

    for (const key of tweetKeys) {
        const screenName = await redis.hget(key, 'screen_name');  // Get the screen_name from each tweet hash
        if (screenName) {
            await redis.sadd('screen_names', screenName);  // Add to the set of unique screen names
        }
    }

    const distinctUsersCount = await redis.scard('screen_names');  // Get the number of distinct users
    console.log(`There are ${distinctUsersCount} distinct users in the dataset.`);
    redis.disconnect();
}

countDistinctUsers();