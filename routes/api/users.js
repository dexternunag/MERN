const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load user model
const User = require('../../models/User');

/**
 * @router GET api/users/view
 * @desc   View all users
 * @access Public
 */
router.get('/view', (req, res) => {
    res.send('Test');
});

/**
 * @router POST api/users/register
 * @desc   Register user
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        const { errors, isValid } = await validateRegisterInput(req.body);
        console.log(isValid)
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({email: 'Email already exists!'});
        } else {
            const { name, email, password } = req.body;

            const avatar = gravatar.url(email, {
                s: '200', // size
                r: 'pg', // rating
                d: 'mm' // default
            });

            const newUser = new User({
                name,
                email,
                avatar,
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    try {
                        const savedNewUser = await newUser.save();
                        if (savedNewUser) {
                            res.json(savedNewUser);
                        }   
                    } catch (error) {
                        console.log(error);
                    }
                });
            });

            
        }

    } catch (error) {
        console.log(error)
    }
});

/**
 * @router GET api/users/login
 * @desc   Login user / Return token
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        const { errors, isValid } = await validateLoginInput(req.body);
        
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({email: 'User not found!'});
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // User matched
            const { id, name, avatar } = user;
            const payload = { id, name, avatar }; // Create jwt payload

            // Sign token
            jwt.sign(
                payload, 
                keys.secretOrKey, 
                {expiresIn: 3600}, 
                (err, token) => {
                    res.json({
                        success: true, 
                        token: `Bearer ${token}`
                    });
                }
            );
        } else {
            res.status(400).json({password: 'Password incorrect!'});
        }
    } catch (error) {
        throw new Error(error);
    }
});

/**
 * @router GET api/users/current
 * @desc   Return current user
 * @access Private
 */
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user);
});

module.exports = router;