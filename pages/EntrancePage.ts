import "../styles/EntrancePage.css";

export function createEntrancePage(
  onSuccess: (password: string) => void
): HTMLElement {
  const container = document.createElement("div");
  container.classList = "ep-container";

  const title = document.createElement("h2");
  title.textContent = "Entrance";

  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Enter a password...";

  const button = document.createElement("button");
  button.innerText = "Log in";
  button.onmouseenter = () => (button.style.backgroundColor = "#9a3e77");
  button.onmouseleave = () => (button.style.backgroundColor = "#b64d90");

  const message = document.createElement("div");

  button.onclick = () => {
    const val = input.value.trim();
    if (val === "130706" || val === "010505") {
      message.innerText = "";
      onSuccess(val);
    } else {
      message.innerText = "Неверный пароль. Попробуйте ещё раз.";
    }
  };

  container.append(title, input, button, message);

  return container;
}
