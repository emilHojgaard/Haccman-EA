const { createClient } = require('redis');
require('dotenv').config()




const client = createClient({
    password: process.env.redis_passowrd,
    socket: {
        host: process.env.redis_host,
        port: (12056 || process.env.PORT2)
    }
}).on('error', err => console.log('Redis Client Error', err))
    .connect();

client.then((client) => {
    //pushing stuff to the user as a list of their interactions
    const userId = 'matheus';
    const interaction1 = JSON.stringify({ type: 'message', timestamp: '2024-06-02T12:00:00Z', content: 'IDK ABOUT THAT!' });
    //const interaction2 = JSON.stringify({ type: 'response', timestamp: '2024-06-02T12:05:00Z', content: 'Hey Im here to help!' });

    // Store interactions in a list
    client.lPush(userId, interaction1);

});





//client2.lPush(userId, interaction2);

/* const pushInteraction = async (req, res) => {
    const { user, content, timestamp, type } = req.params;

    try {
        const client2 = await client;

        //pushing stuff to the user as a list of their interactions
        const userId = user;
        const interaction1 = JSON.stringify({ type: type, timestamp: timestamp, content: content });

        // Store interactions in a list
        client2.lPush(userId, interaction1);


    } catch (error) {
        console.log("error in the secondGuardRail ", error)
    }

} */








/* client2.json.strAppend('noderedis:jsondata', '$', {
    name: 'Matheus the Second',
    pets: [
        {
            name: 'Darah',
            species: 'dog',
            age: 3,
            isMammal: true
        },
        {
            name: 'Lilo',
            species: 'fish',
            age: 2,
            isMammal: false
        }
    ]
})

client2.append("matheus", "yeah im ok!")
client2.json.arrInsert('noderedis:jsondata', )

client2.json.set('noderedis:jsondata', '$', {
    name: 'Matheus McDonald',
    pets: [
        {
            name: 'Darah',
            species: 'dog',
            age: 3,
            isMammal: true
        },
        {
            name: 'Lilo',
            species: 'fish',
            age: 2,
            isMammal: false
        }
    ]
}); */


/* .set; */



//await client2.set('matheus', 'Hey how is it going');
//const value = await client2.get('matheus');

//console.log(value)