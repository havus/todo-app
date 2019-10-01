const Todo = require('../models/todo');
const User = require('../models/user');
const { jwtSign, jwtVerify } = require('../helper/jwt');

class TodoController {
  static showDashboard(req, res, next) {
    const payload = jwtVerify(req.params.token);
    if (!payload.username) {
      res.status(403).json({ status: false })
    }
    User.findOne({
      username: payload.username
    })
    .then(one => {
      return Todo.find({
        user_id: one._id
      })
    })
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(404).json({message: 'not found'})
    })
  }

  static createTodo(req, res, next) {
    const { todo, desc, due_date, token } = req.body;
    const payload = jwtVerify(token);
    User.findOne({ username: payload.username })
    .then(one => {
      return Todo.create({ todo, desc, due_date: Date(due_date), user_id: one._id, status: false })
    })
    .then(data => {
      console.log('berhasil create');
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
  }

  static findOne(req, res, next) {
    Todo.findOne({ _id:  req.params.id})
    .then(one => {
      res.status(200).json(one);
    })
    .catch(err => {
      res.status(400).json(err);
    })
  }

  static doneTodo(req, res, next) {
    const payload = jwtVerify(req.params.token);
    User.findOne({ username: payload.username })
    .then(user => {
      return Promise.all([user, Todo.findOne({ _id: req.params.todo_id })])
    })
    .then(result => {
      let user = String(result[0]._id);
      let todo = String(result[1].user_id);
      if (user === todo) {
        return Todo.updateOne({ _id: result[1]._id }, {status: true})
      } else {
        return false;
      }
    })
    .then(data => {
      if (data) {
        console.log('oke');
        res.status(200).json({message: 'done'});
      } else {
        res.status(403);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  static delete(req, res, next) {
    const { todo_id, token} = req.params;
    const payload = jwtVerify(token);
    Todo.findOne({
      _id: todo_id
    })
    .then(one => {
      if (one) {
        return Todo.deleteOne({
          _id: one._id
        })
      } else {
        return null;
      }
    })
    .then(info => {
      if (info) {
        // console.log(info);
        res.status(200).json({status: true})
      } else {
        res.status(404);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(err);
    })
  }

  static updateTodo(req, res, next) {
    const {todoEdit, descEdit, dateEdit} = req.body;
    const payload = jwtVerify(req.params.token);
    User.findOne({ username: payload.username })
    .then(user => {
      return Promise.all([user, Todo.findOne({ _id: req.params.todo_id })])
    })
    .then(result => {
      let user = String(result[0]._id);
      let todo = String(result[1].user_id);
      if (user === todo) {
        return Todo.updateOne({ _id: result[1]._id }, { 
          todo: todoEdit, 
          desc: descEdit, 
          due_date: Date(dateEdit) 
        })
      } else {
        return false;
      }
    })
    .then(data => {
      if (data) {
        console.log('oke');
        res.status(200).json({message: 'updated'});
      } else {
        res.status(403);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}

module.exports = TodoController;