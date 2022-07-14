const express = require('express');
const Router = express.Router();




const getAllUsers = (req, res) => {
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  };
  
  const getUser = (req, res) => {
    const Id = req.params.id;
  
    const user = users.filter((user) => user._id === Id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  };
  const updateUser = (req, res) => {
    const Id = req.params.id * 1;
    if (Id > users.length || !users[Id])
      return res.status(404).json({ status: 'Fail', message: 'INVALID ID' });
  
    users[Id] = { ...users[Id], ...req.body };
    fs.writeFile(
      `${__dirname}/dev-data/data/users.json`,
      JSON.stringify(users),
      (err) => {
        if (err)
          res.status(500).json({
            status: 'fail',
            message: 'Failed to save tour',
          });
        res.status(201).json({
          status: 'success',
          updatedAt: req.requestTime,
          data: {
            user: users[Id],
          },
        });
      }
    );
  };
  const deleteUser = (req, res) => {
    const Id = req.params.id;
    const userIndex = users.findIndex((obj) => obj._id === Id);
    users.splice(userIndex, 1);
  
    fs.writeFile(
      `${__dirname}/dev-data/data/users.json`,
      JSON.stringify(users),
      (err) => {
        if (err)
          res.status(500).json({
            status: 'fail',
            message: 'Failed to save user',
          });
        res.status(204).json({
          status: 'success',
          data: null,
        });
      }
    );
  };
  const createUser = (req, res) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign({ id: newId }, req.body);
  
    users.push(newUser);
    fs.writeFile(
      `${__dirname}/dev-data/data/users.json`,
      JSON.stringify(users),
      (err) => {
        if (err)
          res.status(500).json({
            status: 'fail',
            message: 'Failed to save tour',
          });
        res.status(201).json({
          status: 'success',
          data: {
            users: newUser,
          },
        });
      }
    );
  };

  app.route('/').get(getAllUsers).post(createUser);
app
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

  module.exports