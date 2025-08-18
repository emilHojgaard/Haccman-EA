const { createClient } = require('redis');
require('dotenv').config()
const express = require('express');
const { sendPrompts, firstGuardRail, secondGuardRail } = require('./apiController');
const router = express.Router();

//ill start the client here like they instruct
const client = createClient({
    password: process.env.redis_passowrd,
    socket: {
        host: process.env.redis_host,
        port: (12056 || process.env.PORT2)
    }
}).on('error', err => console.log('Redis Client Error', err))
    .connect();


//const client2 = await client;

const ensureRedisConnection = async (req, res, next) => {
    client.then((client) => {

        if (!client.isOpen) {
            try {
                client.connect();
            } catch (err) {
                console.error('Could not connect to Redis:', err);
                return res.status(500).send('Internal Server Error');
            }
        }
        next();
    })
};






//this is what happens when you go to the port followed by those written things
router.use(ensureRedisConnection);
router.get('/response1999/:param1/:param2/:param3', sendPrompts);
router.get('/firstguard/:param1/:param2/', firstGuardRail);
router.get('/secondguard/:param1/:param2/', secondGuardRail);
router.post('/interaction/:user/:content/:timestamp/:type', async (req, res) => {
    const { user, content, timestamp, type } = req.params;

    try {
        client.then((client) => {
            //pushing stuff to the user as a list of their interactions
            const userId = user;
            const interaction1 = JSON.stringify({ type: type, timestamp: timestamp, content: content });

            // Store interactions in a list
            client.lPush(userId, interaction1);


        })


        res.status(200).send('Interaction added successfully');

    } catch (error) {
        console.log("error in the post ", error)
    }

});

module.exports = router