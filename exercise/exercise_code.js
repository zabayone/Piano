// global variables
var type
var reps
var key
var dir

// running state
var values
var rep_index = 0
var button_list = []// container of the html for the buttons
var curr_val = 1    // exercise value
var root = 0        // midi of the root note
var note_list = []  // list of frequencies of the current exercise
var checked = 0

var pressed_keys = []

//keyboards variables

var octave = 60

// Map keys to relative midi values
const keyToMidi = {
    'a': 0,             //C4
    'w': 1,             //C#4
    's': 2,             //D4
    'e': 3,             //D#4
    'd': 4,             //E4
    'f': 5,             //F4
    't': 6,             //F#4
    'g': 7,             //G4
    'y': 8,             //G#4
    'h': 9,             //A4
    'u': 10,            //A#4
    'j': 11,            //B4
    'k': 12             //C5
};

// html oblects
var head_div = document.getElementById("head")
var buttons_div = document.getElementById("buttons")
var controls_div = document.getElementById("controls")

const c = new AudioContext();

/* function runned when the page is firstly loaded
 *  - loads the saved variables from the local storage
 *  - generates the correct html
 *  - loads the correct html for the chosen exercise
 *  
 */
function onLoad() {
    type = localStorage.getItem("type") // retrieving from local storage
    reps = localStorage.getItem("reps")
    key = localStorage.getItem("key")
    values = key.split("e")
    let text = ''
    switch(type){  // checking incoming values
        case "11":
            dir = localStorage.getItem("dir")
            text = 'type = '+type+'<br>dir = '+dir+'<br>reps = ' + reps +'<br>key = '+key +'<br> values: <br>'
        case "12":
            controls_div.innerHTML = interval_controls
            break;
        case"21":
        case"22":
        case"23":
        controls_div.innerHTML = chord_controls
    }
    if (type != "11") {
        text = 'type = '+type+'<br>reps = ' + reps +'<br>key = '+key +'<br> values: <br>'   
    }
    values.forEach( value => {
        text = text + value + '<br>'
    })
    head_div.innerHTML = text

    let but_text = ''
    values.forEach(value =>{    // generates the html for displaying the correct buttons
        button_list.push(new ChoiceButton(value))
        but_text = but_text + button_list[button_list.length-1].Html
        
    })
    buttons_div.innerHTML = but_text
    next();
}

class ChoiceButton {  // class encapsulating a button
    text = ''
    value = ''
    constructor(code){
        switch (type) {
            case "11":
            case "12":
                this.value = code
                this.text = interval_text[code-1]
                break;
            case "21":
            case "22":
            case "23":
                this.value = code
                this.text = chord_text[code-1]
                break;
            default:
                break;
        }
    }
    get Html(){
        return '<button id = "'+this.value+'" onclick = "  check_fun('+this.value+')" class = "choice_button">'+this.text+' </button>'
    }
}

function check_fun(value) {
    if(checked == 0){ 
       if(value == curr_val) {
            head_div.innerHTML = "correct"
        } else {
            head.innerHTML = "wrong"
        }
        checked = 1
    } else {
        play(value)
    }

}

function midiToFreq(midi){
    let midi_n = Number(midi)
    let offset = midi_n - 69
    return 440*(Math.pow(2,offset/12))
}

function replay(){
    play(curr_val)
}

function next(){
    checked = 0
    note_list = []
    //head_div.innerHTML = "values =  " + values
    let idx = Math.floor(Math.random() * values.length)
    curr_val = values[idx]
    root = Math.floor(Math.random() * 32) + 50
    head_div.innerHTML = "post =  " + idx + " " + curr_val + " " + root
    play(curr_val)
}

function play_root(){
    let root_f = midiToFreq(root)
    harm_play(root_f)
}

//play a set of notes harmonically --- doesn't work

function harm_play(notes){
    let txt = ''
    for (let i = 0; i < note_list.length; i++) {
        txt = txt + note_list[i] + " ";            
    }
    //head_div.innerHTML = txt
    notes.forEach(note => {
        resumeAudioContext();  
        //head_div.innerHTML = note
        asyncTone(note)
        //playTone(note)
    })
}

// play a sequence of notes melodically --- doesn't work

function mel_play(notes){
    let duration = 0;
    notes.forEach(note => {
        let osc = c.createOscillator();
        osc.frequency.value = note
        osc.type = "sine"
        let gain = c.createGain();
        osc.connect(gain)
        gain.gain.setValueAtTime(0,c.currentTime + duration);
        gain.gain.linearRampToValueAtTime(1,c.currentTime + duration + 10)
        gain.gain.linearRampToValueAtTime(1,c.currentTime + duration + 1500)
        gain.gain.linearRampToValueAtTime(0,c.currentTime + duration + 2000)
        gain.connect(c.destination)
        osc.start(c.currentTime + duration);
        setTimeout(() => osc.stop(), c.currentTime + duration + 2000);
        duration = duration + 2000
    })
}


// functions that implements the exercise, used to play more notes together or one after the other, depending on the exercise number 
function play(val){
    let curr_code = ''
    if (type == "11") {
        curr_code = val
        let second_note = 0;
        switch (dir) {
            case "up":
                second_note = root + Number(curr_code)
                break;
            case "down":
                second_note = root - Number(curr_code)
                break;
            case "both":
                let rnd = Math.random()*1000
                second_note = (rnd%2 == 0) ? root + Number(curr_code) : root - Number(curr_code)
                break;
            default:
                break;
        }
        note_list.push(midiToFreq(root))
        note_list.push(midiToFreq(second_note))
        mel_play(note_list)
        note_list = []
    } else if (type == "12") {
        curr_code = val
        let second_note = root + Number(curr_code)
        note_list.push(midiToFreq(root))
        note_list.push(midiToFreq(second_note))
        harm_play(note_list)
        note_list = []
    } else {
        note_list.push(midiToFreq(root))
        curr_code = chord_codes[val-1]
        curr_code = curr_code.split(' ')
        //head_div.innerHTML = "code =  " + cur_code
        curr_code.forEach(code => {
            let oth = root + Number(code)
            note_list.push(midiToFreq(oth))
        })
        harm_play(note_list)
        note_list = []
    }
}

// NICOLA'S CODE

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Play tone with attack and release envelope
function playTone(frequency) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Set waveform type
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Set up gain node 
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start at 0 
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01); // fade-in 
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.9); // fade-out 

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 1 second 
    oscillator.stop(audioCtx.currentTime + 1);
}

async function asyncTone(freq) {
    playTone(freq)
}

// Ensure the audio context is resumed on user interaction (fix for Safari)
function resumeAudioContext() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Event listener for keyboard keys
document.addEventListener('keydown', (event) => {
    resumeAudioContext();  
    const key = event.key.toLowerCase();
    const note = keyToMidi[key];

    if (note && !pressed_keys.find(e => e == key)) {
        //playTone(midiToFreq(note));
        asyncTone(midiToFreq(note + octave));
        pressed_keys.push(key)                    // save a key as pressed
    }
});

document.addEventListener('keyup', (event) => {   // used to impeed repetitions of the same note
    const key = event.key.toLowerCase();
    const note = keyToMidi[key];

    if (note && pressed_keys.find(e => e == key)) {
        pressed_keys.splice(pressed_keys.indexOf(key),1)
    }   
})

// Event listener for clicking on-screen keys
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        resumeAudioContext();  
        const note = Number(key.getAttribute('data-note')) + octave;
        playTone(midiToFreq(note));
    });
});

function octave_up() {
    octave += 12;
}
function octave_down() {
    octave -= 12;
}