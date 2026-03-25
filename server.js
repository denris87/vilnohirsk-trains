const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const station = "Вільногірськ";

const trains = [
  // П'ятихатки → Дніпро
  {
    number: "6008",
    from: "П'ятихатки-Пас.",
    to: "Дніпро-Гол.",
    schedule: [{ station: "Вільногірськ", departure: "05:16" }]
  },
  {
    number: "6010",
    from: "П'ятихатки-Пас.",
    to: "Дніпро-Гол.",
    schedule: [{ station: "Вільногірськ", departure: "06:01" }]
  },
  {
    number: "6018",
    from: "П'ятихатки-Пас.",
    to: "Дніпро-Гол.",
    schedule: [{ station: "Вільногірськ", departure: "09:00" }]
  },
  {
    number: "6038",
    from: "П'ятихатки-Пас.",
    to: "Дніпро-Гол.",
    schedule: [{ station: "Вільногірськ", departure: "17:23" }]
  },
  {
    number: "6044",
    from: "П'ятихатки-Пас.",
    to: "Дніпро-Гол.",
    schedule: [{ station: "Вільногірськ", departure: "21:21" }]
  },

  // Дніпро → П'ятихатки
  {
    number: "6005",
    from: "Дніпро-Гол.",
    to: "П'ятихатки-Пас.",
    schedule: [{ station: "Вільногірськ", departure: "06:54" }]
  },
  {
    number: "6015",
    from: "Дніпро-Гол.",
    to: "П'ятихатки-Пас.",
    schedule: [{ station: "Вільногірськ", departure: "10:56" }]
  },
  {
    number: "6035",
    from: "Дніпро-Гол.",
    to: "П'ятихатки-Пас.",
    schedule: [{ station: "Вільногірськ", departure: "18:50" }]
  },
  {
    number: "6037",
    from: "Дніпро-Гол.",
    to: "П'ятихатки-Пас.",
    schedule: [{ station: "Вільногірськ", departure: "19:39" }]
  },
  {
    number: "6043",
    from: "Дніпро-Гол.",
    to: "П'ятихатки-Пас.",
    schedule: [{ station: "Вільногірськ", departure: "22:22" }]
  }
];

// API
app.get("/api/trains", (req, res) => {
  const result = trains.map(train => {
    const stop = train.schedule.find(s => s.station === station);

    return {
      number: train.number,
      route: `${train.from} → ${train.to}`,
      direction: train.to,
      time: stop?.departure || "—"
    };
  });

  result.sort((a, b) => a.time.localeCompare(b.time));

  res.json({
    station,
    trains: result
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Сервер працює на порту " + PORT);
});
