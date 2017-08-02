const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(express.static('public'));

const dragons = require('./routes/dragons');
app.use('/dragons', dragons);




app.use(errorHandler);

module.exports = app;