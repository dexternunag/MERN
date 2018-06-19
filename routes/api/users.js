const express = require('express');
const router = express.Router();

/**
 * @router GET api/users/view
 * @desc   View all users
 * @access Public
 */
router.get('/view', (req, res) => {
    res.send('Test');
});

router.get('/add', (req, res) => {
    res.send('Test');
});

router.get('/edit', (req, res) => {
    res.send('Test');
});

router.get('/delete', (req, res) => {
    res.send('Test');
});

module.exports = router;