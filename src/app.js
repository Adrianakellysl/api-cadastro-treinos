const express = require('express');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

app.use(express.json());
app.use('/treinos', workoutRoutes);

module.exports = app;
