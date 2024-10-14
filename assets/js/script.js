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

  addButtonEl.addEventListener("click", () => createTaskEl(newTaskEl));

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
      };
      case "delete": {
        tableDataEls.removeChild(event.target.parentElement.parentElement);
        updateTasks();
        break
      };
    };
  });

  function taskExists(task) {
    // console.log(allTasks);
    // create an array with only the lower case task titles
    const allTitles = allTasks.map(t => t.title.toLowerCase());

    // trim whitespaces on the left and right, also convert to lowercase for comparison only then returns true or false if the element is included
    return allTitles.includes(task.value.trim().toLowerCase());
  };

  function createTaskEl(newTaskEl) {
    // create a "clean title from the user input"
    
    const new_title = newTaskEl.value.trim();

    if (!taskExists(newTaskEl) && new_title) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${"Incomplete"}</td>
                        <td>${new_title}</td>
                        <td>${"2024-09-23"}</td>
                        <td>
                          <button class="edit-btn">Edit</button>
                          <button class="complete-btn">Complete</button>
                          <button class="delete-btn">Delete</button>
                        </td>`;
      tableDataEls.appendChild(row);
      updateTasks();
    };
  };

  function updateTasks() {
    allTasks.length = 0;
    for (let rowEl of tableDataEls.children) {
      const new_task = {
        status: rowEl.children[0].textContent,
        title: rowEl.children[1].textContent,
        date: rowEl.children[2].textContent
      };
      allTasks.push(new_task);
    };
  };

  function loadTasks(tasks = allTasks) {
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

  loadTasks();
});
