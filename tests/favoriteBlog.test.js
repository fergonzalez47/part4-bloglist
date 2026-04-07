const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favorite blog', () => {
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
        }
    ]

    test('blog with most likes', () => {
        const result = favoriteBlog(blogs)

        const expected = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }

        assert.deepStrictEqual(result, expected)
    })
})