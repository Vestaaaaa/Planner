import "../styles/DailyPlanner.css";

type Task = {
  text: string;
  checked: boolean;
};

type Note = {
  text: string;
  done: boolean;
};

type PlannerData = {
  notes: { [dateString: string]: Note[] };
  selectedDate: string;
  tasks: { [dateString: string]: Task[] };
};

const STORAGE_KEY_PREFIX = "dailyPlannerData_";

function loadPlannerData(password: string): PlannerData {
  const dataString = localStorage.getItem(STORAGE_KEY_PREFIX + password);
  if (dataString) {
    try {
      const data = JSON.parse(dataString);

      if (Array.isArray(data.notes)) {
        const todayKey = new Date().toISOString().slice(0, 10);
        return {
          ...data,
          notes: {
            [todayKey]: data.notes,
          },
        };
      }

      if (typeof data.notes !== "object" || data.notes === null) {
        data.notes = {};
      }

      return data;
    } catch (e) {
      console.error(
        "Ошибка при загрузке данных DailyPlanner из localStorage:",
        e
      );
    }
  }
  return { notes: {}, selectedDate: new Date().toISOString(), tasks: {} };
}

function savePlannerData(password: string, data: PlannerData) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + password, JSON.stringify(data));
  } catch (e) {
    console.error(
      "Ошибка при сохранении данных DailyPlanner в localStorage:",
      e
    );
  }
}

