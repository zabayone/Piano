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
var checked = 1

var pressed_keys = [] // array used to store the pressed keys in order to avoid multiple presses if held

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
var oct_num = document.getElementById("oct_num")

const c = new AudioContext();

/* function runned when the page is firstly loaded
 *  - loads the saved variables from the local storage
 *  - generates the correct html
 *  - loads the correct html for the chosen exercise
 *  
 */
function onLoad() {
    // retrieving from local storage
    type = localStorage.getItem("type") // which exercise
    reps = localStorage.getItem("reps") // number of repetitions
    key = localStorage.getItem("key")   // which intervals/chords
    values = key.split("e")
    let text = ''
    switch(type){  // setts the correct control buttons
        case "11":
            dir = localStorage.getItem("dir") // gets the direction if it's melodic intervals
            text = 'type = '+type+'<br>dir = '+dir+'<br>reps = ' + reps +'<br>key = '+key +'<br> values: <br>' // control string to be removed
        case "12":
            controls_div.innerHTML = interval_controls
            break;
        case"21":
        case"22":
        case"23":
            controls_div.innerHTML = chord_controls
            break;
    }
    if (type != "11") { // control text to be removed
        text = 'type = '+type+'<br>reps = ' + reps +'<br>key = '+key +'<br> values: <br>'   
    }
    values.forEach( value => {
        text = text + value + '<br>'
    })
    head_div.innerHTML = text

    let but_text = ''
    values.forEach(value =>{    // "generates" the html for displaying the correct choices for the execise
        but_text = but_text + buttonHtml(value)
        
    })
    buttons_div.innerHTML = but_text
    oct_num.innerHTML = octave/12 - 1
    next();
}

function buttonHtml(code){ // function for the Html
    let text
    switch (type) {
        case "11":
        case "12":
            text = interval_text[code-1]
            break;
        case "21":
        case "22":
        case "23":
            text = chord_text[code-1]
            break;
        default:
            break;
    }
    return '<button id = "'+code+'" onclick = "  check_fun('+code+')" class = "choice_button">'+text+' </button>'
}

function check_fun(value) { // executed when chosing an option
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

// Function to play a note based on MIDI note number
function playNoteFromMIDI(midiNote) {
    // Formula to convert MIDI note to frequency (Hz)
    const frequency = midiToFreq(midiNote);

    // Use Web Audio API to play the note
    playFrequency(frequency);
}


function midiToFreq(midi){ // from midi to frequency
    let midi_n = Number(midi)
    let offset = midi_n - 69
    return 440*(Math.pow(2,offset/12))
}

function replay(){ // replays the same solution
    play(curr_val)
}

function next(){ // function that creates the next
    if (rep_index < reps){
        if (checked) {
            checked = 0
            note_list = []
            //head_div.innerHTML = "values =  " + values
            let idx = Math.floor(Math.random() * values.length)
            curr_val = values[idx]
            root = Math.floor(Math.random() * 32) + 50
            head_div.innerHTML = "post =  " + idx + " " + curr_val + " " + root
            play(curr_val)
            head_div.innerHTML = "rep_idx = " + rep_index
            rep_index++;
        }
    } else {
        seeResults()
    }
}

function play_root(){
    let root_f = [] 
    root_f.push(midiToFreq(root))
    harm_play(root_f)
}

//play a set of notes harmonically --- doesn't work

function harm_play(notes){
    let txt = ''
    for (let i = 0; i < notes.length; i++) {
        txt = txt + note_list[i] + " ";            
    }
    head_div.innerHTML = txt
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
        resumeAudioContext();  
        //head_div.innerHTML = note
        //asyncTone(note)
        playTone(note)
    })
}


