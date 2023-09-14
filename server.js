require('dotenv').config();
const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.json({request:'success'});
});

//Connecting to database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}..`));