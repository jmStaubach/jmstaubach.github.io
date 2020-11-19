const VERSION = 1.0;
class TimerType {
    static TRAINING = "Training";
}
document.addEventListener("DOMContentLoaded", function (event) {
    //Send request to get the json config file
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let timers = JSON.parse(this.responseText);
        //Start TimerUpdater
        updater = new TimerUpdater(timers);
      }
    };
    xhttp.open("GET", "../model/timer_configs/timers.json", true);
    xhttp.send();

    document.getElementById("start-button").addEventListener("click", () => {
        updater.startCycle();

    })
});

class TimerUpdater {

    static BEEP_THRESHOLD = 4;
    static DEEP_BEEP_URL = "../assets/sounds/deep_beep.wav"
    static HIGH_BEEP_URL = "../assets/sounds/high_beep.wav"
    /**
     * Create the new Update which handles the beeps and the document updates.
     */
    constructor(timers) {
        this.timers = timers;
        this.sound = new Audio(TimerUpdater.DEEP_BEEP_URL);
        this.louderBeep = new Audio(TimerUpdater.HIGH_BEEP_URL);
        this.timerValue = document.getElementById("timer-value");
        this.timerUnit = document.getElementById("timer-unit");
        this.timerType = document.getElementById("timer-type");
        this.trainingRoundCounter = document.getElementById("timer-round")
        this.currentCylce = 0;

        //Set the initial value for the timer
        this.timerValue.innerText = this.timers[0].time;
    }

    /**
     * Starts a new Timer cycle.
     */
    async startCycle() {
        const cycleNr = ++this.currentCylce;
        for (const timeObj of this.timers) {
            let time = timeObj.time
            if(timeObj.type == TimerType.TRAINING) { 
                this.trainingRoundCounter.innerText = parseInt(this.trainingRoundCounter.innerText) + 1;    
            }
            this.timerType.innerText = timeObj.type;
            this.louderBeep.play();
            while (time) {
                this.timerValue.innerText = time;
                //Stop the timer if a new cycle has been started.
                if (cycleNr !== this.currentCylce) {
                    return;
                }
                //Play the sound below the threshold.
                if (time <= TimerUpdater.BEEP_THRESHOLD) {
                    this.sound.play();
                }
                time--;
                await this.sleep(1000);
            }
        }
        this.timerValue.innerText = 0;
        this.timerType.innerText = "Fertig";
        this.louderBeep.play();
    }

    /**
     * Sleeps for a specific amount of time.
     * @param {Number} ms The timeout in milliseconds. 
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


