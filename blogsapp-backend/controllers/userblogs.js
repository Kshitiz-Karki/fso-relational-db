const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { UserBlogs } = require('../models')
require('express-async-errors')

router.post('/', async (req, res) => {
  // try {
    console.log('req.body - ', req.body);
    const user_blog = await UserBlogs.create(req.body)
    res.json(user_blog)
  // } catch(error) {
    // return res.status(400).json({ error })
  // }
})

router.put('/:id', tokenExtractor, async(req, res) => {
  console.log('req.params.id: ', req.params.id);
  console.log('req.decodedToken.id: ', req.decodedToken.id);
  const userBlog = await UserBlogs.findOne({
    where: {
      blog_id: req.params.id,
      user_id: req.decodedToken.id
    }
  })
  if (userBlog) {
    userBlog.isRead = req.body.read
    await userBlog.save()
    res.json(userBlog)
  } else {
    res.status(404).end()
  }
})

module.exports = router