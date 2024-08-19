const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Membership = require('./membership')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(ReadingList)
ReadingList.belongsTo(User)

Blog.belongsToMany(ReadingList, { through: Membership })
ReadingList.belongsToMany(Blog, { through: Membership })

module.exports = {
  Blog, User, ReadingList, Membership
}