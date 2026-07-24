

const { createClient } = require("redis");

const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PW,
    socket: {
        host: "dramatic-show-verse-33461.db.redis.io",
        port: 12583,
    },
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

module.exports = redisClient;
 