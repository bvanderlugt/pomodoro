'use-strict'

const globalVars = {}

/**
param int runTime : minutes of runtime
**/
var Clock = function (runTime) {
  console.log('clock instance created')
  this.runTime = runTime
  this.breakTime = false
  this.running = false
  let durationOfTimerInMilis = runTime * 60 * 1000
  let endTime = new Date(Date.parse(new Date()) + durationOfTimerInMilis)
  this.timeRemaining = Date.parse(endTime) - Date.parse(new Date())

  // reduce timeReamining by one second
  this.decrementSecond = function () {
    this.timeRemaining -= 1000
  }

  // returns time left in miliseconds
  this.getTimeRemaining = function () {
    return this.timeRemaining
  }

  // set time in minutes
  this.setTimeRemaining = function (newTime) {
    let newTimeMilis = newTime * 60 * 1000
    let endTime = new Date(Date.parse(new Date()) + newTimeMilis)
    this.timeRemaining = Date.parse(endTime) - Date.parse(new Date())
  }

  // this.toggleBreak = function () {
  //   this.breakTime = !this.breakTime
  // }
  //
  // this.toggleRunning = function () {
  //   this.running = !this.running
  // }

  this.start = function () {
    console.log("clock started and breaktime is " + this.breakTime)
    this.running = true
    this.refreshIntervalId = setInterval(function () {
      globalVars.pomodoroClock.decrementSecond()
      // update view
      var minutesLeft = convertMilisToSecondMinutes(globalVars.pomodoroClock.getTimeRemaining()).minutes
      var secondsLeft = convertMilisToSecondMinutes(globalVars.pomodoroClock.getTimeRemaining()).seconds
      document.getElementById('timer').querySelector('.minutes').innerHTML = ('0' + minutesLeft).slice(-2)
      document.getElementById('timer').querySelector('.seconds').innerHTML = ('0' + secondsLeft).slice(-2)
      // console.log('dafuq is time remaining ' + globalVars.pomodoroClock.getTimeRemaining())

      if (globalVars.pomodoroClock.getTimeRemaining() <= 0) {
        console.log('time expired')
        if (!globalVars.pomodoroClock.breakTime) {
          globalVars.pomodoroClock.breakTime = true
          // if start of breaktime reset clock to break interval and start running it
          document.getElementById('sound').play()
          console.log("it's breaktime! Have we set BT to true? " + globalVars.pomodoroClock.breakTime)
          globalVars.pomodoroClock.setTimeRemaining(document.getElementById('break').innerHTML)
        } else {
          globalVars.pomodoroClock.pause()
          globalVars.pomodoroClock.breakTime = false
          console.log("ok, breaktime should be over now: " + globalVars.pomodoroClock.breakTime)
          globalVars.pomodoroClock.setTimeRemaining(document.getElementById('interval').innerHTML)
          var freshStartMin = convertMilisToSecondMinutes(globalVars.pomodoroClock.getTimeRemaining()).minutes
          var freshStartSec = convertMilisToSecondMinutes(globalVars.pomodoroClock.getTimeRemaining()).seconds
          document.getElementById('timer').querySelector('.minutes').innerHTML = ('0' + freshStartMin).slice(-2)
          document.getElementById('timer').querySelector('.seconds').innerHTML = ('0' + freshStartSec).slice(-2)
        }
      }
    }, 1000)
  }

  this.pause = function () {
    this.running = false
    clearInterval(this.refreshIntervalId)
    delete this.refreshIntervalId
  }
}

