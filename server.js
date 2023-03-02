const express = require('express');
const route = require('./routes');
const cors = require('cors');
const mongoose = require("mongoose");

require('dotenv').config({path: "./config.env"});

const app = express();
app.use(express.json());
app.use(cors());
app.use(route);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Listening on port",process.env.PORT);
    });
}).catch((err)=>{
    console.log(err);
})