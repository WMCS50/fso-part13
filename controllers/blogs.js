const { Op } = require('sequelize')
const router = require('express').Router()
const { Blog, User } = require('../models')
const blogFinder = require('../middleware/blogFinder')
const tokenExtractor = require('../middleware/tokenExtractor')

// get all blogs with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const where = {}

    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` }},
        { author: { [Op.iLike]: `%${req.query.search}%` }}
      ]
      
    }

    const blogs = await Blog.findAll({
      where,
      include: {
        model: User,
        attributes: ['username']
      },
      order: [['likes', 'DESC']]
    })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.status(201).json(blog)
  } catch (error) {
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
router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      if (req.blog.userId !== req.decodedToken.id) {
        return res.status(403).json({ error: 'Blogs can only be deleted by their creators'})
      }

      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch(error) {
    next(error)
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