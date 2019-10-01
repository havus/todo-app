if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECT_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


// ROUTE 
const user = require('./routes/user');
app.use('/user', user);
const todo = require('./routes/todo');
app.use('/todo', todo);

app.listen( process.env.PORT || 3000, () => {
  console.log(`Server >>>>>> 3000!`)
});