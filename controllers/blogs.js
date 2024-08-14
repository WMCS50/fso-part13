const router = require('express').Router()
const { Blog } = require('../models')
const blogFinder = require('../middleware/blogFinder')

// get all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
    res.json(blogs)
})

// create a blog
router.post('/', async (req, res, next) => {
  try {
    const { author, url, title, likes } = req.body

    const newBlog = await Blog.create({
      author,
      url,
      title,
      likes: likes || 0
    })
    res.status(201).json(newBlog)
  } catch(error) {
    next(error)
  }
})

// find a blog
router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// delete a blog
router.delete('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch(error) {
    return res.status(400).json({ error: 'Unable to delete blog' })
  }
})

// modify a blog
router.put('/:id', blogFinder, async (req, res, next) => {
  try{
    if (req.blog) {
      const { author, url, title, likes } = req.body;
      req.blog.author = author ?? req.blog.author
      req.blog.url = url ?? req.blog.url
      req.blog.title = title ?? req.blog.title
      req.blog.likes = likes ?? req.blog.likes
  
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
  
})

module.exports = router