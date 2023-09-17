require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const rolesRoute = require('./routes/roles');
const usersRoute = require('./routes/users');
const communitiesRoute = require('./routes/communities');
const membersRoute = require('./routes/members');

//CORS Setting
const CorsOptions = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH'
    ],
  
    allowedHeaders: [
      'Content-Type', 'Authorization'
    ],
};
  
app.use(cors(CorsOptions));
app.use(express.json());

// Registering different routes
app.use('/v1/role',rolesRoute);
app.use('/v1/auth',usersRoute);
app.use('/v1/community',communitiesRoute);
app.use('/v1/member',membersRoute);

//Connecting to database
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}..`));