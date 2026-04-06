const express = require("express");
const cors = require("cors");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();

// Дозволяємо запити з будь-якого сайту
app.use(cors());

// Функція для завантаження даних з YAML файлу
function loadSchedule() {
  try {
    const fileContents = fs.readFileSync('./schedule.yaml', 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error("Помилка читання файлу schedule.yaml:", e);
    return null;
  }
}

// Головна сторінка
app.get("/", (req, res) => {
  res.send("🚆 Сервер працює і віддає розклад з YAML!");
});

// API, до якого звертається твій сайт
app.get("/api/trains", (req, res) => {
  const data = loadSchedule();

  if (!data) {
    return res.status(500).json({ error: "Помилка завантаження розкладу" });
  }

  const stationName = data.stationName;

  const result = data.trains.map(train => {
    // Шукаємо час відправлення конкретно з нашої станції
    const stop = train.schedule.find(s => s[0].includes(stationName));
    
    // Формуємо маршрут від першої до останньої станції
    let routeStr = "—";
    if (train.schedule.length > 0) {
      routeStr = `${train.schedule[0][0]} → ${train.schedule[train.schedule.length - 1][0]}`;
    }

    // Створюємо об'єкт для відправки на клієнт
    const trainData = {
      number: train.number,
      route: routeStr,
      time: stop ? stop[1] : "—",
      fullSchedule: train.schedule,
      note: train.note || "змін немає..."
    };

    // Якщо є альтернативний розклад - додаємо його
    if (train.altSchedule) {
      trainData.altSchedule = train.altSchedule;
    }

    return trainData;
  });

  res.json({
    station: stationName,
    trains: result
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на порту ${PORT}`);
});
