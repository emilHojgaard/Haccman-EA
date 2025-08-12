const express = require('express');
const apiRoutes = require('./apiRoutes');
const cors = require('cors')
//const someMiddleware = require('./middleware/someMiddleware');
require('dotenv').config()
const app = express();

const port = 3000

app.use(cors())
app.use(express.json());
app.use('/api8989', apiRoutes)


/* app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); */

app.listen(process.env.PORT || 3000)