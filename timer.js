class TimerType {

    static PAUSE = "Pause";
    static TRAINING = "Training";
    static WARMUP = "Warm up";
}

class Timer {

    /**
     * Creates a new Timer
     * @param {TimerType} type The Type of the timer
     * @param {Number} time The time in seconds 
     */
    constructor(type,time) {
        this.type = type;
        this.time = time;
    }
}
const TIMERS = [
    new Timer(TimerType.WARMUP,10),
    new Timer(TimerType.TRAINING, 30),
    new Timer(TimerType.TRAINING, 30),
    new Timer(TimerType.TRAINING, 30),
    new Timer(TimerType.TRAINING, 30),
    new Timer(TimerType.TRAINING, 30),
    new Timer(TimerType.TRAINING, 30),    
    new Timer(TimerType.PAUSE, 60)
];

const BEEP_THRESHOLD = 4;
const AUDIO_URL = "https://freesfx.co.uk/sound/16867_1461333019.mp3"
const AUDIO_LOAD_BEEP_URL = "https://freesfx.co.uk/sound/16867_1461333019.mp3"
let updater = null;

document.addEventListener("DOMContentLoaded", function (event) {
    updater = new TimerUpdater();
    document.getElementById("btn").addEventListener("click", () => {
        updater.startCycle();

    })
});

class TimerUpdater {

    constructor() {
        this.sound = new Audio(AUDIO_URL);
        this.louderBeep = new Audio(AUDIO_LOAD_BEEP_URL);
        this.timerValue = document.getElementById("timer-value");
        this.timerUnit = document.getElementById("timer-unit");
        this.restartButton = document.getElementById("restart-button");
        this.timerType = document.getElementById("timer-type");
        this.trainingRoundCounter = document.getElementById("timer-round")
        this.currentCylce = 0;
    }

    /**
     * Starts a new Timer cycle
     */
    async startCycle() {
        const cycleNr = ++this.currentCylce;
        for (const timeObj of TIMERS) {
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
                console.log(time)
                //Play the sound below the threshold.
                if (time <= BEEP_THRESHOLD) {
                    this.sound.play();
                }
                time--;
                await this.sleep(1000);
            }
        }
    }

    /**
     * Sleeps for a specific amount of time.
     * @param {Number} ms The timeout in milliseconds. 
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


