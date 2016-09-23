'use-strict';


var Clock = function(runTime) {
  console.log('clock instance created');
  this.runTime = runTime;
  this.breakTime = false;
  this.running = false;
  // this.endTime = endTime;
  this.currentTime = Date.parse(new Date());
  this.targetTime = (runTime*60*1000);
  this.timeRemaining = new Date(this.currentTime + this.targetTime);
  console.log(this.timeRemaining);

  // reduce timeReamining by one second
  this.decrementSecond = function() {
    this.timeRemaining -= 1000;
  }

  // returns time left in miliseconds
  this.getTimeRemaining = function() {
    return Date.parse(this.timeRemaining) - Date.parse(new Date());
  }

  this.startBreak = function() {
    this.breakTime = true;
  }

  this.endBreak = function() {
    this.breakTime = false;
  }

  this.startRunning = function() {
    this.running = true;
  }

  this.stopRunning = function() {
    this.running = false;
  }

}

function convertMilisToSecondMinutes(milis) {
  // var t = Date.parse(endtime) - Date.parse(new Date());
  console.log("im gonna parse some shit " + milis);
  var seconds = Math.floor( (milis/1000) % 60);
  var minutes = Math.floor( (milis/1000/60) % 60);
  return {
    "minutes": minutes,
    "seconds": seconds
  }
}

// function calcCurrentSession(duration) {
//   // get the duration of session in minutes, returns datetime object
//   var currentTime = Date.parse(new Date());
//   var targetTime = (duration*60*1000);
//   var deadline = new Date(currentTime + targetTime);
//   return deadline
//   console.log(deadline)
// }

// function initializeClock(id, sessionDuration, breakDuration) {
//   // takes a dom id and endtime for clock, creates new countdown
//   // get minute and second objects for reference in updateClock
//   var clock = document.getElementById(id);
//   var minutesSpan = clock.querySelector(".minutes");
//   var secondsSpan = clock.querySelector(".seconds");
//   if (isBreak) {
//     var input = calcCurrentSession(breakDuration);
//   } else {
//     var input = calcCurrentSession(sessionDuration);
//   }
//   function updateClock(_input) {
//       var t = getTimeRemaining(_input);
//       minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
//       secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
//       if(t.total <= 0) {
//         // play the alert sound
//         document.getElementById("sound").play();
//         // toggle between session time and break time
//         clearInterval(timeinterval)
//         isBreak = true;
//       }
//   }
//   var  timeinterval = setInterval(function() { updateClock(input); }, 1000);
//   return timeinterval;
// }


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
// running means the timer is in progress
// var running = false;
/// isBreak
// var isBreak = false;

$(document).ready(function() {
  var newInterval = document.getElementById("interval").innerHTML;
  var clock = document.getElementById("timer")
  clock.querySelector(".minutes").innerHTML = ("0" + newInterval).slice(-2);
  clock.querySelector(".seconds").innerHTML = "00"
  var runTime = document.getElementById("interval").innerHTML;
  pomodoroClock = new Clock(runTime);
})

$(".circle").on("click", function() {

  if (pomodoroClock.running) {
    console.log("and I'm back in here now " + pomodoroClock.running)
    clearInterval(refreshIntervalId);
    pomodoroClock.stopRunning();
  }

  console.log("timer clicked and clock status is: " + pomodoroClock.running);
  if (!pomodoroClock.running) {
    console.log("can I get in here? " + pomodoroClock.running);
    pomodoroClock.startRunning();
    console.log("can I has running? " + pomodoroClock.running);

    var refreshIntervalId = setInterval(function() {
      pomodoroClock.decrementSecond();
      // update view
      var minutesLeft = convertMilisToSecondMinutes(pomodoroClock.getTimeRemaining()).minutes
      var secondsLeft = convertMilisToSecondMinutes(pomodoroClock.getTimeRemaining()).seconds
      document.getElementById("timer").querySelector(".minutes").innerHTML = minutesLeft;
      document.getElementById("timer").querySelector(".seconds").innerHTML = secondsLeft;
    }, 1000);
  }

  //   var clock = document.getElementById("timer");
  //   var minutesSpan = clock.querySelector(".minutes");
  //   var secondsSpan = clock.querySelector(".seconds");
  // if (!running) {
  //   if (isBreak) {
  //     var breaktime = document.getElementById("break").innerHTML;
  //     var endtime = minutesSpan.innerHTML
  //     // pass in the timer id, the deadline in mintes and breaktime in    minutes
  //     runningclock = initializeClock("timer", endtime, breaktime);
  //     running = true;
  //   } else {
  //     var starttime = document.getElementById("interval").innerHTML;
  //     var endtime = minutesSpan.innerHTML
  //     runningclock = initializeClock("timer", endtime, starttime);
  //     running = true;
  //   }
  // } else {
  //   // grab current time
  //   var currentMin = minutesSpan.innerHTML;
  //   var currentSec = secondsSpan.innerHTML;
  //   // if clicked when clock is running, clearInterval
  //   clearInterval(runningclock);
  //   // set to last timer value
  //   minutesSpan.innerHTML = currentMin;
  //   secondsSpan.innerHTML = currentSec;
  //   running = false;
  // }
})

// controllers for the duration of timer and break
// adjustments are allowed at anytime, but adjusting a running clock pauses the clock

$("#minusInterval").on("click", function() {
  // if (!running) {
    running = false;
    var newInterval = updateTimer("interval", "minus");
    document.getElementById("interval").innerHTML = newInterval;
    var clock = document.getElementById("timer")
    clock.querySelector(".minutes").innerHTML = ("0" +   newInterval).slice(-2);
    clock.querySelector(".seconds").innerHTML = "00";
  // }
})

$("#addInterval").on("click", function() {
  // if (!running) {
    running = false;
    var newInterval = updateTimer("interval", "add");
    document.getElementById("interval").innerHTML = newInterval;
    var clock = document.getElementById("timer")
    clock.querySelector(".minutes").innerHTML = ("0" + newInterval).slice(-2);
    clock.querySelector(".seconds").innerHTML = "00";
  // }
})

$("#minusBreak").on("click", function() {
  // if (!running) {
    running = false;
    var newInterval = updateTimer("break", "minus");
    document.getElementById("break").innerHTML = newInterval;
  // }
})

$("#addBreak").on("click", function() {
  // if (!running) {
    running = false;
    var newInterval = updateTimer("break", "add");
    document.getElementById("break").innerHTML = newInterval;
  // }
})
