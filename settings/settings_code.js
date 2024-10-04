var type
const next = document.getElementById("next")
const show = document.getElementById("show")
const intro = document.getElementById("intro")
const choice = document.getElementById("choices")
const settings = document.getElementById("settings")

next.addEventListener("click", function() {
    var msg = getCheckbox()
    localStorage.setItem("key", msg)
    localStorage.setItem("reps", document.getElementById("num_ex").value)
    if (type == 11) {
        localStorage.setItem("dir", document.getElementById("direction").value) 
    }
    location.href = '/exercise'
})

show.addEventListener("click", function() {
    var msg = getCheckbox()
    document.getElementById("intro").textContent = msg
    localStorage.setItem("key", msg)
    localStorage.setItem("reps", document.getElementById("num_ex").value)
    if (type == 11) {
        localStorage.setItem("dir", document.getElementById("direction").value) 
    }

})

function onLoad() {
    type = localStorage.getItem("type")
    settings.innerHTML = getSettings(type)
    choice.innerHTML = getChoices(type)
    intro.innerHTML = getIntro(type)
}

function getCheckbox(){
    var inputElements = document.getElementsByClassName('selected');
    var checkedValue = ''
    for(var i=0; inputElements[i]; ++i){
      if(inputElements[i].checked){
           if (checkedValue == '') {
                checkedValue = inputElements[i].value.toString()
           } else {
            checkedValue = checkedValue + 'e' + inputElements[i].value.toString()
           }
      }
    }
  return checkedValue
}

function getSettings(type) {
    switch(type) {
        case "11":
            return def_setts + mel_setts
        default:
            return def_setts
    }
}

function getChoices(type) {
    switch (type) {
        case "11":
        case "12":
            return intervals
        case "21":
            return triads + '--Others--<br>' + other_triads
        case "22":
            return seventh + '--Others--<br>' + other_seventh
        case "23":
            return '--Triads--<br>' + triads + other_triads + '--Seventh--<br>' + seventh + other_seventh + '--Others--<br>' + other
        default:
            break;
    }
}

function getIntro(type) {
    switch (type) {
        case "11":
            return 'Melodic Intervals'
        case "12":
            return 'Harmonic Interval'
        case "21":
            return 'Triads'
        case "22":
            return 'Seventh Chords'        
        case "23":
            return 'A Lot of Chords'  
        default:
            break;
    }
}