import document from "document";
import { display } from "display";
import { vibration } from "haptics";
import * as messaging from "messaging";
import * as simpleSettings from "./simple/device-settings";

const defaultTimerLength = 150;
let buttonNode = document.getElementById("button-1");
let timerNode = document.getElementById("timer");
var timerRunning;
var t;
var timerLength;

function init() {
    if (typeof(timerLength) === "undefined") {
        timerLength = defaultTimerLength;
    }
    timerRunning = false;
    updateTimer(timerLength);
    buttonNode.text = "START"
    vibration.stop()
}

function updateTimer(duration) {
    let seconds = Math.floor(duration/10);
    let deciseconds = Math.floor(duration%10);
    timerNode.text = seconds + "." + deciseconds;
}

init();

buttonNode.addEventListener("mousedown", (evt) => {
    if (!timerRunning) {
        buttonNode.text = "RESET"
        timerRunning = true;
        let startTime = Date.now();
        t = setInterval(function(){
            let elapsedTime = Date.now() - startTime;
            let elapsedDeciseconds = Math.floor(elapsedTime / 100);
            if (elapsedDeciseconds >= timerLength) {
                buttonNode.text = "DISMISS"
                vibration.start("alert");
                clearInterval(t);
            }
            updateTimer(timerLength - elapsedDeciseconds);
            display.poke();
        }, 100);
    } else {
        clearInterval(t);
        init();
    }
});

function settingsCallback(data) {
    console.log("settingsCallback: " + JSON.stringify(data));
    if (data.duration) {
        timerLength = data.duration.values[0].value;
        updateTimer(timerLength);
    }
}

simpleSettings.initialize(settingsCallback);
