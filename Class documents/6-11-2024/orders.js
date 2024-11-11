const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

const canvas = document.getElementById('myvisualizer'); // Asegúrate de que el ID coincide con tu HTML
const canvasCtx = canvas.getContext('2d');

// Define WIDTH y HEIGHT a partir del tamaño del canvas
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
// …
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
// Connect the source to be analyzed

analyser.connect(audioCtx.destination);
g=audioCtx.createGain();
g.gain.value=0.5;
// draw an oscilloscope of the current audio source
o2 = audioCtx.createOscillator();
o2.frequency.value=500;
o2.connect(g);
g.connect(analyser);
o2.start();

function playSound() {
  audioCtx.resume();
  o = audioCtx.createOscillator();
  o.connect(g);
  g.connect(analyser);
  o.frequency.setValueAtTime(510, audioCtx.currentTime);
  o.frequency.setTargetAtTime(490, audioCtx.currentTime, 5);
  o.start()
  setTimeout(() => {
    o.stop();
  }, 6000);
}



function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray); // Obtener datos de frecuencia

  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];

    // Cambiar Y para invertir el eje y que el espectrograma se vea correctamente
    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

draw();
