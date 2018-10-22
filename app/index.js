import clock from "clock";
import * as messaging from "messaging";
import { battery } from "power";
import { WatchUI } from "./interface.js";

import { memory } from "system";
console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

let ui = new WatchUI();
clock.granularity = "minutes";

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  messaging.peerSocket.send("Open");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.hasOwnProperty('color')) {
    ui.updatePrimary(evt.data.color);
  } else if (evt.data.hasOwnProperty('font')) {
    ui.updateFont(evt.data.font.values[0].name);
  }
}

clock.ontick = (evt) => ui.updateClock(evt);