import 'dotenv/config';
import express from 'express';
import { sendPrompts, firstGuardRail, secondGuardRail, interaction, ensureRedisConnection } from './apiController.js';
import { client } from './redisClient.js';

const router = express.Router();


// Middleware to ensure Redis connection
const redisMiddleware = async (req, res, next) => {
    try {
        if (!client.isReady) {
            await client.connect();
            console.log("Redis connected!");
        }
        next();
    } catch (err) {
        console.error("Could not connect to Redis:", err);
        res.status(500).json({ error: "Redis connection failed" });
    }
};

// Apply middleware
// router.use(redisMiddleware);

// Routes
router.get('/response1999/:param1/:param2/:param3', sendPrompts);
router.get('/firstguard/:param1/:param2/', firstGuardRail);
router.get('/secondguard/:param1/:param2/', secondGuardRail);
router.post('/interaction/:user/:content/:timestamp/:type', interaction);

//TEST LOCAL BACKEND
router.get('/ping', (req, res) => {
    res.json({ message: "Pong" });
});

export default router;
