const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs;


describe('most blogs', () => {
    const blogs = [
        {
            title: "React patterns",
            author: "Michael Chan",
            likes: 7
        },
        {
            title: "Go To Statement",
            author: "Edsger W. Dijkstra",
            likes: 5
        },
        {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        },
        {
            title: "First class tests",
            author: "Robert C. Martin",
            likes: 10
        },
        {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            likes: 0
        },
        {
            title: "Clean code",
            author: "Robert C. Martin",
            likes: 3
        }
    ]

    test('author with most blogs', () => {
        const result = mostBlogs(blogs)

        const expected = {
            author: "Robert C. Martin",
            blogs: 3
        }

        assert.deepStrictEqual(result, expected)
    })
})