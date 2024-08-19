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

// get a user and allow options on what's returned base on reading list status
  router.get('/:id', async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: ReadingList,
          include: {
            model: Blog,
            through: { 
              attributes: [] 
            },
            attributes: ['id', 'url', 'title', 'author', 'likes', 'year']
          }
        },
      })
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
  
      //formatting response to exercise requirements
      const response = {
        name: user.name,
        username: user.username,
        readings: user.reading_lists.flatMap(readingList =>
          readingList.blogs.map(blog => ({
            id: blog.id,
            url: blog.url,
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
            year: blog.year,
          }))
        ),
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