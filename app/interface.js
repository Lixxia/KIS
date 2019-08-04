import document from "document";
import * as fs from "fs";
import * as util from "../common/utils";
import { COLORS, FILE_NAME } from "../common/globals.js";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";

const hrm = new HeartRateSensor();

hrm.onreading = function() {
  document.getElementById("hr").text = hrm.heartRate;
  hrm.stop();
}

export function WatchUI() {
  this.secondaryTexts = {};
  this.timeText = document.getElementById("timeText");
  this.mins = document.getElementById("mins");
  this.hours = document.getElementById("hours");
  this.timeBg = document.getElementById("timeBg");

  ['date','hr','steps'].map(sid => this.secondaryTexts[sid] = document.getElementById(`${sid}`));
  
  try {
    this.fileSettings = fs.readFileSync(FILE_NAME, "cbor");
  } catch (err) {
    console.error("File not found, settings uninitiated.");
    this.fileSettings = {}
  }

  if (this.fileSettings.color !== undefined) {
    this.updatePrimary(this.fileSettings.color);
    this.updateFont(this.fileSettings.font);
  }
}

WatchUI.prototype.updatePrimary = function(color) {
  let icons = document.getElementsByClassName("stat-icon");
  
  this.fileSettings["color"] = color;
  fs.writeFileSync(FILE_NAME, this.fileSettings, "cbor");
  
  this.timeText.style.fill = COLORS[color].color;
  this.hours.style.fill = COLORS[color].color;
  
  for (let i in icons) {
    icons[i].style.fill = COLORS[color].color;
  }
}

WatchUI.prototype.updateFont = function(font) {
  this.fileSettings["font"] = font;
  fs.writeFileSync(FILE_NAME, this.fileSettings, "cbor");

  this.timeText.style.fontFamily = font;
  for (let s in this.secondaryTexts) {
    this.secondaryTexts[s].style.fontFamily = font;
  }
  this.updateClock();
}

WatchUI.prototype.centerIcon = function () {
  let offset = "";
  let offsetBase = 22;
  for (let s in this.secondaryTexts) {
    if (s === "date") {
      continue;
    }
    
    offset = (this.secondaryTexts[s].text.length/2 * offsetBase);
    if (offset <= offsetBase) offset = offsetBase + 9;
    document.getElementById(`${s}-icon`).x = 150-offset;
  }
}
WatchUI.prototype.updateClock = function(evt) {
  let hourHand = document.getElementById("hours");
  let minHand = document.getElementById("mins");
  let secHand = document.getElementById("secs");
  let day;
  
  if (typeof evt === "undefined") {
    day = new Date();
  } else {
    day = evt.date;
  }
  
  let date = day.toString().split(' ')
  let a_hours = day.getHours() % 12;
  let mins = day.getMinutes();
  let secs = day.getSeconds();

  hourHand.groupTransform.rotate.angle = util.hoursToAngle(a_hours, mins);
  minHand.groupTransform.rotate.angle = util.minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = util.secondsToAngle(secs);
   
  this.timeText.text = `${a_hours}`
  let {x, y} = util.hoursToCoord(a_hours);
  this.timeText.x = x;
  this.timeText.y = y;
  this.timeBg.x = x - 20;
  this.timeBg.y = y - 40;

  // if (preferences.clockDisplay === "12h") {
  //   hours = util.zeroPad(hours % 12 || 12).toString();
  // } else {
  //   hours = util.zeroPad(hours).toString();
  // }
  // let mins = util.zeroPad(day.getMinutes()).toString();
  // this.timeText.text = `${hours} ${mins}`  

  this.secondaryTexts.date.text = `${date[0]} ${date[1]} ${date[2]}`.toUpperCase();
  
  // Update stats
  hrm.start();
  this.secondaryTexts.steps.text = today.adjusted.steps || 0;
}
