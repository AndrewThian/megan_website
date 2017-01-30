require('mongoose-type-url')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

var emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/

var UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'please input name'],
    minlength: [3, 'please input more than 3 characters']
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },

  about: {
    description: String,
    job: String,
    url: {
      behance: mongoose.SchemaTypes.Url,
      facebook: mongoose.SchemaTypes.Url,
      cargo_collective: mongoose.SchemaTypes.Url,
      tumblr: mongoose.SchemaTypes.Url
    }
  },

  projects: {
    type: Schema.Types.ObjectId, ref: 'Project'
  }

})

UserSchema.pre('save', function (callback) {
  var user = this
  console.log('user is new? '.blue + user.isNew)

  // only has password if new or has be modified
  if (!user.isModified('password')) return callback()

  // hash given password
  var hash = bcrypt.hashSync(user.password, 10)

  // override cleartext password with hashed
  user.password = hash
  callback()
})

UserSchema.methods.validPassword = function (password) {
  // compare is a bcrypt method that will return a boolean value
  return bcrypt.compareSync(password, this.password)
}

UserSchema.options.toJSON = {
  transform: function (doc, ret, opt) {
    // doc === user created document
    // ret === data returning to the request

    // delete password from document
    delete ret.password
    return ret
  }
}

module.exports = mongoose.model('User', UserSchema)
