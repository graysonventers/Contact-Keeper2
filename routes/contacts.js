// Bring in express
const express = require('express');
// create router 
const router = express.Router();

// @route   GET api/contacts
// @description     Get all user's contact
// @access      Public
router.get('/', (req, res) => {
    res.send('Get all contacts');
});

// @route   POST api/contacts
// @description     Add new contacts
// @access      Private
router.post('/', (req, res) => {
    res.send('Add contact');
});

// @route   PUT api/contacts/:id
// @description     Update contact
// @access      Private
router.put('/:id', (req, res) => {
    res.send('Update contact');
});

// @route   DELETE api/contacts/:id
// @description     Delete contact
// @access      Private
router.delete('/:id', (req, res) => {
    res.send('Delete contact');
});

module.exports = router;