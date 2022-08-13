const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// ROUTES
const userRoutes = require('./routes/user-routes');
const queueRoutes = require('./routes/queue-routes');
const clientsRoutes = require('./routes/clients-routes');
const statementsRoutes = require('./routes/statements-routes');
const statisticsRoutes = require('./routes/statistics-routes');
app.use('/user', userRoutes);
app.use('/queue', queueRoutes);
app.use('/clients', clientsRoutes);
app.use('/statements', statementsRoutes);
app.use('/statistics', statisticsRoutes);

app.use((req, res, next) => {
  throw new HttpError('No route found', 500);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    message: error.message || 'An unknown message error occurred',
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vndt4.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(8000))
  .catch((error) => console.log(error));
