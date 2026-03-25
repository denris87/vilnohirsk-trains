const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const station = "Вільногірськ";

const trains = [
  {
    number: "№6008",
    route: "П'ятихатки-Пас. → Дніпро-Гол.",
    schedule: [
      { station: "П'ятихатки-Пас.", departure: "04:43" },
      { station: "Вільногірськ", departure: "05:16" },
      { station: "Дніпро-Гол.", arrival: "07:22" }
    ]
  },
  {
    number: "№6010",
    route: "П'ятихатки-Пас. → Дніпро-Гол.",
    schedule: [
      { station: "П'ятихатки-Пас.", departure: "05:30" },
      { station: "Вільногірськ", departure: "06:01" },
      { station: "Дніпро-Гол.", arrival: "08:09" }
    ]
  },
  {
    number: "№6005",
    route: "Дніпро-Гол. → П'ятихатки-Пас.",
    schedule: [
      { station: "Дніпро-Гол.", departure: "04:52" },
      { station: "Вільногірськ", departure: "06:54" },
      { station: "П'ятихатки-Пас.", arrival: "07:28" }
    ]
  }
];

// главная
app.get("/", (req, res) => {
  res.send("🚆 Сервер працює");
});

// API
app.get("/api/trains", (req, res) => {
  const result = trains.map(train => {
    const stop = train.schedule.find(s => s.station === station);

    return {
      number: train.number,
      route: train.route,
      time: stop?.departure || stop?.arrival || "—"
    };
  });

  result.sort((a, b) => a.time.localeCompare(b.time));

  res.json({
    station,
    trains: result
  });
});

// запуск
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Сервер працює на порту " + PORT);
});
