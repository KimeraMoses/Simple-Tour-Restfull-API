const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the server',
  });
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.status(201).send('Posted successfuly');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