function convertMilisToSecondMinutes (milis) {
  // var t = Date.parse(endtime) - Date.parse(new Date());
  // console.log('im gonna parse some shit ' + milis)
  var seconds = Math.floor((milis / 1000) % 60)
  var minutes = Math.floor((milis / 1000 / 60) % 60)
  return {
    'minutes': minutes,
    'seconds': seconds
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

function updateTimer (id, type) {
  // take dom id and interval or break and return the new
  // number after button click
  var target = document.getElementById(id)
  var m = target.innerHTML
  if (type === 'minus') {
    if (parseInt(m) > 1) {
      var newM = parseInt(m) - 1
    } else {
      newM = parseInt(m)
    };
  } else {
    newM = parseInt(m) + 1
  };
  return newM
}

// set a global var to determine clock state
// running means the timer is in progress
// var running = false;
// / isBreak
// var isBreak = false;

/* global $ */

$(document).ready(function () {
  var newInterval = document.getElementById('interval').innerHTML
  var clock = document.getElementById('timer')
  clock.querySelector('.minutes').innerHTML = ('0' + newInterval).slice(-2)
  clock.querySelector('.seconds').innerHTML = '00'
  var runTime = document.getElementById('interval').innerHTML
  console.log('runTime is ' + runTime)
  globalVars.pomodoroClock = new Clock(runTime)
})

// initializing in global scope, does not seem to work on global namespace
// var refreshIntervalId

$('.circle').on('click', function () {
  // console.log('at click running state of clock is ' + globalVars.pomodoroClock.running)
  // when running returns false
  if (!globalVars.pomodoroClock.running) {
    globalVars.pomodoroClock.start()
  } else {
    globalVars.pomodoroClock.pause()
  }
  // console.log('after click running state of clock is ' + globalVars.pomodoroClock.running)
})

$('#minusInterval').on('click', function () {
  if (globalVars.pomodoroClock.running) {
    globalVars.pomodoroClock.pause()
  }
  let newInterval = updateTimer('interval', 'minus')
  document.getElementById('interval').innerHTML = newInterval
  if (!globalVars.pomodoroClock.breakTime) {
    var clock = document.getElementById('timer')
    clock.querySelector('.minutes').innerHTML = ('0' + newInterval).slice(-2)
    clock.querySelector('.seconds').innerHTML = '00'
    globalVars.pomodoroClock.setTimeRemaining(document.getElementById('interval').innerHTML)
  }
})

$('#addInterval').on('click', function () {
  if (globalVars.pomodoroClock.running) {
    globalVars.pomodoroClock.pause()
  }
  let newInterval = updateTimer('interval', 'add')
  document.getElementById('interval').innerHTML = newInterval
  if (!globalVars.pomodoroClock.breakTime) {
    var clock = document.getElementById('timer')
    clock.querySelector('.minutes').innerHTML = ('0' + newInterval).slice(-2)
    clock.querySelector('.seconds').innerHTML = '00'
    globalVars.pomodoroClock.setTimeRemaining(document.getElementById('interval').innerHTML)
  }
})

$('#minusBreak').on('click', function () {
  if (globalVars.pomodoroClock.running) {
    globalVars.pomodoroClock.pause()
  }
  var newInterval = updateTimer('break', 'minus')
  document.getElementById('break').innerHTML = newInterval
  if (globalVars.pomodoroClock.breakTime) {
    var clock = document.getElementById('timer')
    clock.querySelector('.minutes').innerHTML = ('0' + newInterval).slice(-2)
    clock.querySelector('.seconds').innerHTML = '00'
    globalVars.pomodoroClock.setTimeRemaining(document.getElementById('break').innerHTML)
  }
})

$('#addBreak').on('click', function () {
  if (globalVars.pomodoroClock.running) {
    globalVars.pomodoroClock.pause()
  }
  var newInterval = updateTimer('break', 'add')
  document.getElementById('break').innerHTML = newInterval
  if (globalVars.pomodoroClock.breakTime) {
    var clock = document.getElementById('timer')
    clock.querySelector('.minutes').innerHTML = ('0' + newInterval).slice(-2)
    clock.querySelector('.seconds').innerHTML = '00'
    globalVars.pomodoroClock.setTimeRemaining(document.getElementById('break').innerHTML)
  }
})
