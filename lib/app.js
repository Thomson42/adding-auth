const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(express.static('public'));

const drakes = require('./routes/drakes');
app.use('/drakes', drakes);




app.use(errorHandler);

module.exports = app;