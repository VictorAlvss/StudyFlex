const URL_NOTAS = "http://localhost:3000/notas";
const colorClasses = ["note-red", "note-yellow", "note-blue"];

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("btn").addEventListener("click", addNote);
  await fetchNotes();
});

async function addNote() {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const note = {
    title: "Título da Nota",
    content: "Conteúdo da nota",
    date: date,
    colorClass: colorClasses[getRandomInt(colorClasses.length)], // Pega uma cor aleatória da lista
  };

  fetch(URL_NOTAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .then((newNote) => {
      displayNote(newNote);
      updateButtonPosition();
    })
    .catch((error) => {
      console.error("Erro ao adicionar a nota:", error);
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function displayNote(note) {
  const notesContainer = document.getElementById("notesContainer");

  const noteDiv = document.createElement("div");
  noteDiv.className = `note ${note.colorClass}`;
  noteDiv.dataset.id = note.id;
  noteDiv.innerHTML = `
        <h2 class="tit" contenteditable="false">${note.title}</h2>
        <p class="subtit" contenteditable="false">${note.content}</p>
        <span class="date">${note.date}</span>
        <span class="edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </span>
        <span class="save" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
        </span>
        <span class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="36" height="16" viewBox="0 0 256 256" xml:space="preserve">
                <defs></defs>
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 8 90 c -2.047 0 -4.095 -0.781 -5.657 -2.343 c -3.125 -3.125 -3.125 -8.189 0 -11.314 l 74 -74 c 3.125 -3.124 8.189 -3.124 11.314 0 c 3.124 3.124 3.124 8.189 0 11.313 l -74 74 C 12.095 89.219 10.047 90 8 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round" />
                    <path d="M 82 90 c -2.048 0 -4.095 -0.781 -5.657 -2.343 l -74 -74 c -3.125 -3.124 -3.125 -8.189 0 -11.313 c 3.124 -3.124 8.189 -3.124 11.313 0 l 74 74 c 3.124 3.125 3.124 8.189 0 11.314 C 86.095 89.219 84.048 90 82 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round" />
                </g>
            </svg>
        </span>
    `;

  notesContainer.appendChild(noteDiv);

  noteDiv
    .querySelector(".edit")
    .addEventListener("click", async () => editNote(noteDiv, note.id));
  noteDiv
    .querySelector(".save")
    .addEventListener("click", async () => saveNote(noteDiv, note.id));
  noteDiv
    .querySelector(".delete")
    .addEventListener("click", async () => deleteNote(note.id));
}

async function fetchNotes() {
  fetch(URL_NOTAS)
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNote(note));
      updateButtonPosition();
    })
    .catch((error) => {
      console.error("Erro ao buscar notas:", error);
    });
}

function updateButtonPosition() {
  const notesContainer = document.getElementById("notesContainer");
  const notes = notesContainer.querySelectorAll(".note");
  const addButton = document.getElementById("btn");

  if (notes.length === 0) {
    addButton.style.top = "0";
    addButton.style.left = "0";
  } else {
    const lastNote = notes[notes.length - 1];
    const rect = lastNote.getBoundingClientRect();
    const containerRect = notesContainer.getBoundingClientRect();

    if (rect.right + lastNote.offsetWidth > containerRect.right) {
      addButton.style.top = rect.bottom - containerRect.top + 20 + "px";
      addButton.style.left = "0";
    } else {
      addButton.style.top = rect.top - containerRect.top + "px";
      addButton.style.left = rect.right - containerRect.left + 20 + "px";
    }
  }
}

function editNote(noteDiv, noteId) {
  const titleElement = noteDiv.querySelector("h2");
  const contentElement = noteDiv.querySelector("p");
  const editButton = noteDiv.querySelector(".edit");
  const saveButton = noteDiv.querySelector(".save");

  const colorClass = noteDiv.className
    .split(" ")
    .find((cls) => cls.startsWith("note-"));
  noteDiv.dataset.colorClass = colorClass;

  titleElement.contentEditable = "true";
  titleElement.focus();
  document.execCommand("selectAll", false, null);

  contentElement.contentEditable = "true";

  editButton.style.display = "none";
  saveButton.style.display = "inline-block";
}

async function saveNote(noteDiv, noteId) {
  const titleElement = noteDiv.querySelector("h2");
  const contentElement = noteDiv.querySelector("p");
  const editButton = noteDiv.querySelector(".edit");
  const saveButton = noteDiv.querySelector(".save");

  const updatedNote = {
    title: titleElement.textContent,
    content: contentElement.textContent,
    colorClass: noteDiv.dataset.colorClass, // Recupera a classe de cor preservada
    date: noteDiv.querySelector(".date").textContent, // Recupera a data da nota
  };

  fetch(`${URL_NOTAS}/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedNote),
  })
    .then((response) => response.json())
    .then((data) => {
      titleElement.contentEditable = "false";
      contentElement.contentEditable = "false";

      editButton.style.display = "inline-block";
      saveButton.style.display = "none";
    })
    .catch((error) => {
      console.error("Erro ao salvar a nota:", error);
    });
}

function deleteNote(noteId) {
  fetch(`${URL_NOTAS}/${noteId}`, {
    method: "DELETE",
  })
    .then(() => {
      const noteDiv = document.querySelector(`.note[data-id="${noteId}"]`);
      if (noteDiv) {
        noteDiv.remove();
      }
      updateButtonPosition();
    })
    .catch((error) => {
      console.error("Erro ao deletar a nota:", error);
    });
}
