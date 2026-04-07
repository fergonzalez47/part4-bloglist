const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes;


describe('most Likes', () => {
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

    test('Author with most likes', () => {
        const result = mostLikes(blogs)

        const expected = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }

        assert.deepStrictEqual(result, expected)
    })
})