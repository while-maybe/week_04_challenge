"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const searchTermEl = document.getElementById("searchTerm");
  const searchBtnEl = document.getElementById("searchButton");
  // const newTaskEl = document.getElementById("newTask");
  const addButtonEl = document.getElementById("addButton");
  const tableDataEls = document.getElementById("table-data");

  // const delRowEls = document.getElementsByClassName("delete-btn");
  const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];

  // addButtonEl.addEventListener("click", () => createTaskEl(newTaskEl));
  addButtonEl.addEventListener("click", (event) => {
    // remove the hidden class from the modal dialog and overlay, making them visible
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // change the modal text value
    document.getElementsByClassName("modal-title")[0].textContent = "New task";
    // change the modal description text
    document.getElementsByClassName("modal-description")[0].textContent = "Create a new task, type away...";

    // create an editField corresponding to the input field with name 'edit-field' and populate the edit field with the value we want to edit
    const editField = document.getElementsByName("edit-field")[0];
    const dateValue = document.getElementsByName("edit-date")[0];
    // extract the only the first 10 chars for the year, month and day from the standardized JS date
    dateValue.value = new Date().toISOString().slice(0, 10);

    // create a loginForm const which takes the value of the form submit
    const newTaskForm = document.getElementById("edit-form");

    // prepare for form submission
    newTaskForm.addEventListener("submit", () => {

      const taskTitle = editField.value.trim();
      
      if (taskTitle && !taskExists(taskTitle)) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${"Incomplete"}</td>
                          <td>${taskTitle}</td>
                          <td>${dateValue.value}</td>
                          <td>
                            <button class="edit-btn">Edit</button>
                            <button class="complete-btn">Complete</button>
                            <button class="delete-btn">Delete</button>
                          </td>`;
  
        tableDataEls.appendChild(row);
        updateTasks();
      }
    });
  });

  // user clicks a button inside the table, let's find out which one
  tableDataEls.addEventListener("click", (event) => {
    // look at the lower case button text to decide which action to take
    switch (event.target.textContent.toLowerCase()) {
      case "complete": {

        event.target.parentElement.parentElement.firstElementChild.textContent = "Completed";

        event.target.parentElement.innerHTML = `
          <td><button class="restore-btn">Restore</button>
          <button class="delete-btn">Delete</button></td>`;
        updateTasks();
        break
      };
      case "edit": {
        // remove the hidden class from the modal dialog and overlay, making them visible
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // change the modal text value
        document.getElementsByClassName("modal-title")[0].textContent = "Edit task";
        // change the modal description text
        document.getElementsByClassName("modal-description")[0].textContent = "Go ahead, change what you need, type away :)";

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
                        <td><button class="btn edit-btn">Edit</button>
                        <button class="btn complete-btn">Complete</button>
                        <button class="btn delete-btn">Delete</button></td>`;
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

  function taskExists(taskTitle) {
    // create an array with only the lower case task titles
    const allTitles = allTasks.map(t => t.title.toLowerCase());
    // convert to lowercase for comparison only then returns true or false if the element is included
    console.log(taskTitle);
    return allTitles.includes(taskTitle.toLowerCase());
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
    updateCounters();
  };

  function updateCounters() {
    const totalTaskCount = tableDataEls.children.length;

    let openTaskCount = 0;
    for (let i = 0; i < totalTaskCount; i++) {
      openTaskCount += [tableDataEls.children[i].children[0].textContent.toLowerCase()] == 'incomplete' ? 1 : 0;
    }

    console.log(openTaskCount);
    document.getElementsByClassName("open-tasks")[0].textContent = `OpenTasks - ${openTaskCount}`;
    document.getElementsByClassName("completed-tasks")[0].textContent = `Completed - ${totalTaskCount - openTaskCount}`;
  }

  function loadTasks(tasks = allTasks) {

    for (let t of tasks) {

      // restore the type of buttons to display between page reloads depending on if the status of the task is "incomplete" or not.
      const rowButtons = t.status.toLowerCase() === "incomplete"
      ?
        `<button class="edit-btn modal-open-btn">Edit</button>
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>` 
      :
        `<button class="restore-btn">Restore</button>
        <button class="delete-btn">Delete</button>`;

      // creates a new row and populates the tds
      const row = document.createElement("tr");
      row.innerHTML = `<td>${t.status}</td>
                        <td>${t.title}</td>
                        <td>${t.date}</td>
                        <td>${rowButtons}</td>`
      tableDataEls.appendChild(row);
    };
    updateCounters();
  };

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
