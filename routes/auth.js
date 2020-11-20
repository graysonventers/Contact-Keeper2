// Bring in express
const express = require('express');
// create router 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// bring in User model
const User = require('../models/User');

// @route   GET api/auth
// @description     Get logged in user
// @access      Private
router.get('/', auth, async (req, res) => {
    try {
        // get user from database, don't return password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @description     Authenticate user & get token
// @access      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    // if there is an error...
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // otherwise pull email and password from req.body
    const { email, password } = req.body;

    try {
        // check to see if email has already been registered
        let user = await User.findOne({ email });

        // if there isn't a user return message of Invalid credentials
        if(!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        // if there is a user continue to check password
        // bycrypt.compare checks to see if password(what the user entered) matches the password we have on file in the database(user.password). We save that to a variable.
        const isMatch = await bcrypt.compare(password, user.password);

        // if password doesn't match, send message to user.
        if(!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // if the password does match than we are going to send the token

        const payload = {
            user: {
                id: user.id
            }
        };

         jwt.sign(payload, config.get('jwtSecret'), {
             expiresIn: 360000
         }, (err, token) => {
             if(err) throw err;
             res.json({ token });
         }
         );
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    }
);


module.exports = router;