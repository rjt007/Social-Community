require('dotenv').config();
const express = require('express');
const app = express();
const roleRoutes = require('./routes/roles');

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({request:'success'});
});

app.use('/v1/role',roleRoutes);

//Connecting to database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}..`));