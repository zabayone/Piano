// Global variables
var type;
var reps;
var key;
var dir;

// Running state
var values;
var rep_index = 0;
var button_list = []; // Container of the HTML for the buttons
var curr_val = 1;     // Exercise value
var root = 0;         // MIDI of the root note
var note_list = [];   // List of frequencies of the current exercise
var checked = 1;

var pressed_keys = []; // Array used to store the pressed keys in order to avoid multiple presses if held

// Keyboards variables
var octave = 0; // Start with C4 (MIDI 60)

// Volume settings
const volumes = {
    piano: 0.7, // Volume for piano
    guitar: 0.5, // Volume for guitar
    synth: 0.6 // Volume for synth
};

// Map keys to relative MIDI values (MIDI values start from 60 for C4)
const keyToMidi = {
    'a': 60,  // C4
    'w': 61,  // C#4
    's': 62,  // D4
    'e': 63,  // D#4
    'd': 64,  // E4
    'f': 65,  // F4
    't': 66,  // F#4
    'g': 67,  // G4
    'y': 68,  // G#4
    'h': 69,  // A4
    'u': 70,  // A#4
    'j': 71,  // B4
    'k': 72   // C5
};

// HTML objects
var head_div = document.getElementById("head");
var buttons_div = document.getElementById("buttons");
var controls_div = document.getElementById("controls");
var oct_num = document.getElementById("oct_num");

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let playTone = function(frequency) {
    console.log("No instrument selected. Cannot play note.");
};

// Function to play frequency with a gain node
function playFrequency(frequency, gainValue) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Create the low-pass filter

    filterNode.type = 'lowpass'; // Low-pass filter type
    filterNode.frequency.setValueAtTime(2000, audioCtx.currentTime); // Set cutoff frequency

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start at 0
    gainNode.gain.linearRampToValueAtTime(gainValue, audioCtx.currentTime + 0.01); // Fade-in
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.9); // Fade-out

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

// Updated playPianoTone function with gain control
function playPianoTone(frequency) {
    const fundamental = audioCtx.createOscillator();
    const harmonic1 = audioCtx.createOscillator(); // 2nd harmonic
    const harmonic2 = audioCtx.createOscillator(); // 3rd harmonic
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Low-pass filter to soften the sound

    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, audioCtx.currentTime); // Fundamental frequency

    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime); // 2nd harmonic

    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 3, audioCtx.currentTime); // 3rd harmonic

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioCtx.currentTime); // Cutoff at 2000 Hz

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now); // Start at 0
    gainNode.gain.linearRampToValueAtTime(volumes.piano, now + 0.01); // Quick attack to max volume
    gainNode.gain.linearRampToValueAtTime(volumes.piano * 0.7, now + 0.2); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Release

    fundamental.connect(filterNode);
    harmonic1.connect(filterNode);
    harmonic2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    fundamental.start();
    harmonic1.start();
    harmonic2.start();
    fundamental.stop(now + 1.5);
    harmonic1.stop(now + 1.5);
    harmonic2.stop(now + 1.5);
}


function playGuitarTone(frequency) {
    const fundamental = audioCtx.createOscillator();
    const harmonic1 = audioCtx.createOscillator(); // 2nd harmonic
    const gainNode = audioCtx.createGain();
    const filterNode = audioCtx.createBiquadFilter(); // Low-pass filter to soften the sound

    // Configure oscillators
    fundamental.type = 'sawtooth'; // Use sawtooth for the fundamental
    fundamental.frequency.setValueAtTime(frequency, audioCtx.currentTime); // Fundamental frequency

    harmonic1.type = 'sine'; // Use sine for the 2nd harmonic
    harmonic1.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime); // 2nd harmonic frequency

    // Set up the gain node and filter
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start at 0
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02); // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0); // Release

    // Low-pass filter to reduce high frequencies
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioCtx.currentTime); // Set cutoff frequency

    // Connect oscillators and gain node
    fundamental.connect(filterNode);
    harmonic1.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start oscillators
    const now = audioCtx.currentTime;
    fundamental.start(now);
    harmonic1.start(now);
    
    // Stop oscillators after 1 second
    fundamental.stop(now + 1);
    harmonic1.stop(now + 1);
}

// Updated playFrequency function to include gain value
function playSynthTone(frequency) {
    playFrequency(frequency, volumes.synth); // Use the synth volume
}

// Function triggered by buttons
function Piano() {
    head_div.innerHTML = "Playing Piano Tone";
    playTone = playPianoTone;  // Assign playTone to the Piano function
}

function Guitar() {
    head_div.innerHTML = "Playing Guitar Tone";
    playTone = playGuitarTone;  // Assign playTone to the Guitar function
}

function Synth() {
    head_div.innerHTML = "Playing Synth Tone";
    playTone = playSynthTone;  // Assign playTone to the Synth function
}

// Function to play a note based on MIDI note number
function playNoteFromMIDI(midiNote) {
    const frequency = midiToFreq(midiNote + octave); // Add the octave to the MIDI note
    console.log("Playing note: " + frequency + " Hz"); // Log the frequency for debugging
    playTone(frequency);  // Make sure playTone is called with the correct frequency
}

function midiToFreq(midi) {
    let midi_n = Number(midi);
    let offset = midi_n - 69; // Offset from MIDI note 69 (A4)
    return 440 * (Math.pow(2, offset / 12)); // Calculate the frequency
}

// Ensure the audio context is resumed on user interaction (fix for Safari)
function resumeAudioContext() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        console.log("Audio Context Resumed"); // Add this line to log resumption
    } else {
        console.log("Audio Context Already Running"); // Check if it’s running already
    }
}

// Event listener for keyboard keys
document.addEventListener('keydown', (event) => {
    resumeAudioContext(); // Resume audio context when a key is pressed
    const key = event.key.toLowerCase();
    
    if (!pressed_keys.includes(key)) {  // Check if key is not already pressed
        pressed_keys.push(key);
        const midiNote = keyToMidi[key] || null;
        if (midiNote) {
            playNoteFromMIDI(midiNote);
        } else {
            console.log("No MIDI note found for key:", key);
        }
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const note = keyToMidi[key];

    if (note != undefined && pressed_keys.find(e => e == key)) {
        pressed_keys.splice(pressed_keys.indexOf(key), 1);
    }
});

function octave_up() {
    octave += 12; // Increase octave
    oct_num.innerHTML = (octave / 12 - 1).toString(); // Update displayed octave number
}

function octave_down() {
    octave -= 12; // Decrease octave
    oct_num.innerHTML = (octave / 12 - 1).toString(); // Update displayed octave number
}
