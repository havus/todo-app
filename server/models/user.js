const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: [true, 'fullname required!'],
  },
  username: {
    type: String,
    required: [true, 'username required!'],
  },
  password: {
    type: String,
    required: [true, 'passsword required!'],
  },
  email: {
    type: String,
    required: [true, 'email required!'],
    validate: [(v) => {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    }, 'email not valid']
  },
  profile_pic: {
    type: String,
  }
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);

userSchema.path('email').validate((v) => {
  return new Promise((resolve, reject) => {
    User.find()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === v) {
          reject(new Error('Email harus unique'));
        }
      }
      resolve();
    })
    .catch(err => {
      reject(new Error(err));
    })
  })
})

module.exports = User;