const router = require('express').Router()
const { User, Blog, ReadingList, Membership } = require('../models')

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title']
      }
    })
    
    res.json(users)

  } catch(error) {
    next(error)
  }

})

// create a user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

// get a user and allow options on what's returned based on reading list status
router.get('/:id', async (req, res, next) => {
  try {
    const { read } = req.query
    
    const where = {}
    if (read !== undefined) {
      where.read = read === 'true'
    }
        
    const user = await User.findByPk(req.params.id, {
      include: {
        model: ReadingList,
        as: 'readings',
        include: {
          model: Blog,
          through: {
            model: Membership,
            where,
            attributes: ['id', 'read'],
          },
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Format the response to match the exercise requirements
    const response = {
      name: user.name,
      username: user.username,
      readings: user.readings.map(readingList => ({
        id: readingList.id,
        name: readingList.name,
        blogs: readingList.blogs.map(blog => ({
          id: blog.id,
          url: blog.url,
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
          year: blog.year,
          readinglists: blog.membership ? [{
            read: blog.membership.read,
            id: blog.membership.id,
          }] : [],
        })),
      })),
    }

    res.json(response)
    } catch (error) {
      next(error)
    }
  })

// modify a user
router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({ 
    where: { 
      username: req.params.username 
    } 
  })

  try {
    if (user) {
      user.username = req.body.username || user.username
      await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router