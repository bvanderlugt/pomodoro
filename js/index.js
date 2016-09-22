function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60);
  var minutes = Math.floor( (t/1000/60) % 60);
  return {
    "total": t,
    "minutes": minutes,
    "seconds": seconds
  }
}

function calcCurrentSession(duration) {
  // get the duration of session in minutes, returns datetime object
  var currentTime = Date.parse(new Date());
  var targetTime = (duration*60*1000);
  var deadline = new Date(currentTime + targetTime);
  return deadline
  console.log(deadline)
}

function initializeClock(id, sessionDuration, breakDuration) {
  // takes a dom id and endtime for clock, creates new countdown
  // get minute and second objects for reference in updateClock
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector(".minutes");
  var secondsSpan = clock.querySelector(".seconds");
  if (isbreak) {
    var input = calcCurrentSession(breakDuration);
  } else {
    var input = calcCurrentSession(sessionDuration);
  }
  function updateClock(_input) { 
      var t = getTimeRemaining(_input);
      minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
      secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
      if(t.total <= 0) {
        // play the alert sound
        document.getElementById("sound").play();
        // toggle between session time and break time
        clearInterval(timeinterval)
        isbreak = true;
      }
  }
  var timeinterval = setInterval(function() { updateClock(input); }, 1000);
  return timeinterval;
}


function updateTimer(id, type) {
  // take dom id and interval or break and return the new 
  // number after button click
  var target = document.getElementById(id);
  var m = target.innerHTML;
  if (type === "minus") {
    if (parseInt(m) > 1) {
      var newM = parseInt(m) - 1;
    } else {
      var newM = parseInt(m);
    };
  } else {
    var newM = parseInt(m) + 1;
  };
  return newM;
}

// set a global var to determine clock state
var running = false;
var isbreak = false;

$(document).ready(function() {
  var newInterval = document.getElementById("interval").innerHTML;
  var clock = document.getElementById("timer")
  clock.querySelector(".minutes").innerHTML = ("0" + newInterval).slice(-2);
  clock.querySelector(".seconds").innerHTML = "00"
})

$(".circle").on("click", function() {
    var clock = document.getElementById("timer");
    var minutesSpan = clock.querySelector(".minutes");
    var secondsSpan = clock.querySelector(".seconds");
  if (!running) {
    var breaktime = document.getElementById("break").innerHTML;
    var endtime = minutesSpan.innerHTML
    // pass in the timer id, the deadline in mintes and breaktime in    minutes
    runningclock = initializeClock("timer", endtime, breaktime);
    running = true;
  } else {
    // grab current time
    var currentMin = minutesSpan.innerHTML;
    var currentSec = secondsSpan.innerHTML;
    // if clicked when clock is running, clearInterval
    clearInterval(runningclock);
    // set to last timer value
    minutesSpan.innerHTML = currentMin;
    secondsSpan.innerHTML = currentSec;
    running = false;
  }
})

$("#minusInterval").on("click", function() {
  if (!running & !isbreak) {
    var newInterval = updateTimer("interval", "minus");
    document.getElementById("interval").innerHTML = newInterval;
    var clock = document.getElementById("timer")
    clock.querySelector(".minutes").innerHTML = ("0" +   newInterval).slice(-2);
    clock.querySelector(".seconds").innerHTML = "00";
  }
})

$("#addInterval").on("click", function() {
  if (!running & !isbreak) {
    var newInterval = updateTimer("interval", "add");
    document.getElementById("interval").innerHTML = newInterval;
    var clock = document.getElementById("timer")
    clock.querySelector(".minutes").innerHTML = ("0" + newInterval).slice(-2);
    clock.querySelector(".seconds").innerHTML = "00";
  }
})

$("#minusBreak").on("click", function() {
  if (!running) {
    var newInterval = updateTimer("break", "minus");
    document.getElementById("break").innerHTML = newInterval;
  }
})

$("#addBreak").on("click", function() {
  if (!running) {
    var newInterval = updateTimer("break", "add");
    document.getElementById("break").innerHTML = newInterval;
  }
})