// functions that implements the exercise, used to play more notes together or one after the other, depending on the exercise number 
function play(val){
    let curr_code = ''
    if (type == "11") { // melodic intervals
        curr_code = val
        let second_note = 0;
        switch (dir) { // switch on the direction of the exercise
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
    } else if (type == "12") { // harmonic intervals
        curr_code = val
        let second_note = root + Number(curr_code)
        note_list.push(midiToFreq(root))
        note_list.push(midiToFreq(second_note))
        harm_play(note_list)
        note_list = []
    } else { // chords
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

function seeResults() {
        
        head_div.innerHTML = "done"
        location.href = '/results'
}

// NICOLA'S CODE

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFrequency(frequency) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Create the low-pass filter

    // Set up the filter
    filterNode.type = 'lowpass'; // Low-pass filter type
    filterNode.frequency.setValueAtTime(2000, audioCtx.currentTime); // Set cutoff frequency

    // Set waveform type
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Set up gain node
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start at 0
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01); // Fade-in
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.9); // Fade-out

    // Connect nodes
    oscillator.connect(filterNode);   // Oscillator output goes to the filter
    filterNode.connect(gainNode);     // Filter output goes to the gain node
    gainNode.connect(audioCtx.destination); // Gain node output goes to the audio destination

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 1 second
    oscillator.stop(audioCtx.currentTime + 1);
}


function playPianoTone(frequency) {
    // Create oscillators for fundamental and harmonic tones
    const fundamental = audioCtx.createOscillator();
    const harmonic1 = audioCtx.createOscillator(); // 2nd harmonic
    const harmonic2 = audioCtx.createOscillator(); // 3rd harmonic
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Low-pass filter to soften the sound

    // Oscillator settings
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, audioCtx.currentTime); // Fundamental frequency

    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime); // 2nd harmonic (double the frequency)

    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 3, audioCtx.currentTime); // 3rd harmonic (triple the frequency)

    // Set up the low-pass filter to soften the high frequencies (optional but helps)
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioCtx.currentTime); // Cutoff at 2000 Hz

    // Set up the envelope (attack, sustain, and release)
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now); // Start at 0
    gainNode.gain.linearRampToValueAtTime(1, now + 0.01); // Quick attack to max volume
    gainNode.gain.linearRampToValueAtTime(0.7, now + 0.2); // Sustain a bit lower than max
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Gradual release over 1.5 seconds

    // Connect the oscillators and nodes
    fundamental.connect(filterNode);
    harmonic1.connect(filterNode);
    harmonic2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start the oscillators
    fundamental.start();
    harmonic1.start();
    harmonic2.start();

    // Stop the oscillators after 1.5 seconds (when the envelope fades out)
    fundamental.stop(now + 1.5);
    harmonic1.stop(now + 1.5);
    harmonic2.stop(now + 1.5);
}

function playGuitarTone(frequency) {
    // Create oscillators for fundamental and harmonic tones
    const fundamental = audioCtx.createOscillator();
    const harmonic1 = audioCtx.createOscillator(); // 2nd harmonic
    const harmonic2 = audioCtx.createOscillator(); // 3rd harmonic
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Low-pass filter to soften the sound

    // Oscillator settings
    fundamental.type = 'sawtoot';
    fundamental.frequency.setValueAtTime(frequency, audioCtx.currentTime); // Fundamental frequency

    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime); // 2nd harmonic (double the frequency)

    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 4, audioCtx.currentTime); // 3rd harmonic (triple the frequency)

    // Set up the low-pass filter to soften the high frequencies (optional but helps)
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1500, audioCtx.currentTime); // Cutoff at 1500 Hz

    // Set up the envelope (attack, sustain, and release)
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now); // Start at 0
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01); // Fast attack to simulate pluck
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0); // Fast decay to simulate string damping

    // Connect the oscillators and nodes
    fundamental.connect(filterNode);
    harmonic1.connect(filterNode);
    harmonic2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start the oscillators
    fundamental.start();
    harmonic1.start();
    harmonic2.start();

    // Stop the oscillators after 1
    fundamental.stop(now + 1);
    harmonic1.stop(now + 1);
    harmonic2.stop(now + 1);
}


async function asyncTone(freq) {
    playFrequency(freq);
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

    head_div.innerHTML = "key = " + note
    if (note != undefined && !pressed_keys.find(e => e == key)) {
        //playTone(midiToFreq(note));
        asyncTone(midiToFreq(note + octave));
        pressed_keys.push(key)                    // save a key as pressed
    }
});

document.addEventListener('keyup', (event) => {   // used to impeed repetitions of the same note
    const key = event.key.toLowerCase();
    const note = keyToMidi[key];

    if (note != undefined && pressed_keys.find(e => e == key)) {
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
    oct_num.innerHTML = octave/12 - 1

}
function octave_down() {
    octave -= 12;
    oct_num.innerHTML = octave/12 - 1
}