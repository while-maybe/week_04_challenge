window.addEventListener("DOMContentLoaded", () => {
  const searchTermEl = document.getElementById("searchTerm");
  const searchBtnEl = document.getElementById("searchButton");
  const newTaskEl = document.getElementById("newTask");
  const addButtonEl = document.getElementById("addButton");
  const tableDataEls = document.getElementById("table-data");

  const task1 = {
    status: "Incomplete",
    title: "Complete user dashboard",
    date: "2024-09-23",
  };

  const task2 = {
    status: "Incomplete",
    title: "A second task",
    date: "2024-09-01"
  };

  const allTasks = [task1];
  allTasks.push(task2);

  addButtonEl.addEventListener("click", () => createTask(newTaskEl.value));

  function createTask(title, tasks = allTasks) {
    const new_title = title.trim();

    const _isUnique = function (title = new_title, tasks = allTasks) {
      for (t of tasks) {
        if (title === t.title) {
          console.log("Task is not unique. Will NOT add.");
          return false;
        };
      };
      return true;
    };

    if (new_title && _isUnique()) {
      const new_task = {
        status: "Incomplete",
        title: new_title,
        date: "2024-09-23",
      };
      tasks.push(new_task);
      showTasks();
    }
    newTaskEl.textContent = "";
  };
  
  function showTasks(tasks = allTasks) {
    tableDataEls.textContent = "";
    for (t of tasks) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${t.status}</td>
                        <td>${t.title}</td>
                        <td>${t.date}</td>
                        <td><button class="edit-btn">Edit</button>
                        <button class="complete-btn">Complete</button>
                        <button class="delete-btn">Delete</button></td>`;

      tableDataEls.appendChild(row);
    };
  };

  showTasks();
});
