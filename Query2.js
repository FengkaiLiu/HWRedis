const Redis = require('ioredis');
const redis = new Redis();  // Connects to 127.0.0.1:6379 by default

async function sumFavorites() {
    // Initialize the favoritesSum key in Redis
    await redis.set('favoritesSum', 0);

    // Retrieve all tweet keys from Redis
    const tweetKeys = await redis.keys('tweet:*');

    for (const key of tweetKeys) {
        const favoriteCount = await redis.hget(key, 'favorite_count');  // Get the favorite_count from each tweet hash
        if (favoriteCount) {
            await redis.incrby('favoritesSum', parseInt(favoriteCount, 10));  // Add to the sum of favorites
        }
    }

    const totalFavorites = await redis.get('favoritesSum');  // Retrieve the total favorites sum
    console.log(`Total number of favorites in the dataset: ${totalFavorites}`);
    redis.disconnect();
}

sumFavorites();
