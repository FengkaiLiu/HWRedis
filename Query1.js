const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const redis = new Redis(); // Connects to 127.0.0.1:6379 by default
const mongoUrl = 'mongodb://:@localhost:27017/ieeevisTweets';

async function countTweets() {
    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        const database = client.db('ieeevisTweets');
        const collection = database.collection('tweets'); 

        // Count tweets in MongoDB
        const tweetCount = await collection.countDocuments();

        // Set tweetCount in Redis
        await redis.set('tweetCount', 0); // Initialize tweetCount to 0
        await redis.incrby('tweetCount', tweetCount); // Increment tweetCount by the number of tweets

        // Get the last value of tweetCount
        const finalCount = await redis.get('tweetCount');
        console.log(`There were ${finalCount} tweets`);

    } finally {
        await client.close();
        redis.disconnect();
    }
}

countTweets();