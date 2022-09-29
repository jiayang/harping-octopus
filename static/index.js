const loot = { 
    at: 50,
    duration: 5,
    warning: 5,
    label: "Loot"
};

const lucid = {
    at: 50,
    duration: 5,
    warning: 5,
    label: "Normal Lucid"
};

const statusState = document.createElement("span");
const statusMsg = document.createElement("span");
const timeRemaining = document.createElement("span");
statusState.setAttribute("id", "statusState");
statusMsg.setAttribute("id", "statusMsg");
timeRemaining.setAttribute("id", "timeRemaining");

var circleTimer = new ProgressBar.Circle('#timer', {
    strokeWidth: 4,
    trailColor: '#383838',
    trailWidth: 1,
    text: {
        value: ""
    },
    step: function (state, circle) {
        var value = end - Math.round(circle.value() * end);
        timeRemaining.innerHTML = value;
    }
});
circleTimer.text.classList.add("timermsg");
circleTimer.text.style.color = "white";

circleTimer.text.appendChild(statusState);
circleTimer.text.appendChild(statusMsg);
circleTimer.text.appendChild(timeRemaining);

const reset = document.getElementById("reset");
const timerbox = document.getElementById("timerbox");
const pause = document.getElementById("pause");

var runningInterval;
var flashInterval;
var flashMe;
var queue;
var i, warn, active, end;
var flashon = false;

pause.onclick = () => {
    clearInterval(runningInterval);
    clearInterval(flashInterval);
    circleTimer.stop();
};

reset.onclick = () => {
    queue = [lucid, loot];
    clearInterval(runningInterval);
    clearInterval(flashInterval);
    flashon = false;
    runQueue();
};

const runQueue = function() {
    warn = -1;
    active = -1;
    end = 0;
    i = 0;

    runningInterval = setInterval(() => {
        if (i >= warn && i < active) {
            statusState.innerHTML = "Warning: <br>";
            flashMe = true;
        } else if (i >= active && i < end) {
            statusState.innerHTML = "Now: <br>";
        } else if (i == end) {
            flashMe = false;
            circleTimer.path.setAttribute("stroke", "white");
            task = queue.shift();
            queue.push(task);
            warn = task.at - task.warning;
            active = task.at;
            end = task.at + task.duration;
            i = -1;
            statusState.innerHTML = "Up Next: <br>";
            statusMsg.innerHTML = task.label + "<br>";
            circleTimer.set(0);
            circleTimer.animate(1.0, {
                duration: end * 1000
            });
        }

        i += 1;
    }, 1000);

    flashInterval = setInterval(() => {
        if (flashMe) {
            if (flashon) {
                circleTimer.path.setAttribute("stroke", "white");
                flashon = !flashon;
            } else {
                circleTimer.path.setAttribute("stroke", "#FA86C4");
                flashon = !flashon;
            }
        }
    }, 200);

}
    