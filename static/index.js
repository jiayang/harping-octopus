const loot = { 
    offset: 110,
    warning: 10,
    repeat: 55,
    label: "Loot"
};

const lucid = {
    offset: 55,
    warning: 10,
    repeat: 110,
    label: "Normal Lucid"
};

const goldpotion = {
    offset: 1800,
    warning: 10,
    repeat: 1800,
    label: "30 minute buffs"
}

var taskList = [lucid, loot, goldpotion];
var runningTasks;
var nextTask = {next: 10000, warning: -1};
var additionalNextTasks;
var soonTasks;
var timeout;

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

const updateSoonMsg = function() {
    if (soonTasks.length == 0) {
        soonMsg.innerHTML = "";
    } else {
        soonMsg.innerHTML = soonTasks.map(task => task.label).join(", ") + "<br>";
    }
}

const updateStatusMsg = function () {
    statusMsg.innerHTML = nextTask.label + "<br>";
    additionalNextTasks.forEach((task) => {
        statusMsg.innerHTML += task.label + "<br>";
    });
}

const updateNextTask = function(taskList) {
    nextTask = {next: 10000};
    additionalNextTasks = [];
    soonTasks = [];

    taskList.forEach((task) => {
        if (task.next < nextTask.next) {
            nextTask = task;
        }
    });

    taskList.forEach((task) => {
        if (task.next == nextTask.next && task !== nextTask) {
            additionalNextTasks.push(task);
        } else if (task.next - nextTask.next <= 10 && task !== nextTask) {
            soonTasks.push(task);
        }
    });
    updateStatusMsg();
    updateSoonMsg();
}

var flashOn = false;
var flashMe = false;
var flashInterval;


var circleTimer = new ProgressBar.Circle('#timer', {
    strokeWidth: 4,
    trailColor: '#383838',
    trailWidth: 1,
    text: {
        value: ""
    },
    step: function (state, circle) {
        var value = nextTask.next - Math.round(nextTask.next * circle.value());
        flashMe = nextTask.warning >= value;
        timeRemaining.innerHTML = value + "<br>";
    }
});

circleTimer.text.classList.add("timermsg");
circleTimer.text.style.color = "white";
circleTimer.text.appendChild(statusState);
circleTimer.text.appendChild(statusMsg);
circleTimer.text.appendChild(soonMsg);
circleTimer.text.appendChild(timeRemaining);

stopButton.onclick = () => {
    clearTimeout(timeout);
    clearInterval(flashInterval);
    circleTimer.stop();
    runningTasks = [];
};

resetButton.onclick = () => {
    stopButton.click();
    taskList.forEach((task) => {startTask(task)});
    flashInterval = setInterval(() => {
        if (flashMe) {
            if (flashOn) {
                circleTimer.path.setAttribute("stroke", "#4a4a4a");
                flashOn = !flashOn;
            } else {
                circleTimer.path.setAttribute("stroke", "#FA86C4");
                flashOn = !flashOn;
            }
        } else {
            circleTimer.path.setAttribute("stroke", "#4a4a4a");
        }
    }, 200);
    updateTasks(taskList);
    
};

const startTask = function(task) {
    runningTasks.push(task);
    task.next = task.offset;
}

const updateTasks = function() {
    updateNextTask(taskList);
    circleTimer.set(0);
    circleTimer.animate(1.0, {
        duration: nextTask.next * 1000
    });
    timeout = setTimeout((task) => {
        let elapsed = task.next;
        runningTasks.forEach((running) => {
            running.next -= elapsed;
            if (running.next == 0) running.next = running.repeat;
        });
        updateTasks(taskList);
    }, nextTask.next * 1000, nextTask);
}