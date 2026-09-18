const express = require('express');
const logger = require('./middleware/logger');
const tasksRouter = require('./routes/tasks');

const app = express();

// body ayrıştırma ve loglama middlewareler
app.use(express.json());
app.use(logger);

// görev rotalarını /tasks ile bağlıyoruz
app.use('/tasks', tasksRouter);

// tanımsız rotalar için 404 atıyorum
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'İstenen API rotası bulunamadı.'
  });
});

module.exports = app;