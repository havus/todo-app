const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todo: {
    type: String,
    required: [true, 'Todo required :(']
  },
  desc: {
    type: String
  },
  status: {
    type: Boolean,
    required: true
  },
  due_date: {
    type: Date,
    required: [true, 'Due date required :(']
  },
  user_id: {
    type: 'ObjectId',
    ref: 'User',
  }
}, { timestamps: true, versionKey: false });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

// Popupalte reference
// https://stackoverflow.com/questions/19287142/populate-a-mongoose-model-with-a-field-that-isnt-an-id/39869551