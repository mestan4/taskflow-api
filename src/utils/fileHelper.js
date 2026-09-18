const fs = require('fs');
const path = require('path');

// data/tasks.json dosyasının yolunu belirliyoruz
const filePath = path.join(__dirname, '../../data/tasks.json');

// dosyadan görevleri okuyan yardımcı fonksiyon
const readTasksFromFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
};

// değişiklikleri dosyaya kaydeden yardımcı fonksiyon
const writeTasksToFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = {
  readTasksFromFile,
  writeTasksToFile
};