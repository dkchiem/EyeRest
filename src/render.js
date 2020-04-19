const notifier = require("node-notifier");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const skipBtn = document.getElementById("skipBtn");
const timeLabel = document.getElementById("timer");

var skipped = 0;
var started = false;

pauseBtn.style.display = "none";
skipBtn.style.display = "none";

startBtn.onclick = work;
pauseBtn.onclick = pause;
skipBtn.onclick = skip;

// Work
function work() {
  console.log("Working");
  if (started == false) {
    started = true;
    startBtn.style.display = "none";
  }
  timer(10, () => {
    question();
  });
}

// Ask pause question
function question() {
  console.log("question");
  pauseBtn.style.display = "inline";
  skipBtn.style.display = "inline";
  notifier.notify(
    {
      title: "Time for a pause",
      message: "Turn to a 20 feet area and take a pause.",
      icon: "./assets/eye.png",
      wait: true,
      closeLabel: "Skip",
      actions: "Pause",
      timeout: 10,
    },
    (error, response, metadata) => {
      if (error) throw error;
      console.log(response, metadata);
      if (response === "activate") {
        pause();
      } else if (response === "closed") {
        skip();
      }
    }
  );
}

// Pause 20 seconds
function pause() {
  console.log("pause");
  pauseBtn.style.display = "none";
  skipBtn.style.display = "none";
  notifier.notify({
    title: "Pause",
    message: "20 seconds",
    icon: "./assets/eye.png",
    wait: false,
  });
  timer(20, () => {
    console.log("done");
    notifier.notify({
      title: "Come back to your work",
      message: "20 seconds is up",
      icon: "./assets/eye.png",
      wait: false,
    });
    work();
  });
}

// Skip
function skip() {
  console.log("skip");
  pauseBtn.style.display = "none";
  skipBtn.style.display = "none";
  skipped++;
  notifier.notify({
    title: "Skipped",
    message: "You have skipped " + skipped + " times",
    icon: "./assets/eye.png",
    wait: false,
  });
  work();
}

// Timer
function timer(totalSeconds, callback) {
  var passedSeconds = 0;
  var seconds = totalSeconds % 60;
  var minutes = (totalSeconds - seconds) / 60;
  timeLabel.innerHTML = `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(
    -2
  )}`;
  console.log(minutes + " minutes");
  console.log(seconds + " seconds");

  const interval = setInterval(() => {
    passedSeconds++;
    if (seconds == 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    timeLabel.innerHTML = `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(
      -2
    )}`;
    if (passedSeconds == totalSeconds) {
      console.log("timer ended");
      clearInterval(interval);
      callback();
    }
  }, 1000);
}
