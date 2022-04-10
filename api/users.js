const express = require('express');
const { user } = require('pg/lib/defaults');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db/index')

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

const { getAllUsers } = require('../db');

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users: []
  });
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      console.log(token);
      console.log("=============");

      const userData = jwt.verify(token, process.env.JWT_SECRET);
      console.log(userData);

      res.send({ message: "you're logged in!"});
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect"
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});


module.exports = usersRouter;