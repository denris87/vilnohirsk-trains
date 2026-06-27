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

// Формуємо маршрут поїзда (перша → остання станція)
function routeOf(train) {
  if (train && Array.isArray(train.schedule) && train.schedule.length > 0) {
    return `${train.schedule[0][0]} → ${train.schedule[train.schedule.length - 1][0]}`;
  }
  return "—";
}

// Шукаємо поїзд за номером (точний збіг або базовий номер без " new")
function findTrainByNumber(trains, number) {
  if (!number) return null;
  const stripNew = (n) => String(n).replace(/\s*new\s*$/i, "").trim();
  const target = String(number).trim();
  const base = stripNew(number);
  return (
    trains.find(t => String(t.number).trim() === target) ||
    trains.find(t => stripNew(t.number) === base) ||
    null
  );
}

// Перетворюємо сирий список затримок у зручний для сайту формат.
// Показуємо лише записи, де є затримка у хвилинах (delayMinutes > 0)
// або текстове пояснення (note/reason). Решта вважаються вимкненими.
function buildDelays(data) {
  const raw = Array.isArray(data.delays) ? data.delays : [];
  const trains = Array.isArray(data.trains) ? data.trains : [];
  const stationName = data.stationName || "";

  return raw
    .map(d => {
      const minutes = Number(d.delayMinutes) || 0;
      const note = d.note || d.reason || "";
      if (!d.number || (minutes <= 0 && !note)) return null;

      const train = findTrainByNumber(trains, d.number);
      const route = d.route || routeOf(train);
      const fromStation = d.fromStation || stationName;

      return {
        number: String(d.number).trim(),
        route,
        fromStation,
        delayMinutes: minutes,
        delayText: minutes > 0 ? `+${minutes} хв` : "",
        note
      };
    })
    .filter(Boolean);
}

// Головна сторінка
app.get("/", (req, res) => {
  res.send("🚆 Сервер працює і віддає розклад з YAML!");
});

// API для оповіщень про затримки електричок
app.get("/api/delays", (req, res) => {
  const data = loadSchedule();

  if (!data) {
    return res.status(500).json({ error: "Помилка завантаження розкладу" });
  }

  res.json({
    station: data.stationName,
    delays: buildDelays(data)
  });
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

    // Якщо є нове розклад (з 28 червня) - додаємо його
    if (train.newSchedule) {
      trainData.newSchedule = train.newSchedule;
      trainData.newScheduleNote = train.newScheduleNote || "з 28 червня 2026 приміський поїзд курсує за цим розкладом:";
    }

    return trainData;
  });

  res.json({
    station: stationName,
    trains: result,
    delays: buildDelays(data)
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на порту ${PORT}`);
});
