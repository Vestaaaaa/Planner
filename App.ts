import { createHomePage } from "./pages/HomePage";
import { createDailyPlanner } from "./pages/DailyPlanner";
import { createDoNotForget } from "./pages/DoNotForget";
import { createMoneyPage } from "./pages/MoneyPage";
import { createEntrancePage } from "./pages/EntrancePage";
import { createNotePage } from "./pages/NotePage";

type PageFunction = () => HTMLElement;

let currentPassword: string | null = localStorage.getItem("app_password");

function savePassword(password: string) {
  currentPassword = password;
  localStorage.setItem("app_password", password);
}

function createNav(): HTMLElement {
  const nav = document.createElement("nav");
  const pages = [
    { path: "/", label: "./assets/btn-home.png", class: "home-img" },
    {
      path: "/daily-planner",
      label: "./assets/smal-paw.png",
      class: "paw-img",
    },
    {
      path: "/do-not-forget",
      label: "./assets/btn-donotforget.png",
      class: "dnf-img",
    },
    {
      path: "/money",
      label: "/assets/btn-moneyPig.png",
      class: "moneyPig-img",
    },
  ];

  pages.forEach(({ path, label, class: className }) => {
    const a = document.createElement("a");
    a.href = path;
    if (window.location.pathname === path) a.classList.add("active");
    if (typeof label === "string" && /\.(png|jpe?g|gif|svg)$/i.test(label)) {
      const img = document.createElement("img");
      img.src = label;
      img.classList.add(className);
      a.appendChild(img);
    }

    a.onclick = (e) => {
      e.preventDefault();
      if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
        render();
      }
    };
    nav.appendChild(a);
  });

  const logoutBtn = document.createElement("button");
  logoutBtn.classList = "btn-logOut";
  logoutBtn.innerText = "Log Out";
  logoutBtn.style.marginTop = "20px";
  logoutBtn.style.padding = "8px 12px";
  logoutBtn.style.backgroundColor = "#e37ab6ff";
  logoutBtn.style.color = "color";
  logoutBtn.style.border = "none";
  logoutBtn.style.borderRadius = "20px";
  logoutBtn.style.cursor = "pointer";

  logoutBtn.onclick = () => {
    currentPassword = null;
    localStorage.removeItem("app_password");
    window.history.pushState({}, "", "/");
    render();
  };

  nav.appendChild(logoutBtn);

  return nav;
}

function render() {
  const root = document.getElementById("app-content");
  if (!root) return;
  root.innerHTML = "";

  if (!currentPassword) {
    const entrancePage = createEntrancePage((password) => {
      savePassword(password);
      window.history.pushState({}, "", "/");
      render();
    });
    root.appendChild(entrancePage);
    return;
  }

  root.appendChild(createNav());

  let pageContent: HTMLElement;
  if (window.location.pathname.startsWith("/note/")) {
    const noteId = window.location.pathname.replace("/note/", "");
    pageContent = createNotePage(noteId);
  } else {
    switch (window.location.pathname) {
      case "/":
        pageContent = createHomePage();
        break;
      case "/daily-planner":
        pageContent = createDailyPlanner(currentPassword);
        break;
      case "/do-not-forget":
        pageContent = createDoNotForget();
        break;
      case "/money":
        pageContent = createMoneyPage();
        break;
      default:
        pageContent = document.createElement("div");
        pageContent.innerText = "404 Not Found";
    }
  }
  root.appendChild(pageContent);
}
window.addEventListener("popstate", render);
render();
