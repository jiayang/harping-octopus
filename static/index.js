const statusState = document.createElement("span");
const statusMsg = document.createElement("span");
const soonMsg = document.createElement("span");
const timeRemaining = document.createElement("span");
statusState.id = "statusState";
statusMsg.id= "statusMsg";
soonMsg.id = "soonMsg";
timeRemaining.id = "timeRemaining";
statusState.innerHTML = "Up Next: <br>"

const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");
var tasks = document.getElementById("taskList");
var addTask = document.getElementById("addTask");

menuButton.onclick = function() {
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
    } else {
        menu.classList.add("hidden");
    }
}

const createTask = function(label, offsetValue, warningValue, repeatValue) {
    var html = `<li>
        <input value="${label}"></input>
        <input value="${offsetValue}"></input>
        <input value="${warningValue}"></input>
        <input value="${repeatValue}"></input>
        <input type='checkbox' checked="true"></input>
        </li>`;
    var template = document.createElement("template");
    template.innerHTML = html;
    var li = tasks.appendChild(template.content.firstChild);
    return li;
}

addTask.onclick = () => {
    createTask("", 0, 0, 0).children[4].checked = false;
}

if (localStorage.getItem("tasks") === null) {
    createTask("Loot", 110, 10, 55);
    createTask("Normal Lucid", 55, 10, 110);
    createTask("30m buffs", 1800, 10, 1800);
} else {
    all = JSON.parse(localStorage.getItem("tasks"));
    all.forEach((task) => {
        createTask(task.label, task.offset, task.warning, task.repeat).children[4].checked = task.activated;
    });

}

menu.onchange = function() {
    var all = [];
    tasks.childNodes.forEach((task) => {
        all.push({
            label: task.children[0].value,
            offset: parseInt(task.children[1].value),
            warning: parseInt(task.children[2].value),
            repeat: parseInt(task.children[3].value),
            activated: task.children[4].checked
        })
    });
    localStorage.setItem("tasks", JSON.stringify(all));
}