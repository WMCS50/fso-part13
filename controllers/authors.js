const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

// get number of blogs for each author and total number of likes
router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll ({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
      group: ['author'],
      order: [['likes', 'DESC']]
    })

    res.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router