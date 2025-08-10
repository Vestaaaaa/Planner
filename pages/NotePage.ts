import "../styles/NotePage.css";
import { getNotes, setNotes } from "../components/Note";

export function createNotePage(noteId: string): HTMLElement {
  const notes = getNotes();
  const note = notes.find((n) => n.id === noteId);
  const div = document.createElement("div");
  div.className = "note-page";

  if (!note) {
    div.innerHTML = "<h2>Заметка не найдена</h2>";
    return div;
  }

  const title = document.createElement("h2");
  title.textContent = note.title;
  div.appendChild(title);

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Start your note...";
  textarea.value = note.content;

  textarea.oninput = () => {
    note.content = textarea.value;
    setNotes(notes);
  };

  div.appendChild(textarea);

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.onclick = () => {
    window.history.pushState({}, "", "/");
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  };
  div.appendChild(backBtn);

  return div;
}
