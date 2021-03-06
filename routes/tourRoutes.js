const express = require('express');
const Router = express.Router()


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
  
Router.route('/').get(getAllTours).post(createTour);
Router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

  module.export
