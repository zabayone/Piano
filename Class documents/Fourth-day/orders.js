clicked = function (event) {
    event.target.querySelector(".led").classList.toggle("active-led");
  }
  
  alternative_clicked = function () {
    event.target.classList.add("active");
  }
  
  setup = function(e) {
    e.onclick = clicked
  }

  all_clicked = function() {
    document.querySelectorAll(".led").forEach(led => {
      led.classList.toggle("active-led");
    });
  }


  document.querySelectorAll(".key").forEach(setup);

  document.querySelector("#all").onclick = all_clicked;

  counter = 0
  document.querySelectorAll(".key")[counter].classList.toggle("active")
  incr = function () {
    document.querySelectorAll(".key")[counter].classList.toggle("active")
    counter = (counter + 1) % 4;
    console.log(counter);
    document.querySelectorAll(".key")[counter].classList.toggle("active")
  }
  intervalID = 0;

start = function () {
  intervalID = setInterval(incr, 1000);
  
}

reset = function() {
 
  counter = 0;
  document.querySelectorAll(".key")[counter].classList.toggle("active")
}

stop_function = function() {
  clearInterval(intervalID);
}

start_button.onclick = start

reset_button.onclick = reset

stop_button.onclick = stop_function