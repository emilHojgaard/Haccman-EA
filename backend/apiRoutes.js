import { createClient } from 'redis';
import 'dotenv/config';
import express from 'express';
import { sendPrompts, firstGuardRail, secondGuardRail, interaction, ensureRedisConnection } from './apiController.js';

const router = express.Router();

//starting client according to redis instructions
const client = createClient({
    password: process.env.redis_password,
    socket: {
        host: process.env.redis_host,
        port: (process.env.PORT2 || 12056)
    }
}).on('error', err => console.log('Redis Client Error', err))
    .connect();

//Routes
router.use(ensureRedisConnection(client));
router.get('/response1999/:param1/:param2/:param3', sendPrompts);
router.get('/firstguard/:param1/:param2/', firstGuardRail);
router.get('/secondguard/:param1/:param2/', secondGuardRail);
router.post('/interaction/:user/:content/:timestamp/:type', interaction);

export default router;