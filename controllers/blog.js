const blogRouter = require('express').Router();
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response, next) => {
    let blog = request.body;

    const newBlog = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    })
    newBlog
        .save()
        .then(savedBlog => {
            response.status(201).json(savedBlog);
        })
    .catch(error => next(error))
})




module.exports = blogRouter;