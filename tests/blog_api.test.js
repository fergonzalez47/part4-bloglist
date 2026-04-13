const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require("../models/blog")
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const User = require('../models/user')
let token;



beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        username: "root",
        name: "Superuser",
        password: "sekret"
    }

    await api.post('/api/users').send(newUser)

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: "root",
            password: "sekret"
        })

    token = loginResponse.body.token

    const user = await User.findOne({ username: "root" })
    
    const blogObjects = helper.initialBlogs.map(blog => new Blog(
        {
            ...blog,
            user: user._id
        }
    ))
    await Promise.all(blogObjects.map(blog => blog.save()))
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

//4.8
test('4.8 : all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


//4.9
test("4.9 : The identifier of every blog is named id", async () => {
    const response = await api.get("/api/blogs")
    const blog = response.body[0];
    assert(blog.id)
})


test('The third title blog is React patterns', async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map(blog => blog.title)
    assert.strictEqual(contents.includes("React patterns"), true)
})
// 4.10
test("4.10: a valid blog can be added ", async () => {
    const newBlog = {
        title: 'This is a new blog',
        author: 'Kika ka kacha',
        url: 'https://kika.com/',
        likes: 3
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb();
    
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const contents = blogsAtEnd.map(blog => blog.title)
    assert(contents.includes("This is a new blog"), true)
})

// 4.11
test("4.11*: a valid blog with likes 0 ", async () => {
    const newBlog = {
        title: 'This is a blog WITH NO LIKES',
        author: 'NO LIKES',
        url: 'https://sasakika.com/'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    const blogsAtEnd = await helper.blogsInDb();

    const createdBlog = blogsAtEnd.find(
        blog => blog.title === "This is a blog WITH NO LIKES"
    )
    assert.strictEqual(createdBlog.likes, 0)
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

// 4.12
test('4.12* : blog without title is not added', async () => {
    const newBlog = {
        author: 'test',
        url: 'https://test.com',
        likes: 3
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


// 4.12
test('4.12* : blog without url is not added', async () => {
    const newBlog = {
        title: "Yes title",
        author: 'test',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

// test('a specific blog can be viewed', async () => {
//     const blogsAtStart = await helper.blogsInDb()

//     const blogToView = blogsAtStart[0]


//     const resultBlog = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)

//     assert.deepStrictEqual(resultBlog.body, blogToView)
// })


// 4.13
test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]


    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})


//4.14
test("Updating an individual blog", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[2];
    
    let updated = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 2
    }
    const result = await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(updated)
        .expect(200)
    
    
    assert.strictEqual(result.body.likes, blogToUpdate.likes + 2);
})


test('fails with 401 if token not provided', async () => {
    const newBlog = {
        title: 'No token blog',
        author: 'No token',
        url: 'https://fail.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})


after(async () => {
    await mongoose.connection.close()
})