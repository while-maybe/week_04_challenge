"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const searchTermEl = document.getElementById("searchTerm");
  const searchBtnEl = document.getElementById("searchButton");
  const newTaskEl = document.getElementById("newTask");
  const addButtonEl = document.getElementById("addButton");
  const tableDataEls = document.getElementById("table-data");

  const delRowEls = document.getElementsByClassName("delete-btn");
  const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];

  addButtonEl.addEventListener("click", () => createTaskEl(newTaskEl));

  // user clicks a button inside the table, let's find out which one
  tableDataEls.addEventListener("click", (event) => {
    // look at the lower case button text to decide which action to take
    switch (event.target.textContent.toLowerCase()) {
      case "complete": {

        event.target.parentElement.parentElement.firstElementChild.textContent = "Completed";

        event.target.parentElement.innerHTML = `
                        <button class="restore-btn">Restore</button>
                        <button class="delete-btn">Delete</button></td>`;
        console.log("complete");
        updateTasks();
        break
      };
      case "edit": {
        // remove the hidden class from the modal dialog and overlay, making them visible
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // create an editField corresponding to the input field with name 'edit-field' and populate the edit field with the value we want to edit
        const editField = document.getElementsByName("edit-field")[0];
        editField.value = event.target.parentElement.parentElement.children[1].textContent;

        const dateValue = document.getElementsByName("edit-date")[0];
        dateValue.value = event.target.parentElement.parentElement.children[2].textContent;
        
        // create a loginForm const which takes the value of the form submit
        const loginForm = document.getElementById("edit-form");
        // prepare for form submission
        loginForm.addEventListener("submit", () => {
          // update the corresponding task table cell
          event.target.parentElement.parentElement.children[1].textContent = editField.value;
          // update the date if modified by the user
          event.target.parentElement.parentElement.children[2].textContent = dateValue.value;

          // update the Tasks array
          updateTasks();
        });

        break
      };
      case "restore": {
        // change the text in in the status column cell
        event.target.parentElement.parentElement.firstElementChild.textContent = "Incomplete";
        // makes all 3 buttons available again
        event.target.parentElement.innerHTML = `
                        <td><button class="edit-btn">Edit</button>
                        <button class="complete-btn">Complete</button>
                        <button class="delete-btn">Delete</button></td>`;
        // calls update tasks
        updateTasks();
        break
      };
      case "delete": {
        // removes the entire row element
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
      // new_date
      const date = new Date().toISOString().slice(0, 10);

      const row = document.createElement("tr");
      row.innerHTML = `<td>${"Incomplete"}</td>
                        <td>${new_title}</td>
                        <td>${date}</td>
                        <td>
                          <button class="edit-btn">Edit</button>
                          <button class="complete-btn">Complete</button>
                          <button class="delete-btn">Delete</button>
                        </td>`;
      tableDataEls.appendChild(row);
      updateTasks();
    };
    newTaskEl.value = "";
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
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  };

  function loadTasks(tasks = allTasks) {

    for (let t of tasks) {

      // restore the type of buttons to display between page reloads depending on if the status of the task is "incomplete" or not.
      const rowButtons = t.status.toLowerCase() === "incomplete"
      ?
        `<button class="btn edit-btn modal-open-btn">Edit</button>
        <button class="btn complete-btn">Complete</button>
        <button class="btn delete-btn">Delete</button>` 
      :
        `<button class="btn restore-btn">Restore</button>
        <button class="btn delete-btn">Delete</button>`;

      // creates a new row and populates the tds
      const row = document.createElement("tr");
      row.innerHTML = `<td>${t.status}</td>
                        <td>${t.title}</td>
                        <td>${t.date}</td>
                        <td>${rowButtons}</td>`
      tableDataEls.appendChild(row);
    };
  };

  // it's necessary to only define here otherwise complains about non-existing items

  // the below are needed for modal implementation
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const closeModalBtn = document.querySelector(".modal-close-btn");

  // close modal on close btn click or overlay click
  closeModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  // also close modal if pressing the esc key (and the modal is not hidden)
  document.addEventListener("keydown", function (e) {
    // check if the event is the Escape key and the modal does not contain the hidden class
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      // TODO investigate
      closeModal();
    }
  });
  
  function closeModal () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  // calls loadTasks to add them to the page table
  loadTasks();
});
