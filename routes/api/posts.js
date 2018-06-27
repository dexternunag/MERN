const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

/**
 * @router GET api/posts
 * @desc   Get all posts
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({data: -1});

        if (posts === null) {
            res.status(404).json({noPosts: "No posts found!"});    
        }

        res.json(posts);
     
    } catch (error) {
        res.status(404).json(error);
    } 
 });

 /**
 * @router GET api/posts/:id
 * @desc   Get post by id
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post === null) {
            res.status(404).json({noPost: "No post found by that ID!"});    
        }
        res.json(posts);
     
    } catch (error) {
        res.status(404).json(error);
    } 
 });

/**
 * @router POST api/posts
 * @desc   Create post
 * @access Private
 */
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
   try {
       const { errors, isValid } = validatePostInput(req.body);

       if (!isValid) return res.status(400).json(errors);

       const { text, name, avatar } = req.body;
       const newPost = new Post({
        text,
        name,
        avatar,
        user: req.user.id
       });

       const post = await newPost.save();

       res.json(post);
    
   } catch (error) {
       res.status(404).json(error);
   } 
});

module.exports = router;