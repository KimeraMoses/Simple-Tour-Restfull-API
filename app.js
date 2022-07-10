const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const Id = req.params.id * 1;
  if (Id > tours.length)
    return res.status(404).json({ status: 'Fail', message: 'INVALID ID' });
  //   const tour = tours.filter((el) => el.id === req.params.id * 1);
  const tour = tours[Id];
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
        data: {
          tour: tours[Id],
        },
      });
    }
  );
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server runing on port ${port}...`);
});
