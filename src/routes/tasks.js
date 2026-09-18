const express = require('express');
const router = express.Router();
const { readTasksFromFile } = require('../utils/fileHelper');

// tüm görevleri listeleliyoruz. GET /tasks
router.get('/', (req, res) => {
  try {
    const tasks = readTasksFromFile();
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görevler okunurken sunucu hatası oluştu.'
    });
  }
});

module.exports = router;