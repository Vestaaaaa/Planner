import "../styles/DoNotForget.css";

export function createDoNotForget(): HTMLElement {
  const div = document.createElement("div");
  div.classList.add("dnf-container");

  const note = document.createElement("textarea");
  note.classList = "dnf-textarea";

  const STORAGE_KEY = "do-not-forget-note";
  const SIZE_KEY = "do-not-forget-note-size";

  const savedNote = localStorage.getItem(STORAGE_KEY);
  note.value = savedNote != null && savedNote.length > 0 ? savedNote : "";
  note.placeholder = "Write what you want to not forget :)";

  const savedSize = localStorage.getItem(SIZE_KEY);
  if (savedSize) {
    try {
      const size = JSON.parse(savedSize);
      if (size.width && size.height) {
        note.style.width = size.width;
        note.style.height = size.height;
      }
    } catch (e) {}
  }

  note.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEY, note.value);
  });

  note.addEventListener("mouseup", () => {
    const width = note.style.width || note.offsetWidth + "px";
    const height = note.style.height || note.offsetHeight + "px";
    localStorage.setItem(SIZE_KEY, JSON.stringify({ width, height }));
  });

  note.addEventListener("mouseleave", () => {
    const width = note.style.width || note.offsetWidth + "px";
    const height = note.style.height || note.offsetHeight + "px";
    localStorage.setItem(SIZE_KEY, JSON.stringify({ width, height }));
  });

  div.appendChild(note);
  return div;
}
