import document from "document";
import * as fs from "fs";
import * as util from "../common/utils";
import { COLORS, FILE_NAME } from "../common/globals.js";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { battery } from "power";

const hrm = new HeartRateSensor();

hrm.onreading = function() {
  document.getElementById("hr").text = hrm.heartRate;
  hrm.stop();
}

export function WatchUI() {
  this.timeDigits = {};
  this.secondaryTexts = {};
  this.timeFormats = {};
  this.batRect = document.getElementById("batRect");

  ['hour0','hour1','min0','min1'].map(pid => this.timeDigits[pid] = document.getElementById(`${pid}`));
  ['date','cals','floors','dist','hr','steps','bat'].map(sid => this.secondaryTexts[sid] = document.getElementById(`${sid}`));
  ['timeText','hour0Box','hour1Box','min0Box','min1Box'].map(tid => this.timeFormats[tid] = document.getElementById(`${tid}`));
  
  //INIT
  try {
    this.fileSettings = fs.readFileSync(FILE_NAME, "cbor");
  } catch (err) {
    console.error("File not found, settings uninitiated.");
    this.fileSettings = {}
  }
  console.log("ffs " + JSON.stringify(this.fileSettings));

  if (this.fileSettings.color !== undefined) {
    console.log("Reading from settings");
    this.updatePrimary(this.fileSettings.color);
    this.updateFont(this.fileSettings.font);
  }
}

WatchUI.prototype.updatePrimary = function(color) {
  let icons = document.getElementsByClassName("stat-icon");
  
  this.fileSettings["color"] = color;
  fs.writeFileSync(FILE_NAME, this.fileSettings, "cbor");
  
  for (let t in this.timeDigits) {
    this.timeDigits[t].style.fill = COLORS[color].color;      
  }
  
  for (let i in icons) {
    icons[i].style.fill = COLORS[color].color;
  }
  
  this.batRect.style.fill = COLORS[color].color;
}

WatchUI.prototype.updateFont = function(font) {
  this.fileSettings["font"] = font;
  fs.writeFileSync(FILE_NAME, this.fileSettings, "cbor");

  for (let t in this.timeDigits) {
    this.timeDigits[t].style.fontFamily = font;
  }
  
  if (/^Colfax-*/.test(font) || /^System-*/.test(font) || /^Fabrikat-*/.test(font)) {
    this.timeFormats.timeText.y = 75;
    
    this.timeFormats.hour0Box.x = -90;
    this.timeFormats.hour1Box.x = -30;
    this.timeFormats.min0Box.x = 30;
    this.timeFormats.min1Box.x = 90;
  } else if (/^Tungsten-*/.test(font)) {
    this.timeFormats.timeText.y = 80;

    this.timeFormats.hour0Box.x = -60;
    this.timeFormats.hour1Box.x = -20;
    this.timeFormats.min0Box.x = 20;
    this.timeFormats.min1Box.x = 60;
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
  let day;
  
  if (typeof evt === "undefined") {
    day = new Date();
  } else {
    day = evt.date;
  }
  
  let date = day.toString().split(' ')
  let hours = day.getHours();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = util.zeroPad(hours % 12 || 12).toString().split("");
  } else {
    // 24h format
    hours = util.zeroPad(hours).toString().split("");
  }
  let mins = util.zeroPad(day.getMinutes()).toString().split("");
  
  this.timeDigits.hour0.text = `${hours[0]}`;
  this.timeDigits.hour1.text = `${hours[1]}`;
  this.timeDigits.min0.text = `${mins[0]}`;
  this.timeDigits.min1.text = `${mins[1]}`;

  this.secondaryTexts.date.text = `${date[0]} ${date[1]} ${date[2]}`.toUpperCase();
  
  // Update stats
  hrm.start();
  this.secondaryTexts.steps.text = today.adjusted.steps || 0;
  this.secondaryTexts.cals.text = today.adjusted.calories || 0;
  this.secondaryTexts.floors.text = today.adjusted.elevationGain || 0;
  this.secondaryTexts.dist.text = today.adjusted.distance || 0;
  this.secondaryTexts.bat.text = Math.floor(battery.chargeLevel) + "%";

  this.batRect.width = Math.floor(battery.chargeLevel/100*24);
  
  this.centerIcon();
}
