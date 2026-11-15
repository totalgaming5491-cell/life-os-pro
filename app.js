// LIFE OS PRO - Main Functions

const $ = id => document.getElementById(id);

let data = JSON.parse(localStorage.getItem("lifeOS")) || {
  study: [],
  health: [],
  morning: [],
  evening: [],
  food: [],
  reminders: []
};

function save() {
  localStorage.setItem("lifeOS", JSON.stringify(data));
}

function addTask(type, input, extra = {}) {
  const value = $(input).value.trim();
  if (!value) return;

  data[type].push({
    name: value,
    done: false,
    ...extra
  });

  $(input).value = "";
  save();
  render();
}

function removeTask(type, index) {
  data[type].splice(index, 1);
  save();
  render();
}

function toggleTask(type, index) {
  data[type][index].done = !data[type][index].done;
  save();
  render();
}

function renderList(type, element, filter = null) {
  const box = $(element);
  box.innerHTML = "";

  data[type].forEach((task, index) => {
    if (filter && !filter(task)) return;

    const row = document.createElement("div");
    row.className = "card";

    const label = document.createElement("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;

    check.addEventListener("change", () =>
      toggleTask(type, index)
    );

    const name = document.createElement("span");
    name.textContent = " " + task.name +
      (task.session ? " (" + task.session + ")" : "");

    name.style.textDecoration =
      task.done ? "line-through" : "none";

    label.append(check, name);

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => removeTask(type, index);

    row.append(label, del);
    box.append(row);
  });
}

function render() {
  renderList("study", "studyList");
  renderList("health", "healthList");
  renderList("morning", "morningList");
  renderList("evening", "eveningList");

  renderList("food", "foodList", task =>
    task.day === $("foodDay").value
  );

  const total = data.study.length + data.health.length;
  const completed =
    data.study.filter(t => t.done).length +
    data.health.filter(t => t.done).length;

  console.log("Daily tasks completed:", completed, "/", total);
}

// STUDY
$("addStudy").onclick = () => {
  addTask("study", "studyInput", {
    session: $("studySession").value
  });
};

// HEALTH
$("addHealth").onclick = () =>
  addTask("health", "healthInput");

// EXERCISE
$("addMorning").onclick = () =>
  addTask("morning", "morningExercise");

$("addEvening").onclick = () =>
  addTask("evening", "eveningExercise");

// FOOD
$("addFood").onclick = () => {
  addTask("food", "foodInput", {
    day: $("foodDay").value,
    meal: $("mealType").value
  });
};

$("foodDay").onchange = render;

// STOPWATCH
let seconds = 0;
let interval = null;

function updateTimer() {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  $("timerDisplay").textContent = `${h}:${m}:${s}`;
}

$("startTimer").onclick = () => {
  if (interval) return;

  interval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
};

$("pauseTimer").onclick = () => {
  clearInterval(interval);
  interval = null;
};

$("resetTimer").onclick = () => {
  clearInterval(interval);
  interval = null;
  seconds = 0;
  updateTimer();
};

// REMINDERS
$("addReminder").onclick = () => {
  const name = $("reminderText").value.trim();
  const time = $("reminderTime").value;

  if (!name || !time) {
    alert("Enter reminder name and time");
    return;
  }

  data.reminders.push({ name, time });
  $("reminderText").value = "";
  save();
  renderReminders();
};

function renderReminders() {
  const box = $("reminderList");
  box.innerHTML = "";

  data.reminders.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "card";
    row.textContent = r.time + " - " + r.name;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      data.reminders.splice(i, 1);
      save();
      renderReminders();
    };

    row.append(del);
    box.append(row);
  });
}

let notified = [];

setInterval(() => {
  const now = new Date();
  const currentTime =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  data.reminders.forEach((r, i) => {
    const key = now.toDateString() + i;

    if (r.time === currentTime && !notified.includes(key)) {
      alert("LIFE OS PRO Reminder: " + r.name);
      notified.push(key);
    }
  });
}, 10000);

render();
renderReminders();
updateTimer();

console.log("LIFE OS PRO is running!");
