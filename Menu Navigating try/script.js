function showPage(pageId) {
  // Ocultar el menú principal
  document.getElementById("menu").classList.remove("active");

  // Ocultar todas las páginas
  const pages = document.querySelectorAll('.pagina');
  pages.forEach(page => page.classList.remove('active'));

  // Mostrar la página seleccionada
  document.getElementById(pageId).classList.add("active");
}

function goBack() {
  // Ocultar todas las páginas
  const pages = document.querySelectorAll('.pagina');
  pages.forEach(page => page.classList.remove('active'));

  // Mostrar el menú principal
  document.getElementById("menu").classList.add("active");
}