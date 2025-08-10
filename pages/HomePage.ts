import "../styles/HomePage.css";
import { createNotesWidget } from "../components/Note";
import { Note } from "../components/Note";

export function createHomePage(): HTMLElement {
  const div = document.createElement("div");
  div.classList.add("hp-container");

  const title = document.createElement("h1");
  title.classList = "title-notes";
  title.textContent = "Love you";

  const links = [
    {
      text: "Daily Planner",
      icon: "../assets/paw.png",
      path: "/daily-planner",
    },
    {
      text: "Do not forget",
      icon: "../assets/paper-clip.png",
      path: "/do-not-forget",
    },
    { text: "Money", icon: "../assets/money-pig.png", path: "/money" },
  ];

  div.appendChild(title);

  const container = document.createElement("div");
  container.classList.add("buttons-container");

  links.forEach((l) => {
    const btn = document.createElement("div");
    btn.classList.add("main-buttons");
    const textBtn = document.createElement("h2");
    textBtn.textContent = l.text;
    textBtn.classList = "hp-btn-text";

    const img = document.createElement("img");
    img.src = l.icon;
    btn.appendChild(img);
    btn.appendChild(textBtn);

    btn.onclick = () => {
      window.history.pushState({}, "", l.path);
      const event = new PopStateEvent("popstate");
      dispatchEvent(event);
    };
    container.appendChild(btn);
    div.appendChild(container);
  });

  const notesWidget = createNotesWidget((note: Note) => {
    window.history.pushState({}, "", `/note/${note.id}`);
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  });

  div.appendChild(notesWidget);

  return div;
}
