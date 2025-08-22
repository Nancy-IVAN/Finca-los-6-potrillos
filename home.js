document.addEventListener('DOMContentLoaded', () => {
    const toggleThemeButton = document.getElementById('toggle-theme');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const cards = document.querySelectorAll('.card');
    const cardBodies = document.querySelectorAll('.card-body');
    const cardHeaders = document.querySelectorAll('.card-header');
    const quienesSomos = document.querySelector('.quienes-somos');

    toggleThemeButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode'); // Alterna la clase 'dark-mode' en el body
        const isDarkMode = body.classList.contains('dark-mode');
        toggleThemeButton.textContent = isDarkMode ? 'Modo claro' : 'Modo oscuro'; // Cambia el texto del botón

        // Alternar el modo oscuro en la barra de navegación
        navbar.classList.toggle('dark-mode');

        // Alternar el modo oscuro en las tarjetas
        cards.forEach(card => card.classList.toggle('dark-mode'));
        cardBodies.forEach(cardBody => cardBody.classList.toggle('dark-mode'));
        cardHeaders.forEach(cardHeader => cardHeader.classList.toggle('dark-mode'));

        // Alternar el modo oscuro en la sección "Quienes somos"
        quienesSomos.classList.toggle('dark-mode');
    });
});





