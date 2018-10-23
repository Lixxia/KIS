import * as messaging from "messaging";
import * as settings from "./settings.js";
import {settingsStorage} from "settings";

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.tokenRequest) {
    sendVal(token.reloadTokens(evt.data.tokenRequest));
  }
}

settingsStorage.onchange = evt => {
  if (evt.key === "color" || evt.key === "color2" || evt.key === "font") { //simple setting
    sendVal(settings.singleSetting(evt.key, evt.newValue));
  }
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {};
      data[key] = JSON.parse(settingsStorage.getItem(key));
      sendVal(data);
    }
  }
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.error("Unable to send data");
  }
}