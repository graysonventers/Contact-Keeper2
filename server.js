// create our express server
const express = require('express');

// bring in connectDB to connect database to server
const connectDB = require('./config/db');

// initialize express server into app variable
const app = express();

// Connect Database call
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// add endpoint/route
app.get('/', (req, res) => res.json({ msg: 'Welcome to the ContactKeeper API....ehhhhh' }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));


// create PORT variable for the express server (in app variable) to listen
const PORT = process.env.PORT || 5000;
// Add listen method onto express server to listen for the PORT variable. Call back function tells it what to do when it finds PORT.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));