function getWeekDates(date: Date): Date[] {
  const week: Date[] = [];
  const current = new Date(date);
  const day = current.getDay();
  const monday = new Date(current);
  const diffToMonday = (day + 6) % 7;
  monday.setDate(current.getDate() - diffToMonday);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

export function createDailyPlanner(password: string): HTMLElement {
  const saved = loadPlannerData(password);
  let currentDate = new Date(saved.selectedDate);

  let importantNotes: { [dateString: string]: Note[] } = saved.notes || {};
  let tasksByDate: { [dateString: string]: Task[] } = saved.tasks || {};

  const root = document.createElement("div");
  root.classList.add("daily-planner");

  const leftCol = document.createElement("div");
  leftCol.className = "dp-left-col";

  const rightCol = document.createElement("div");
  rightCol.className = "dp-main";

  // --- Важные заметки ---
  const bottomRow = document.createElement("div");
  bottomRow.className = "dp-bottom-row";

  const btnAdd = document.createElement("button");
  btnAdd.className = "dp-btn-add";
  btnAdd.innerText = "+";
  btnAdd.title = "Add a priority note";

  function currentDateKey(): string {
    return currentDate.toISOString().slice(0, 10);
  }

  btnAdd.onclick = () => {
    const txt = prompt("Введите важную заметку для этого дня");
    if (txt && txt.trim()) {
      const key = currentDateKey();
      if (!importantNotes[key]) {
        importantNotes[key] = [];
      }
      importantNotes[key].push({ text: txt.trim(), done: false });
      saveAndRender();
    }
  };
  bottomRow.appendChild(btnAdd);

  function renderImportantNotes() {
    bottomRow.innerHTML = "";
    bottomRow.appendChild(btnAdd);

    const notesForDay = importantNotes[currentDateKey()] || [];

    notesForDay.forEach((note, index) => {
      const b = document.createElement("span");
      b.className = "dp-priority-note";
      b.innerText = note.text;

      if (note.done) {
        b.style.textDecoration = "line-through";
        b.style.opacity = "0.6";
      } else {
        b.style.textDecoration = "none";
        b.style.opacity = "1";
      }

      b.style.cursor = "pointer";
      b.style.userSelect = "none";
      b.style.marginRight = "8px";

      b.onclick = () => {
        note.done = !note.done;
        saveAndRender();
      };

      b.oncontextmenu = (event) => {
        event.preventDefault();
        if (confirm("Удалить эту важную заметку?")) {
          notesForDay.splice(index, 1);
          saveAndRender();
        }
      };

      bottomRow.appendChild(b);
    });
  }

  function saveAndRender() {
    savePlannerData(password, {
      notes: importantNotes,
      selectedDate: currentDate.toISOString(),
      tasks: tasksByDate,
    });

    rerender();
    renderImportantNotes();
  }

  function rerender() {
    root.innerHTML = "";

    // LEFT Column
    leftCol.innerHTML = "";

    const btnWeekBack = document.createElement("a");
    btnWeekBack.className = "btn-previous-week";
    btnWeekBack.title = "Previous week";

    const imgBtnPrev = document.createElement("img");
    imgBtnPrev.src = "../assets/btn-previous-week.png";
    btnWeekBack.appendChild(imgBtnPrev);

    btnWeekBack.onclick = () => {
      currentDate.setDate(currentDate.getDate() - 7);
      saveAndRender();
    };

    leftCol.appendChild(btnWeekBack);

    const weekDates = getWeekDates(currentDate);
    const dayWeekContainer = document.createElement("div");
    dayWeekContainer.className = "dayWeekContainer";
    leftCol.appendChild(dayWeekContainer);

    weekDates.forEach((d) => {
      const dayBox = document.createElement("div");
      dayBox.className = "dp-day";
      if (
        d.getDate() === currentDate.getDate() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      ) {
        dayBox.classList.add("active");
      }

      const numBox = document.createElement("span");
      numBox.className = "dp-day-num";
      const number = document.createElement("h2");
      number.classList = "day-number";
      number.textContent = d.getDate().toString().padStart(2, "0");
      numBox.appendChild(number);

      const weekBox = document.createElement("span");
      weekBox.className = "dp-day-week";
      const weekName = document.createElement("h2");
      weekName.classList = "week-name";
      const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      weekName.textContent = daysShort[(d.getDay() + 6) % 7];
      weekBox.appendChild(weekName);

      dayBox.append(numBox, weekBox);

      dayBox.onclick = () => {
        currentDate = new Date(d);
        saveAndRender();
      };

      dayWeekContainer.appendChild(dayBox);
    });

    const btnWeekNext = document.createElement("a");
    btnWeekNext.className = "btn-next-week";
    btnWeekNext.title = "Next week";

    const imgBtnNext = document.createElement("img");
    imgBtnNext.src = "../assets/btn-next-week.png";
    btnWeekNext.appendChild(imgBtnNext);

    btnWeekNext.onclick = () => {
      currentDate.setDate(currentDate.getDate() + 7);
      saveAndRender();
    };

    leftCol.appendChild(btnWeekNext);

    // RIGHT Column
    rightCol.innerHTML = "";

    const titleRow = document.createElement("div");
    titleRow.className = "dp-title-row";

    const calBtn = document.createElement("a");
    calBtn.classList = "btn-calendar";
    const calImg = document.createElement("img");
    calImg.src = "/assets/btn-calendar.png";
    calBtn.appendChild(calImg);

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.style.display = "none";

    const yyyy = currentDate.getFullYear();
    const mm = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const dd = currentDate.getDate().toString().padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;

    calBtn.onclick = () => dateInput.click();

    dateInput.onchange = (e) => {
      const val = (e.target as HTMLInputElement).value;
      const [yyyy, mm, dd] = val.split("-");
      currentDate = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
      saveAndRender();
    };

    calBtn.appendChild(dateInput);
    titleRow.appendChild(calBtn);

    const dateLabel = document.createElement("div");
    dateLabel.className = "dp-date-label";
    dateLabel.innerHTML = `
      <span class="day-number-label">${currentDate.getDate()}</span> 
      <span class="month-name-label">${
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][currentDate.getMonth()]
      }</span> 
      <span class="year-number-label">${currentDate.getFullYear()}</span>
    `;
    titleRow.appendChild(dateLabel);

    rightCol.appendChild(titleRow);

    // ToDo list
    const todoList = document.createElement("div");
    todoList.className = "dp-todo-list";

    const dateKey = currentDate.toISOString().slice(0, 10);

    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = new Array(10).fill(null).map(() => ({
        text: "",
        checked: false,
      }));
    }

    const tasks = tasksByDate[dateKey];

    for (let i = 0; i < 10; i++) {
      const task = tasks[i] || { text: "", checked: false };

      const row = document.createElement("div");
      row.className = "dp-todo-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkbox");
      checkbox.checked = task.checked;
      checkbox.onchange = () => {
        tasks[i].checked = checkbox.checked;
        saveAndRender();
      };

      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.oninput = () => {
        tasks[i].text = input.value;
      };

      row.appendChild(checkbox);
      row.appendChild(input);
      todoList.appendChild(row);
    }

    rightCol.appendChild(todoList);
    rightCol.appendChild(bottomRow);

    root.appendChild(leftCol);
    root.appendChild(rightCol);
  }

  rerender();
  renderImportantNotes();

  return root;
}
