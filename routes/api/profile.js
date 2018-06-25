const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validator
const validateProfileInput = require('../../validation/profile');

/**
 * @router GET api/profile
 * @desc   Get current users profile
 * @access Private
 */
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name','avatar']);
        const errors = {};

        if (!profile) {
            errors.noProfile = `There is no profile for this user!`
            return res.status(404).json(errors);
        }

        res.json(profile);
    } catch (error) {
        res.status(404).json(error);
    }
});

/**
 * @router GET api/profile/all
 * @desc   Get all profile
 * @access Public
 */
router.get('/all', async (req, res) => {
    try {
        const errors = {};

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        if (!profiles) {
            errors.noProfile = 'There are no profiles.';
            res.status(404).json(errors);
        }

        res.json(profiles);
    } catch (error) {
        res.status(404).json(error);
    }
});

/**
 * @router GET api/profile/handle/:handle
 * @desc   Get profile by handle
 * @access Public
 */
router.get('/handle/:handle', async (req, res) => {
    try {
        const errors = {};

        const profile = await Profile.findOne({handle: req.params.handle}).populate('user', ['name', 'avatar']);

        if (!profile) {
            errors.noProfile = 'There is no profile for this user.';
            res.status(404).json(errors);
        }

        res.json(profile);
    } catch (error) {
        res.status(404).json(error);
    }
});

/**
 * @router GET api/profile/user/:user_id
 * @desc   Get profile by user ID
 * @access Public
 */
router.get('/user/:user_id', async (req, res) => {
    try {
        const errors = {};

        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if (!profile) {
            errors.noProfile = 'There is no profile for this user.';
            res.status(404).json(errors);
        }

        res.json(profile);
    } catch (error) {
        res.status(404).json(error);
    }
});

/**
 * @router GET api/profile
 * @desc   Create/Edit user profile
 * @access Private
 */
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const { errors, isValid } = validateProfileInput(req.body);

        // Check validation
        if (!isValid) return res.status(400).json(errors);

        // Get Fields 
        const profileFields = {};
        profileFields.user = req.user.id;

        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills - split it to array
        if (typeof req.body.skills !== undefined) {
            profileFields.skills = req.body.skills.split(',')
        }
        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;

        const profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            // Update
            const profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            );

            res.json(profile);
        } else {
            // Create
            // Check if profile handle exists
            const profile = await Profile.findOne({handle: profileFields.handle});

            if (profile) {
                errors.handle = `That handle already exists!`;
                res.status(400).json(errors);
            }

            // Save Profile
            const newProfile = await new Profile(profileFields).save();

            res.json(newProfile);
        }
        
    } catch (error) {
        res.status(404).json(error);
    }
});



module.exports = router;