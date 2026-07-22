const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const setupSwagger = require('./config/swagger');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
