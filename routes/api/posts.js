const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../models/Profile');
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
        res.json(post);
     
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

/**
 * @router DELETE api/posts/:id
 * @desc   Delete post by id
 * @access Private
 */
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            const post = await Post.findById(req.params.id);

            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({notauthorized: 'User not authorized!'});
            }
            
            // delete
            await post.remove();
            res.json({success: true});
        }
        
    } catch (error) {
        res.status(404).json({postnotfound: 'No post found'});
    } 
});

/**
 * @router POST api/posts/like/:id
 * @desc   Like post
 * @access Private
 */
router.post('/like/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            const post = await Post.findById(req.params.id);
            
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({alreadyliked: 'User already liked this post'});
            }

            // add user to likes array
            post.likes.unshift({user: req.user.id});
            const savedPost = await post.save();
            res.json(savedPost);
        }
        
    } catch (error) {
        res.status(404).json({postnotfound: 'No post found'});
    } 
});

/**
 * @router POST api/posts/unlike/:id
 * @desc   Unlike post
 * @access Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            const post = await Post.findById(req.params.id);
            
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({notliked: 'You have not yet liked this post'});
            }

            // remove user to likes array
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);

            const savedPost = await post.save();
            res.json(savedPost);
        }
        
    } catch (error) {
        res.status(404).json({postnotfound: 'No post found'});
    } 
});

/**
 * @router POST api/posts/comment/:id
 * @desc   Add comment to post
 * @access Private
 */
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const { text, name, avatar } = req.body;

        const post = await Post.findById(req.params.id);

        if (post) {
            const newComment = {
                text,
                name,
                avatar,
                user: req.user.id
            };

            // add to comments array
            post.comments.unshift(newComment);

            const savedPost = await post.save();
            res.json(savedPost);
        }
        
    } catch (error) {
        res.status(404).json({postnotfound: 'No post found'});
    } 
});

/**
 * @router DELETE api/posts/comment/:id/:comment_id
 * @desc   Remove comment from post
 * @access Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({commentnotexists: 'Comment does not exists'});
            }

            const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);
            post.comments.splice(removeIndex, 1);

            const savedPost = await post.save();
            res.json(savedPost);
        }
        
    } catch (error) {
        res.status(404).json({postnotfound: 'No post found'});
    } 
});

module.exports = router;