const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./userblogs')

// User.sync({ alter: true })
// Blog.sync({ alter: true })
Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'readinglists' })
// UserBlogs.belongsTo(Blog)
// Blog.belongsTo(UserBlogs)

module.exports = {
  Blog, User, UserBlogs
}