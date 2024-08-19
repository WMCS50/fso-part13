/* const Blog = require('./blog')
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
} */

const Blog = require("./blog")
const User = require("./user")
const ReadingList = require("./readinglist")
const Membership = require("./membership")

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(ReadingList, { through: Membership })
ReadingList.belongsToMany(Blog, { through: Membership })

User.belongsToMany(ReadingList, { through: Membership, as: "readings" })
ReadingList.belongsToMany(User, { through: Membership, as: "readinglists" })


module.exports = {
  Blog,
  User,
  ReadingList,
  Membership,
}