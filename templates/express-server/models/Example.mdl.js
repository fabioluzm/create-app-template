// import dependecies
const mongoose = require('mongoose');

// create new instace of mongoose schema as project model
const ExampleSchema = new mongoose.Schema({
  exampleField: {
    type: String,     // field type
    required: true,   // required [true/false, message]
    unique: true,     // unique [true/false]
    trim: true,       // trim whitespaces
    minlength: 3,     // at least 3 chars long
    maxlength: 256,   // cannot exceed 256 chars long
    default: ''       // default field value
  },
  anotherField: {
    type: Number,
    required: [true, 'Please add anotherField']
  }
},{
  timestamps: true    // timestamps [true/false] for createdAt, updatedAt fields
});

// export 'Example' model module
module.exports = mongoose.model('Example', ExampleSchema);