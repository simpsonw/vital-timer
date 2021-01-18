import document from "document";
import { display } from "display";
import { vibration } from "haptics";
import * as messaging from "messaging";

let buttonNode = document.getElementById("button-1")
let timerNode = document.getElementById("timer")
var timerRunning;
var t;

const timerLength = 150;

function init() {
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


// Message is received
messaging.peerSocket.onmessage = evt => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "color" && evt.data.newValue) {
        let color = JSON.parse(evt.data.newValue);
        console.log(`Setting background color: ${color}`);
        background.style.fill = color;
    }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
    console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
    console.log("App Socket Closed");
};
