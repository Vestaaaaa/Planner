import "../styles/MoneyPage.css";

export function createMoneyPage(): HTMLElement {
  const months = [
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
  ];

  const container = document.createElement("div");
  container.classList.add("container");

  const grid = document.createElement("div");
  grid.classList = "grid-months";

  months.forEach((month) => {
    const cell = document.createElement("div");
    cell.textContent = month;
    cell.classList = "money-month";
    grid.appendChild(cell);
  });
  container.appendChild(grid);
  return container;
}
