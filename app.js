const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

//****MIDDLEWARES ****/
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tourRouter = express.Router()
const userRouter = express.Router()

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

//****ROUTE HANDLER ****/
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const Id = req.params.id * 1;
  if (Id > tours.length)
    return res.status(404).json({ status: 'Fail', message: 'INVALID ID' });
  const tour = tours[Id];
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  const Id = req.params.id * 1;
  if (Id > tours.length || !tours[Id])
    return res.status(404).json({ status: 'Fail', message: 'INVALID ID' });

  tours[Id] = { ...tours[Id], ...req.body };
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
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
          tour: tours[Id],
        },
      });
    }
  );
};
const deleteTour = (req, res) => {
  const Id = req.params.id * 1;
  if (Id > tours.length || !tours[Id])
    return res.status(404).json({ status: 'Fail', message: 'INVALID ID' });

  tours.splice(Id, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err)
        res.status(500).json({
          status: 'fail',
          message: 'Failed to save tour',
        });
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err)
        res.status(500).json({
          status: 'fail',
          message: 'Failed to save tour',
        });
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

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

//****ROUTES ****/
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);


app.route('/').get(getAllUsers).post(createUser);
app
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`Server runing on port ${port}...`);
});
