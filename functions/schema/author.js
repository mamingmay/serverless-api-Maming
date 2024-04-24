const mongoose = require('mongoose');
const { Schema } = mongoose; // Proper destructuring of Schema from mongoose

const authorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  username: String,
  password: String,
});

// Middleware for schema to manipulate username and password before saving
authorSchema.pre('save', function(next) {
  // Generating username by replacing spaces in name with nothing and converting to lowercase
  const username = this.name.toLowerCase().replace(/\s/g, '');
  // Creating a simple password from name and age
  const password = `${this.name}${this.age}`;

  this.username = username;
  this.password = password;
  next();
});

module.exports = authorSchema; // Exporting model
