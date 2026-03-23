// 1. Seleccionamos los elementos
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notesContainer');

// 2. Cargar notas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedNotes = JSON.parse(localStorage.getItem('myNotes')) || [];
    savedNotes.forEach(noteText => renderNote(noteText));
});

// 3. Función para renderizar (dibujar) una nota en el HTML
function renderNote(noteObj) {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');
    
    // El objeto noteObj tendrá: { text: "hola", date: "22/03/2026 14:30" }
    noteCard.innerHTML = `
        <div>
            <p>${noteObj.text}</p>
            <small style="color: #888; font-size: 0.7rem;">${noteObj.date}</small>
        </div>
        <button class="delete-btn">Borrar</button>
    `;

    noteCard.querySelector('.delete-btn').addEventListener('click', () => {
        noteCard.remove();
        saveNotesToLocalStorage();
    });

    notesContainer.appendChild(noteCard);
}

// 4. Función para guardar TODAS las notas actuales en LocalStorage
function saveNotesToLocalStorage() {
    const notes = [];
    document.querySelectorAll('.note-card').forEach(card => {
        notes.push({
            text: card.querySelector('p').innerText,
            date: card.querySelector('small').innerText
        });
    });
    localStorage.setItem('myNotes', JSON.stringify(notes));
}

// 5. Evento principal: Añadir nota
addBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (text === "") return;

    const now = new Date();
    const dateString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    const newNote = { text: text, date: dateString };
    
    renderNote(newNote);
    saveNotesToLocalStorage();
    noteInput.value = "";
});

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const allNotes = document.querySelectorAll('.note-card');

    allNotes.forEach(note => {
        const text = note.querySelector('p').innerText.toLowerCase();
        // Si el texto incluye lo que buscamos, se muestra, si no, se oculta
        if (text.includes(query)) {
            note.style.display = "flex";
        } else {
            note.style.display = "none";
        }
    });
});

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Opcional: Cambiar solo el emoji si quieres
    themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌑';
});

// Al cargar la página, aplicar el tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);