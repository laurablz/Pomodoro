// ======== Navegación entre pantallas ========
function mostrarPantalla(id) {
  const pantallas = document.querySelectorAll(".pantalla");
  pantallas.forEach(p => p.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
}

// ======== Temporizador ========
let durationMs = 25 * 60 * 1000;
let startTime = null;
let paused = false;
let pauseStart = null;
let pauseAccum = 0;
let tickId = null;

// ======== Tareas ========
let tareas = [];

function formatMs(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function remainingMs() {
  if (!startTime) return durationMs;
  const pausedTime = paused && pauseStart ? (Date.now() - pauseStart) : 0;
  return durationMs - ((Date.now() - startTime) - pauseAccum - pausedTime);
}

function renderTimer() {
  document.getElementById("display-timer").textContent = formatMs(remainingMs());
}

function startTick() {
  if (tickId) clearInterval(tickId);
  tickId = setInterval(() => {
    renderTimer();
    if (remainingMs() <= 0) {
      clearInterval(tickId);
      renderTimer();
      alert("¡Tiempo finalizado! ⏰");
    }
  }, 250);
}

function startTimer(minutos) {
  durationMs = minutos * 60 * 1000;
  startTime = Date.now();
  paused = false;
  pauseStart = null;
  pauseAccum = 0;
  renderTimer();
  startTick();
}

function pauseResume() {
  if (!startTime) return;
  if (!paused) {
    paused = true;
    pauseStart = Date.now();
    document.getElementById("btnPauseResume").textContent = "Reanudar";
  } else {
    paused = false;
    pauseAccum += Date.now() - pauseStart;
    pauseStart = null;
    document.getElementById("btnPauseResume").textContent = "Pausar";
  }
}

function resetTimer() {
  startTime = Date.now();
  paused = false;
  pauseAccum = 0;
  pauseStart = null;
  document.getElementById("btnPauseResume").textContent = "Pausar";
  renderTimer();
}

// ======== Funciones de tareas ========
function renderTareas() {
  const ul = document.getElementById("listaTareas");
  ul.innerHTML = "";
  tareas.forEach(t => {
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";
    li.innerHTML = `
      <input type="checkbox" data-id="${t.id}" ${t.done ? "checked" : ""}>
      <span>${t.text}</span>
      <button data-remove="${t.id}">✕</button>
    `;
    ul.appendChild(li);
  });
}

function addTarea(text) {
  tareas.push({ id: crypto.randomUUID(), text, done: false });
  renderTareas();
}

function toggleTarea(id) {
  const t = tareas.find(x => x.id === id);
  if (t) { t.done = !t.done; renderTareas(); }
}

function removeTarea(id) {
  tareas = tareas.filter(x => x.id !== id);
  renderTareas();
}

// ======== Eventos ========

// Start desde inicio
document.getElementById("btnStart").addEventListener("click", () => {
  const minutos = parseInt(document.getElementById("tiempo").value);
  startTimer(minutos);
  mostrarPantalla("pantalla-timer");
});

// Navegación
document.getElementById("goTareas").addEventListener("click", () => mostrarPantalla("pantalla-tareas"));
document.getElementById("goTimer").addEventListener("click", () => mostrarPantalla("pantalla-timer"));
document.getElementById("goInicio").addEventListener("click", () => {
  mostrarPantalla("pantalla-inicio");
  resetTimer(); // reinicia temporizador, tareas permanecen
});

// Botones temporizador
document.getElementById("btnPauseResume").addEventListener("click", pauseResume);
document.getElementById("btnReset").addEventListener("click", resetTimer);

// Formulario de tareas
document.getElementById("formTarea").addEventListener("submit", e => {
  e.preventDefault();
  const val = document.getElementById("inputTarea").value.trim();
  if (val) addTarea(val);
  document.getElementById("inputTarea").value = "";
  document.getElementById("inputTarea").focus();
});

// Click en checkbox o eliminar tarea
document.getElementById("listaTareas").addEventListener("click", e => {
  const idToggle = e.target.getAttribute("data-id");
  const idRemove = e.target.getAttribute("data-remove");
  if (idToggle) toggleTarea(idToggle);
  if (idRemove) removeTarea(idRemove);
});

// Botones ventana frameless
document.getElementById("cerrar").addEventListener("click", () => {
  window.api.cerrarVentana();
});

document.getElementById("minimizar").addEventListener("click", () => {
  window.api.minimizarVentana();
});


// Pantalla inicial
mostrarPantalla("pantalla-inicio");
renderTimer();
renderTareas();
