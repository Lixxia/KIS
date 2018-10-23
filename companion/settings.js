import {settingsStorage} from "settings";

export function singleSetting(key, setting) {
  let arr = {};
  
  arr[key] = JSON.parse(setting);
  settingsStorage.setItem(key, setting);
  return arr;
}
