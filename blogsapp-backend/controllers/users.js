const router = require('express').Router()

const { User, Blog, UserBlogs, IsRead } = require('../models')
require('express-async-errors')

router.get('/', async (req, res) => {
  // console.log('HIIIIII');
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  // try {
    const user = await User.create(req.body)
    res.json(user)
  // } catch(error) {
    // return res.status(400).json({ error })
  // }
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read){
     where.isRead  = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
    attributes: [ 'name', 'username' ] ,
    include:
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'date', 'createdAt', 'updatedAt']},
        through: {
          model: UserBlogs,
          as: 'readinglists',
          attributes: ['id', 'isRead'],
          where
        },
      },
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async(req, res) => {
  // console.log('username: ', req.params.username);
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router