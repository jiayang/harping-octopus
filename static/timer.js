var runningTasks;
var nextTask = {next: 100000000, warning: -1};
var additionalNextTasks;
var soonTasks;
var timeout;

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
    nextTask = {next: 100000000};
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
    let taskList = [];
    tasks.childNodes.forEach((li) => {
        if (li.children[4].checked) {
            taskList.push({
                label: li.children[0].value,
                offset: parseInt(li.children[1].value),
                warning: parseInt(li.children[2].value),
                repeat: parseInt(li.children[3].value)
            })
        }
    });
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

const updateTasks = function(taskList) {
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