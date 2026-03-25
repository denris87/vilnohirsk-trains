const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const station = "Вільногірськ";

// 🚆 Дані поїздів
const trains = [
  {
    number: "№6011",
    route: "Дніпро → П'ятихатки",
    days: "щоденно",
    schedule: [
      { station: "Дніпро", departure: "06:00" },
      { station: "Вільногірськ", departure: "06:45" },
      { station: "П'ятихатки", arrival: "07:30" }
    ]
  },
  {
    number: "№6015",
    route: "Дніпро → Кривий Ріг",
    days: "пн-пт",
    schedule: [
      { station: "Дніпро", departure: "08:00" },
      { station: "Вільногірськ", departure: "08:50" },
      { station: "Кривий Ріг", arrival: "10:10" }
    ]
  },
  {
    number: "№6020",
    route: "П'ятихатки → Дніпро",
    days: "щоденно",
    schedule: [
      { station: "П'ятихатки", departure: "11:00" },
      { station: "Вільногірськ", departure: "11:50" },
      { station: "Дніпро", arrival: "12:40" }
    ]
  },
  {
    number: "№6033",
    route: "Кривий Ріг → Дніпро",
    days: "сб-нд",
    schedule: [
      { station: "Кривий Ріг", departure: "15:00" },
      { station: "Вільногірськ", departure: "16:10" },
      { station: "Дніпро", arrival: "17:00" }
    ]
  }
];

// 🏠 Головна сторінка
app.get("/", (req, res) => {
  res.send("🚆 Сервер розкладу Вільногірськ працює");
});

// 📡 API — по станції Вільногірськ
app.get("/api/trains", (req, res) => {

  const result = trains.map(train => {
    const stop = train.schedule.find(s => s.station === station);

    return {
      number: train.number,
      route: train.route,
      time: stop?.departure || stop?.arrival || "—",
      days: train.days
    };
  });

  // сортування по часу
  result.sort((a, b) => a.time.localeCompare(b.time));

  res.json({
    station,
    trains: result
  });
});

// 📡 API — повний маршрут (для майбутнього)
app.get("/api/trains/full", (req, res) => {
  res.json(trains);
});


// 🚀 запуск
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер працює на порту " + PORT);
});
