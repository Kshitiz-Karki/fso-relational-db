const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')
require('express-async-errors')

router.get('/', async (req, res) => {
  // console.log('HIIIIII');
  const blogs = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    order: [
      ['likes', 'DESC'],
    ]
  })
  res.json(blogs)
})

module.exports = router