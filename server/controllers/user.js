const User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { jwtSign, jwtVerify } = require('../helper/jwt');
const { hashPassword, verifyPassword } = require('../helper/bcryptjs');

class UserController {
  static signIn(req, res, next) {
    const { email, password } = req.body;
    User.findOne({email})
    .then(one => {
      if (one && verifyPassword(password, one.password)) {
        const {username, full_name, email} = one;
        const token = jwtSign({username, full_name, email});
        res.status(200).json({token});
      } else {
        res.status(403).json({message: "gagal sign in"});
      }
    })
    .catch(err=> {
      res.status(403).json({message: "gagal sign in"});
      console.log(err);
    })
  }

  static googleSignIn(req, res, next) {
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      return Promise.all([payload, User.findOne({
        email: payload.email
      })])
    })
    .then(([payload, existUser]) => {
      if (existUser) {
        return existUser;
      } else {
        return User.create({
          username: payload.email.split('@')[0],
          full_name: payload.name,
          password: 'd341o0>\][ asdliqhb ocqyvcxicbjh xqhxioayvcquhe yxv OUcy qj$%453@#@%^6',
          email: payload.email,
          profile_pic: payload.picture
        })
      }
    })
    .then((data) => {
      const {username, full_name, email} = data;
      const token = jwtSign({username, full_name, email});
      // console.log('>>>>>>>> Server', token);
      res.status(200).json({token});
    })
    .catch((err) => {
      console.log(err);
      res.status(401)
    })
  }

  static uploadImage(req, res, next) {
    const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;
    const payload = jwtVerify(req.params.token);

    User.updateOne({ username: payload.username }, { profile_pic: image.url })
    .then(one => {
      res.status(200).json({url: image.url})
    })
    .catch(err => {
      res.status(403);
    })
  }

  static getProfile(req, res, next) {
    const payload = jwtVerify(req.params.token);
    User.findOne({username: payload.username})
    .then(one => {
      const { full_name, email, profile_pic } = one;
      res.status(200).json({ full_name, email, profile_pic });
    })
    .catch(err => {
      console.log(err);
      res.status(404);
    })
  }

  static register(req, res, next) {
    let {username, email, password} = req.body;
    password = hashPassword(password);
    
    User.findOne({email})
    .then(existUser => {
      if (existUser) {
        res.status(404).json({message: 'email sudah terdaftar'});
      } else {
        return User.create({
          username,
          full_name: email.split('@')[0],
          password,
          email,
          profile_pic: 'https://avatars0.githubusercontent.com/u/1633901?s=400&v=4'
        })
      }
    })
    .then(data => {
      const {username, full_name, email} = data;
      const token = jwtSign({username, full_name, email});
      res.status(200).json({token});
    })
    .catch((err) => {
      res.status(401).json(err);
    })
  }
}

module.exports = UserController;