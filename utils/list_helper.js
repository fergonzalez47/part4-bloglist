const groupBy = require('lodash.groupby')
const maxBy = require('lodash.maxby')

const dummy = (array) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0);
}


const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((fav, blog) => {
        return blog.likes > fav.likes ? blog : fav
    })
}


const mostBlogs = (blogs) => {
    const groupedByAuthor = groupBy(blogs, "author");

    const counts = Object.keys(groupedByAuthor).map(author => ({
        author,
        blogs: groupedByAuthor[author].length
    }))
    console.log(counts);
    return maxBy(counts, 'blogs');
    
}

const mostLikes = (blogs) => {
    const groupedByAuthor = groupBy(blogs, "author");
    
    const counts = Object.keys(groupedByAuthor).map(author => ({
        author,
        likes: groupedByAuthor[author].reduce((sum, blog) => sum + blog.likes, 0)
    }))
    console.log(counts);
    return maxBy(counts, 'likes');
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}