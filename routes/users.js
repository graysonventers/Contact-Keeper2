// Bring in express
const express = require('express');
// create router 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// bring in User model
const User = require('../models/User');

// @route   POST api/users

// @description     Register a user

// @access Public
router.post('/', [
    check('name', 'Please add name').not().isEmpty(), 
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // deconstruct name, email and password out of the body
    const { name, email, password } = req.body;
    
    
    // setting the user to the database
    try {
        // findOne is a mongoose method checking to see if the database has that email already
        let user = await User.findOne({ email });

        // if user exists return the message User already exists
        if(user) {
            return res.status(400).json({ msg: 'User already exists' })
        }

        // if user doesn't exist, set user variable to our User model
        user = new User({ 
            name,
            email,
            password
         });

         // creating a "salt" with a difficulty level of 10. genSalt is a method that comes with bcrypt and return a promise so we must await.
         const salt = await bcrypt.genSalt(10);

         // we set the user's password to the hash provided by bcrypt. Takes in the password and the salt variable we created.
         user.password = await bcrypt.hash(password, salt);

         // this saves the user to the database.
         await user.save();

         // our payload is the object we want to send in the token. We only need the user.id because it will allow us to access everything else that comes with the user (aka contacts).
         const payload = {
            user: {
                id: user.id
            }
         }

         // to generate a token we must sign it. It takes in the payload, secret(kept in config folder), timeout(optional), and finally a callback function that takes in an error and the token and sends the token to the server(res.json({ token }))
         jwt.sign(payload, config.get('jwtSecret'), {
             expiresIn: 360000
         }, (err, token) => {
             if(err) throw err;
             res.json({ token });
         });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;