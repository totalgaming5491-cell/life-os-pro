// LIFE OS PRO

let studyTasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
let healthTasks = JSON.parse(localStorage.getItem("healthTasks")) || [];

function saveData() {
    localStorage.setItem("studyTasks", JSON.stringify(studyTasks));
    localStorage.setItem("healthTasks", JSON.stringify(healthTasks));
}

function addTask(type, task) {
    if (!task.trim()) return;

    if (type === "study") {
        studyTasks.push({ name: task, done: false });
    } else {
        healthTasks.push({ name: task, done: false });
    }

    saveData();
}

function toggleTask(type, index) {
    let tasks = type === "study" ? studyTasks : healthTasks;

    tasks[index].done = !tasks[index].done;

    saveData();
}

function getProgress(tasks) {
    if (tasks.length === 0) return 0;

    let completed = tasks.filter(task => task.done).length;

    return Math.round((completed / tasks.length) * 100);
}

console.log("LIFE OS PRO is ready!");
