const express = require('express');
const db = require('./models');
const route = require('./routes');
const cors = require('cors');

require('dotenv').config({path: "./config.env"});

const app = express();
app.use(express.json());
app.use(cors());
app.use(route);

db.sequelize.sync().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Listening on port",process.env.PORT);
    });
}).catch((err)=>{
    console.log(err);
})