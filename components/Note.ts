import "../styles/Note.css";

export type Note = {
  id: string;
  title: string;
  content: string;
};

export function getNotes(): Note[] {
  const raw = localStorage.getItem("notes");
  return raw ? JSON.parse(raw) : [];
}

export function setNotes(notes: Note[]) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function createNotesWidget(
  onNoteClick: (note: Note) => void
): HTMLElement {
  const notesDiv = document.createElement("div");
  notesDiv.classList.add("notes-widget");

  const header = document.createElement("div");
  header.classList.add("notes-header");
  header.innerHTML = `
    <img class = "pen-img" src = "../assets/pen.png">
    <span>Notes</span>
    <a class="notes-add-btn"><img class = "plus-img" src ="../assets/plus.png"></a>
  `;
  notesDiv.appendChild(header);

  const listDiv = document.createElement("div");
  listDiv.classList.add("notes-list");

  function renderList() {
    listDiv.innerHTML = "";
    const notes = getNotes();
    notes.forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-item";
      item.textContent = note.title;
      item.onclick = () => onNoteClick(note);
      listDiv.appendChild(item);
    });
  }
  renderList();

  header.querySelector(".notes-add-btn")?.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.classList.add("notes-overlay");

    const modal = document.createElement("div");
    modal.className = "notes-modal";
    modal.innerHTML = `
      <h3>New Note</h3>
      <input type="text" class="notes-title-input" placeholder="Enter the title..." />
      <div class="notes-modal-actions">
        <button class="notes-modal-ok">OK</button>
        <button class="notes-modal-cancel">Cancel</button>
      </div>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = modal.querySelector(".notes-title-input") as HTMLInputElement;
    input.focus();

    modal.querySelector(".notes-modal-ok")?.addEventListener("click", () => {
      const title = input.value.trim();
      if (title.length) {
        const notes = getNotes();
        notes.unshift({ id: Date.now().toString(), title, content: "" });
        setNotes(notes);
        renderList();
        document.body.removeChild(overlay);
      }
    });

    modal
      .querySelector(".notes-modal-cancel")
      ?.addEventListener("click", () => {
        document.body.removeChild(overlay);
      });
  });

  notesDiv.appendChild(listDiv);
  return notesDiv;
}
