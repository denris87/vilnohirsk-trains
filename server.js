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
    number: "№6020",
    route: "П'ятихатки → Дніпро",
    days: "щоденно",
    schedule: [
      { station: "П'ятихатки", departure: "08:00" },
      { station: "Вільногірськ", departure: "08:50" },
      { station: "Дніпро", arrival: "09:40" }
    ]
  }
];

// 📡 API для станції
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

  res.json({
    station,
    trains: result
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер працює на порту " + PORT);
});
