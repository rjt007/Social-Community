require('dotenv').config();
const express = require('express');
const app = express();
const rolesRoute = require('./routes/roles');
const usersRoute = require('./routes/users');

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({request:'success'});
});

app.use('/v1/role',rolesRoute);
app.use('/v1/auth',usersRoute);

//Connecting to database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}..`));