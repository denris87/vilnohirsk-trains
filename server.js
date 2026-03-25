<div id="train-widget">
  <div class="header">🚆 Вільногірськ — Відправлення</div>
  <div id="train-list">Завантаження...</div>
</div>

<style>
#train-widget {
  max-width: 340px;
  font-family: Arial;
  border-radius: 12px;
  padding: 10px;
  background: #111;
  color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #00ff9c;
}

.train {
  display: grid;
  grid-template-columns: 70px 1fr 70px;
  font-size: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #333;
}

.time { 
  text-align: right; 
  font-weight: bold;
}

.route { 
  text-align: center; 
}

.number { 
  color: #aaa; 
}

.soon {
  color: #ffcc00;
}

.passed {
  color: #ff4d4d;
}
</style>

<script>
const API_URL = "https://vilnohirsk-trains-production.up.railway.app/api/trains";

// 🕒 правильный расчёт времени
function getMinutesDiff(time) {
  try {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);

    const trainTime = new Date();
    trainTime.setHours(h, m, 0, 0);

    // если поезд уже прошёл — не ломаем расчёт
    const diff = Math.floor((trainTime - now) / 60000);
    return diff;
  } catch {
    return null;
  }
}

async function loadTrains() {
  const list = document.getElementById("train-list");

  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      list.innerHTML = "Помилка API";
      return;
    }

    const data = await res.json();

    list.innerHTML = "";

    data.trains.forEach(t => {
      const minutes = getMinutesDiff(t.time);

      let label = t.time;
      let cls = "time";

      if (minutes !== null) {
        if (minutes < -5) {
          cls += " passed";
          label = "поїхав";
        } else if (minutes >= 0 && minutes <= 10) {
          cls += " soon";
          label = "≈ " + minutes + " хв";
        }
      }

      const el = document.createElement("div");
      el.className = "train";

      el.innerHTML = `
        <div class="number">${t.number}</div>
        <div class="route">${t.route}</div>
        <div class="${cls}">${label}</div>
      `;

      list.appendChild(el);
    });

  } catch (e) {
    list.innerHTML = "Помилка завантаження";
    console.error(e);
  }
}

// 🚀 запуск
loadTrains();
setInterval(loadTrains, 30000);
</script>
