const router = require('express').Router()
const { Blog, User } = require('../models')
// const Token = require('../models/token')
const { tokenExtractor, loggedInUserFinder } = require('../util/middleware')
const { Op } = require('sequelize')
require('express-async-errors')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
    // where.title = {
    //   [Op.iLike]: `%${req.query.search}%`
    // }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      // sequelize.fn('max', sequelize.col('likes')),
      ['likes', 'DESC'],
    ]
  })
  res.json(blogs)
})



router.post('/', tokenExtractor, loggedInUserFinder, async (req, res) => {
  // try {
    // console.log('req.decodedToken - ', req.decodedToken);
    if(!req.validUser){
      return res.status(401).json({ error: 'user disabled' })
    }


    const date = new Date();
    const currentYear = date.getFullYear()
    // console.log('yr -', yr);
    // console.log('type of yr - ', typeof yr)
    // console.log('typeof 2023 - ', typeof 2023);
    // console.log('req.body.year - ', req.body.year);

    if(!req.body.year || req.body.year < 1991 || req.body.year > currentYear) {
      return res.status(400).json({ error: 'invalid year' })
    }
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    res.json(blog)
  // } catch(error) {
  //   return res.status(400).json({ error })
  // }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, tokenExtractor, loggedInUserFinder, async (req, res) => {
  if(!req.validUser){
      return res.status(401).json({ error: 'user disabled' })
  }
  // console.log('req.decodedToken.id - ', req.decodedToken.id);
  // console.log('req.blog.userId - ', req.blog.userId);
  if (req.blog && req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy()
  } 
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router