const validateTask = require('../middleware/validateTask');
const express = require('express');
const router = express.Router();
const { readTasksFromFile, writeTasksToFile } = require('../utils/fileHelper');

// tüm görevleri listele veya filtrelere göre getir get task
router.get('/', (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let tasks = readTasksFromFile();

    // duruma göre filtreleme ?status=completed 
    if (status) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    // önceliğe göre filtreleme ?priority=high
    if (priority) {
      tasks = tasks.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // başlık veya açıklamada metin arama ?search=API
    if (search) {
      const searchTerm = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm) ||
          t.description.toLowerCase().includes(searchTerm)
      );
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görevler listelenirken sunucu hatası oluştu.'
    });
  }
});

// bbelirli bir görevin detayını getir GET /tasks/:id
router.get('/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz görev ID formatı. ID sayısal olmalıdır.'
      });
    }

    const tasks = readTasksFromFile();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `${taskId} numaralı görev bulunamadı.`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev getirilirken sunucu hatası oluştu.'
    });
  }
});

// yeni görev oluşturma POST /tasks - 
router.post('/', validateTask, (req, res) => {
  try {
    const { title, description, priority, status, assignee } = req.body;

    // isim zorunluluğu kontrollemece
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Görev başlığı (title) ve açıklaması (description) zorunludur.'
      });
    }

    const tasks = readTasksFromFile();

    const newTask = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      assignee: assignee || 'Atanmamış',
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasksToFile(tasks);

    res.status(201).json({
      success: true,
      message: 'Görev başarıyla oluşturuldu.',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev eklenirken sunucu hatası oluştu.'
    });
  }
});

//görev bilgilerini güncelle PUT /tasks/:id
router.put('/:id', validateTask, (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz görev ID formatı.'
      });
    }

    const { title, description, priority, status, assignee } = req.body;

    if (!title && !description && !priority && !status && !assignee) {
      return res.status(400).json({
        success: false,
        message: 'Güncellenecek en az bir alan göndermelisiniz.'
      });
    }

    const tasks = readTasksFromFile();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `${taskId} numaralı görev bulunamadı.`
      });
    }

    // güncelleme yeni gelenlerle
    if (title) tasks[taskIndex].title = title;
    if (description) tasks[taskIndex].description = description;
    if (priority) tasks[taskIndex].priority = priority;
    if (status) tasks[taskIndex].status = status;
    if (assignee) tasks[taskIndex].assignee = assignee;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasksToFile(tasks);

    res.status(200).json({
      success: true,
      message: 'Görev başarıyla güncellendi.',
      data: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev güncellenirken sunucu hatası oluştu.'
    });
  }
});

//görevi sistemden kaldır DELETE /tasks/:id - G
router.delete('/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz görev ID formatı.'
      });
    }

    const tasks = readTasksFromFile();
    const taskExists = tasks.some((t) => t.id === taskId);

    if (!taskExists) {
      return res.status(404).json({
        success: false,
        message: `${taskId} numaralı görev bulunamadı.`
      });
    }

    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    writeTasksToFile(updatedTasks);

    res.status(200).json({
      success: true,
      message: `${taskId} numaralı görev başarıyla silindi.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev silinirken sunucu hatası oluştu.'
    });
  }
});

module.exports = router;