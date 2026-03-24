// 1. Selección de elementos del DOM
const titleInput = document.getElementById('titleInput');
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

// 2. Cargar tareas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    savedTasks.forEach(task => renderTask(task));
    
    // Aplicar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
});

// 3. Función para dibujar la tarea en pantalla
function renderTask(taskObj) {
    const card = document.createElement('div');
    card.classList.add('note-card');
    
    // Aplicar clase visual según el estado guardado
    if (taskObj.status === 'done') card.classList.add('status-done');

    card.innerHTML = `
        <div style="flex-grow: 1;">
            <h3 style="margin: 0 0 5px 0; font-size: 1.1rem;">${taskObj.title}</h3>
            <p style="margin: 0;">${taskObj.text}</p>
            <small style="display:block; margin-top:5px; opacity: 0.7;">${taskObj.date}</small>
            
            <div class="actions" style="margin-top: 10px; display: flex; gap: 5px;">
                <button class="btn-status btn-done">Terminado</button>
                <button class="btn-status btn-todo">Por hacer</button>
                <button class="btn-status btn-delete" style="background-color: #dc3545; color: white;">Borrar</button>
            </div>
        </div>
    `;

    // Asignar eventos a los nuevos botones
    // Botón Terminado
    card.querySelector('.btn-done').onclick = () => {
        card.classList.add('status-done');
        saveTasks(); // Guardamos el cambio de estado
    };

    // Botón Por Hacer (Para revertir el tachado)
    card.querySelector('.btn-todo').onclick = () => {
        card.classList.remove('status-done');
        saveTasks(); // Guardamos el cambio de estado
    };

    card.querySelector('.btn-delete').onclick = () => {
        card.remove();
        saveTasks();
    };

    notesContainer.appendChild(card);
    updateCounters();
}

// 4. Función para guardar en LocalStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.note-card').forEach(card => {
        tasks.push({
            title: card.querySelector('h3').innerText,
            text: card.querySelector('p').innerText,
            date: card.querySelector('small').innerText,
            status: card.classList.contains('status-done') ? 'done' : 'todo'
        });
    });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    updateCounters();
}

// 5. Evento para añadir nueva tarea
addBtn.onclick = () => {
    const title = titleInput.value.trim();
    const text = noteInput.value.trim();
    
    if (!title || !text) {
        alert("Por favor, llena el título y la descripción.");
        return;
    }

    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    const newTask = { title, text, date: dateStr, status: 'todo' };
    renderTask(newTask);
    saveTasks();
    
    // Limpiar campos
    titleInput.value = "";
    noteInput.value = "";
    updateCounters();
};

// 6. Lógica del Buscador
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.note-card').forEach(card => {
        const content = card.innerText.toLowerCase();
        card.style.display = content.includes(query) ? "flex" : "none";
    });
});

// 7. Lógica del Modo Oscuro
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function updateCounters() {
    const allTasks = document.querySelectorAll('.note-card');
    const doneTasks = document.querySelectorAll('.note-card.status-done');
    
    const pending = allTasks.length - doneTasks.length;
    const done = doneTasks.length;

    document.getElementById('pendingCount').innerText = pending;
    document.getElementById('doneCount').innerText = done;
}