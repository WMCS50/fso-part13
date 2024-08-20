const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Membership = require('./membership')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(ReadingList, { through: Membership })
ReadingList.belongsToMany(Blog, { through: Membership })

User.belongsToMany(ReadingList, { through: Membership, as: "readings" })
ReadingList.belongsToMany(User, { through: Membership, as: "readinglists" })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  ReadingList,
  Membership,
  Session,
}