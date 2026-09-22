const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];
const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed'];

const validateTask = (req, res, next) => {
  const { title, description, priority, status } = req.body;

  // POST isteklerinde zorunlu başlık- açıklama kontrolü
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Görev başlığı (title) zorunludur ve metin olmalıdır.'
      });
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Görev açıklaması (description) zorunludur ve metin olmalıdır.'
      });
    }
  }

  // gönderilmişse priority geçerli değerlerden mi
  if (priority && !ALLOWED_PRIORITIES.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Geçersiz öncelik değeri. Sadece şunlar kabul edilir: ${ALLOWED_PRIORITIES.join(', ')}`
    });
  }

  // Status gönderilmişse geçerli değerlerden biri mi
  if (status && !ALLOWED_STATUSES.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Geçersiz durum değeri. Sadece şunlar kabul edilir: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  // Her şey geçerliyse isteği sıradaki fonksiyona yolla devrey aksın gitsin
  next();
};

module.exports = validateTask;