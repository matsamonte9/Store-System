const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: [true, 'Please Provide Name'],
  },
  role: {
    type: String,
    enum: ['cashier', 'inventory', 'admin'],
    default: 'cashier'
  },
  email: {
    type: String,
    required: [true, 'Please Provide Email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Provide Valid Email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please Provide Password'],
    minlength: 6,
  },
});

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      name: this.name, 
      role: this.role 
    },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_LIFETIME }
  );
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema);