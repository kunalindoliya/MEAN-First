const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashValue = await bcrypt.hash(password, 10);
    await User.create({email: email, password: hashValue});
    res.status(200).json({message: 'user created successfully!'});
  } catch (e) {
    res.stat(500).json({error: {message: 'Invalid Authentication Credentials!'}});
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res.status(401).json({message: 'incorrect email'});
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
      return res.status(401).json({message: 'Wrong password'});
    }
    const token = jwt.sign({email: user.email, userId: user._id}, 'mysecret', {expiresIn: '1h'});
    res.status(200).json({token:token, expiresIn: 3600, userId:user._id});
  } catch (e) {
    res.status(401).json({message: 'Invalid Authentication Credentials!'});
  }
};
