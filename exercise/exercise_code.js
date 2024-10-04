// global variables
var type
var reps
var key
var dir

// running state
var values
var rep_index = 0
var button_list = []
var curr_val = 1
var root = 0
var note_list = []
var checked = 0

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
    if(type = "11") {
        mel_play(note_list)
    } else {
        harm_play(note_list)
    }
}

function next(){
    checked = 0
    note_list = []
    //head_div.innerHTML = "values =  " + values
    let idx = Math.floor(Math.random() * values.length)
    curr_val = values[idx]
    //head_div.innerHTML = "post =  " + idx + " " + curr_val
    root = Math.floor(Math.random() * 48) + 36
    play(curr_val)
}

function root(){
    let root_f = note_list[0]
    harm_play(root_f)
}

function harm_play(notes){
    notes.forEach(note => {
        let osc = c.createOscillator();
        osc.frequency.value = note
        osc.type = "sine"
        let gain = c.createGain();
        osc.connect(gain)
        gain.gain.setValueAtTime(0,c.currentTime);
        gain.gain.linearRampToValueAtTime(1,c.currentTime+ 10)
        gain.gain.linearRampToValueAtTime(1,c.currentTime + 1500)
        gain.gain.linearRampToValueAtTime(0,c.currentTime + 2000)
        gain.connect(c.destination)
        osc.start();
        setTimeout(() => osc.stop(), c.currentTime + 4000);
    })
}

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
    } else if (type == "12") {
        curr_code = val
        let second_note = root + Number(curr_code)
        notes_list.push(midiToFreq(root))
        note_list.push(midiToFreq(second_note))
        harm_play(note_list)
    } else {
        note_list.push(midiToFreq(root))
        curr_code = chord_codes[val]
        curr_code = curr_code.split(' ')
        //head_div.innerHTML = "code =  " + cur_code
        curr_code.forEach(code => {
            let oth = root + Number(code)
            note_list.push(midiToFreq(oth))
        })
        harm_play(note_list)
    }
}