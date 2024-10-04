const int_1 = document.getElementById("interval_1")
const int_2 = document.getElementById("interval_2")

const chd_1 = document.getElementById("chords_1")
const chd_2 = document.getElementById("chords_2")
const chd_3 = document.getElementById("chords_3")

function next(type) {
    localStorage.setItem("type", type)
    location.href = '/settings'
}

int_1.addEventListener("click", function() {
    next("11")
})
int_2.addEventListener("click", function() {
    next("12")
})
chd_1.addEventListener("click", function() {
    next("21")
})
chd_2.addEventListener("click", function() {
    next("22")
})
chd_3.addEventListener("click", function() {
    next("23")
})