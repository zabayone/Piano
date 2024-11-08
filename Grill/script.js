let rows = 3;
let cols = 3;

const board = document.getElementById('board');

// Función para crear el tablero
function createBoard() {
  board.innerHTML = ''; // Limpiar el tablero antes de regenerarlo
  
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-state', '0'); // Inicialmente el estado es 0 (punto)
    cell.classList.add('state-0');
    cell.addEventListener('click', changeState); // Agregar el evento de clic
    board.appendChild(cell);
  }

  // Configuración dinámica del estilo de la cuadrícula
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

// Función para cambiar el estado de una celda
function changeState(event) {
  const cell = event.target;
  let currentState = parseInt(cell.getAttribute('data-state')); // Obtener el estado actual

  // Cambiar el estado de la celda en un ciclo (de 0 a 1, de 1 a 2, de 2 a 0)
  currentState = (currentState + 1) % 3;
  
  cell.setAttribute('data-state', currentState); // Actualizar el estado en el atributo data-state
  cell.classList.remove('state-0', 'state-1', 'state-2'); // Eliminar las clases previas
  cell.classList.add(`state-${currentState}`); // Añadir la clase correspondiente al nuevo estado
}

// Función para actualizar el tablero según el número de filas y columnas
function updateBoard() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  createBoard(); // Regenerar el tablero con las nuevas dimensiones
}

// Crear el tablero al cargar la página
createBoard();
