// Obtener las celdas y las piezas
const cells = document.querySelectorAll('.cell');
const pieces = document.querySelectorAll('.piece');

// Añadir los eventos de arrastre a las piezas
pieces.forEach(piece => {
  piece.addEventListener('dragstart', dragStart);
});

// Función para iniciar el arrastre
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Añadir los eventos de soltar a las celdas
cells.forEach(cell => {
  cell.addEventListener('dragover', dragOver);
  cell.addEventListener('drop', drop);
  cell.addEventListener('click', clearCell);  // Añadimos el evento de click para borrar la celda
});

// Función para permitir el arrastre sobre las celdas
function dragOver(event) {
  event.preventDefault();
}

// Función para soltar la pieza en una celda
function drop(event) {
  event.preventDefault();
  const pieceId = event.dataTransfer.getData("text");
  const piece = document.getElementById(pieceId);

  // Colocar la pieza en la celda, solo si está vacía
  if (!event.target.querySelector('.piece')) {  // Comprobar que no haya ya una pieza en la celda
    const newPiece = piece.cloneNode(true); // Clonamos la pieza para no perderla en el contenedor
    event.target.appendChild(newPiece); // Coloca la pieza dentro de la celda
  }
}

// Función para borrar el contenido de una celda cuando se hace clic en ella
function clearCell(event) {
  event.target.textContent = '';  // Elimina el contenido de la celda al hacer clic
  while (event.target.firstChild) {
    event.target.removeChild(event.target.firstChild);  // Elimina cualquier pieza (diagonal) de la celda
  }
}
