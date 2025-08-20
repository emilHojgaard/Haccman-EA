import { createClient } from "redis";

//Creating redis-client
export const client = createClient({
    url: `redis://${process.env.redis_host}:${process.env.PORT2 || 12056}`,
});

client.on("error", (err) => console.error("Redis Client Error:", err));
client.on("connect", () => console.log("Redis client connecting..."));
client.on("ready", () => console.log("Redis client ready!"));

// ORIGINAL, WITH PASSWORD INSTEAD OF URL
// export const client = createClient({
//     password: process.env.redis_password,
//     socket: {
//         host: process.env.redis_host,
//         port: (process.env.PORT2 || 12056)
//     }
// });

// client.on('error', (err) => console.log('Redis Client Error', err));
