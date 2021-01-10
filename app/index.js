import document from "document";
import { display } from "display";
import { vibration } from "haptics";
import * as messaging from "messaging";

let touchNode = document.getElementById("touch")
let timerNode = document.getElementById("timer")
let timerRunning = false;
const timerLength = 150;

function init() {
    updateTimer(timerLength);
}

function updateTimer(duration) {
    let seconds = Math.floor(duration/10);
    let deciseconds = Math.floor(duration%10);
    timerNode.text = seconds + "." + deciseconds;
}

init();

touchNode.addEventListener("mousedown", (evt) => {
    if (!timerRunning) {
        timerRunning = true;
        let elapsedTime = timerLength;
        let t = setInterval(function(){
            if (elapsedTime == 0) {
                vibration.start("ping");
                timerRunning = false;
                clearInterval(t);
            }
            updateTimer(elapsedTime);
            elapsedTime--;
            display.poke();
        }, 100);
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
