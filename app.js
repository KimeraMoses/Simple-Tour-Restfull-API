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

//****ROUTES ****/
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)






const port = 3000;
app.listen(port, () => {
  console.log(`Server runing on port ${port}...`);
});
