// MODEL
counter = 0

keys = [0, 0, 0, 0, 0, 0, 0, 0]
// VIEW

turn_off = function (el) {
  el.classList.remove("active")
}

render = function () {
  document.querySelectorAll(".elem").forEach(turn_off)
   document.querySelectorAll(".elem")[counter].classList.add("active")
   document.querySelectorAll(".elem").forEach(function(e, i){
     e.querySelector(".circle").classList.toggle("active-circle", keys[i]);
   })
 }

// MIX

clicked = function (i) {
  keys[i] = 1 - keys[i]
  render()
}

all_clicked = function() {
  keys.forEach((_, i) => clicked(i));
}

// CONTROLLER
//clicked = function () {}


setup = function(e, i) {
  e.onclick = function() {
    clicked(i)
  }
}

document.querySelectorAll(".elem").forEach(setup);

document.querySelector("#all").onclick = all_clicked;

start = function () {
  intervalID = setInterval(incr, 1000);
}

reset = function() {
  counter = 0;
}

stop_function = function() {
  clearInterval(intervalID);
}

start_button.onclick = start

reset_button.onclick = reset

stop_button.onclick = stop_function

intervalID = 0;

incr = function () {
  render();
  counter = (counter + 1) % 8;
  console.log(counter);
  
}


