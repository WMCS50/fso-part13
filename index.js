const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const errorHandler = require('./middleware/errorHandler')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()


/* prior to restructuring application

require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.use(express.json())

// get all blogs
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
    res.json(blogs)
})

// create a blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { author, url, title, likes } = req.body

    if (!url || !title) {
      return res.status(400).json({ error: 'URL and title required' })
    }

    const newBlog = await Blog.create({
      author,
      url,
      title,
      likes: likes || 0
    })
    res.status(201).json(newBlog)
  } catch(error) {
    return res.status(500).json({ error: 'Unable to create new blog' })
  }
})

// find a blog
app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

// delete a blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch(error) {
    return res.status(400).json({ error: 'Unable to delete blog' })
  }
})

// modify a blog
app.put('/api/blogs/:id', async (req, res) => {
  try{
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      const { author, url, title, likes } = req.body;
      blog.author = author ?? blog.author
      blog.url = url ?? blog.url
      blog.title = title ?? blog.title
      blog.likes = likes ?? blog.likes
  
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to update blog' })
  }
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) */