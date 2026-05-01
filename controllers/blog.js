const blogRouter = require('express').Router();
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1 });
        response.json(blogs);
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {

    let body = request.body;
    const user = request.user;

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    try {

        const savedBlog = await newBlog.save();
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        const populatedBlog = await savedBlog.populate("user", {
            username: 1,
            name: 1
        })

        response.status(201).json(populatedBlog).populate({

        })

    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {

    try {
        const user = request.user;
        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }
        
        const blog = await Blog.findById(request.params.id);

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }
        const userId = blog.user.toString();

        if (userId === user.id) {
            await Blog.findByIdAndDelete(request.params.id)
            response.status(204).end()
        } else {
            return response.status(403).json({ error: 'forbidden' })
        }
    } catch (exception) {
        next(exception)
    }
})

blogRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

blogRouter.put("/:id", async (request, response, next) => {
    try {
        const id = request.params.id;
        const body = request.body;

        const updatedBlog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: body.user

        }
        const blog = await Blog.findByIdAndUpdate(id, updatedBlog, { returnDocument: 'after', runValidators: true, context: 'query' })
            .populate("user", {
                username: 1,
                name: 1
            });
        
        
        if (!blog) {
            response.status(404).end();
        }
        response.status(200).json(blog);
    } catch (error) {
        next(error);
    }
})



module.exports = blogRouter;