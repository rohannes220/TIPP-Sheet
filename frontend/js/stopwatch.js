//stopwatch functionality
//basecode example provided from
//"https://www.geeksforgeeks.org/javascript/create-a-stopwatch-using-bootstrap-javascript/"
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer;

startBtn.addEventListener("click", function () {
  // Check if timer is not already running
  if (!timer) {
    timer = setInterval(stopWatch, 10);
  }
});

stopBtn.addEventListener("click", function () {
  clearInterval(timer);
  timer = null; // Reset timer variable
});

resetBtn.addEventListener("click", function () {
  clearInterval(timer);
  timer = null; // Reset timer variable
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  updateDisplay();
});

function stopWatch() {
  count++;

  if (count == 100) {
    second++;
    count = 0;
  }

  if (second == 60) {
    minute++;
    second = 0;
  }

  if (minute == 60) {
    hour++;
    minute = 0;
    second = 0;
  }

  updateDisplay();
}

function updateDisplay() {
  document.getElementById("hr").textContent = hour.toString().padStart(2, "0");
  document.getElementById("min").textContent = minute
    .toString()
    .padStart(2, "0");
  document.getElementById("sec").textContent = second
    .toString()
    .padStart(2, "0");
  document.getElementById("count").textContent = count
    .toString()
    .padStart(2, "0");
}