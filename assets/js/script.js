"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const searchTermEl = document.getElementById("searchTerm");
  const searchBtnEl = document.getElementById("searchButton");
  const newTaskEl = document.getElementById("newTask");
  const addButtonEl = document.getElementById("addButton");
  const tableDataEls = document.getElementById("table-data");

  const delRowEls = document.getElementsByClassName("delete-btn");

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
  
  addButtonEl.addEventListener("click", () => createTask(newTaskEl));

  // user clicks a button inside the table, let's find out which one
  tableDataEls.addEventListener("click", (event) => {
    switch (event.target.textContent.toLowerCase()) {
      case "complete": {
        console.log("complete");
        break
      };
      case "edit": {
        console.log("edit");
        break
      }
      case "delete": {
        // console.log(event.target.parentElement.parentElement);
        delTask(event.target.parentElement.parentElement);
        break
      }
    }
  });

  function delTask(task, tasks = allTasks) {
    // use the findTask function to get the index of the title in the allTasks array, then remove one element starting at the previously found index position.
    tasks.splice(findTask(task.children[1]), 1);
    showTasks();
  }

  function findTask(task, tasks = allTasks) {
    // create an array with only the tasks titles to prepare for indexOf()
    const allTitles = tasks.map(task => task.title);
    // trim whitespaces on the left and right, also convert to lowercase for comparison only then returns the index of the search  (or -1 if None)
    console.log("here", task.value)
    return allTitles.indexOf(task.value.trim().toLowerCase());
  };

  function createTask(task, tasks = allTasks) {
    const new_title = task.value.trim();

    if (findTask(newTaskEl) < 0 && new_title) {
      const new_task = {
        status: "Incomplete",
        title: new_title,
        date: "2024-09-23",
      };
      tasks.push(new_task);
      showTasks();
    }
  };

  function showTasks(tasks = allTasks) {
    tableDataEls.textContent = "";
    // newTaskEl.textContent = "";
    let t = {};
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
