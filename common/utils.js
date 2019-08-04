// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Returns an angle (0-360) for the current hour in the day, including minutes
export function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
export function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
export function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

export function hoursToCoord(hours) {
  var ycoords = {
    "12": 13,
    "1": 18,
    "2": 32,
    "3": 55,
    "4": 78,
    "5": 92,
    "6": 98,
    "7": 92,
    "8": 78,
    "9": 55,
    "10": 32,
    "11": 18
  }
  var xcoords = {
    "12": 50,
    "1": 72,
    "2": 90,
    "3": 95,
    "4": 90,
    "5": 72,
    "6": 50,
    "7": 28,
    "8": 10,
    "9": 5,
    "10": 10,
    "11": 28
  }

  return {
    x: (xcoords[hours] / 100) * 300,
    y: (ycoords[hours] / 100) * 300
  }
}