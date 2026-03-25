const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const station = "Вільногірськ";

// 🚆 Розклад
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
  },
  {
    number: "№6018",
    route: "П'ятихатки-Пас. → Дніпро-Гол.",
    schedule: [
      { station: "П'ятихатки-Пас.", departure: "08:29" },
      { station: "Вільногірськ", departure: "09:00" },
      { station: "Дніпро-Гол.", arrival: "10:57" }
    ]
  },
  {
    number: "№6015",
    route: "Дніпро-Гол. → П'ятихатки-Пас.",
    schedule: [
      { station: "Дніпро-Гол.", departure: "08:22" },
      { station: "Вільногірськ", departure: "10:56" },
      { station: "П'ятихатки-Пас.", arrival: "11:30" }
    ]
  },
  {
    number: "№6038",
    route: "П'ятихатки-Пас. → Дніпро-Гол.",
    schedule: [
      { station: "П'ятихатки-Пас.", departure: "16:50" },
      { station: "Вільногірськ", departure: "17:23" },
      { station: "Дніпро-Гол.", arrival: "19:17" }
    ]
  },
  {
    number: "№6035",
    route: "Дніпро-Гол. → П'ятихатки-Пас.",
    schedule: [
      { station: "Дніпро-Гол.", departure: "16:38" },
      { station: "Вільногірськ", departure: "18:50" },
      { station: "П'ятихатки-Пас.", arrival: "19:22" }
    ]
  },
  {
    number: "№6037 (1)",
    route: "Дніпро-Гол. → П'ятихатки-Пас.",
    schedule: [
      { station: "Дніпро-Гол.", departure: "17:34" },
      { station: "Вільногірськ", departure: "19:39" },
      { station: "П'ятихатки-Пас.", arrival: "20:14" }
    ]
  },
  {
    number: "№6044",
    route: "П'ятихатки-Пас. → Дніпро-Гол.",
    schedule: [
      { station: "П'ятихатки-Пас.", departure: "20:37" },
      { station: "Вільногірськ", departure: "21:21" },
      { station: "Дніпро-Гол.", arrival: "23:12" }
    ]
  },
  {
    number: "№6037 (2)",
    route: "Дніпро-Гол. → П'ятихатки-Пас.",
    schedule: [
      { station: "Дніпро-Гол.", departure: "20:38" },
      { station: "Вільногірськ", departure: "22:22" },
      { station: "П'ятихатки-Пас.", arrival: "23:10" }
    ]
  }
];

// 🏠
app.get("/", (req, res) => {
  res.send("🚆 Сервер розкладу працює");
});

// 📡 API
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

// 🚀 Railway
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Сервер працює на порту " + PORT);
});
