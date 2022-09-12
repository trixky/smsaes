import { Application } from "@nativescript/core";
import Toast from "nativescript-toast";
import { getDate, setDate } from "../db/settings";
import { timestampToString } from "./date";

// ------------------------------- open
async function listenOpen() {
  getDate().then((date) => {
    Toast.makeText(timestampToString(date.valueOf())).show();
  });
}

// ------------------------------- close
function listenClose() {
  setDate();
}

export default function keepDate() {
  // ------------------------------- open
  Application.on(Application.launchEvent, () => {
    listenOpen();
  });

  Application.on(Application.resumeEvent, () => {
    listenOpen();
  });

  // ------------------------------- close
  Application.on(Application.suspendEvent, () => {
    listenClose();
  });

  Application.on(Application.exitEvent, () => {
    listenClose();
  });
}
