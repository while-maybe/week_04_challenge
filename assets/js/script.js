"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const searchTermEl = document.getElementById("searchTerm");
  const searchBtnEl = document.getElementById("searchButton");
  const searchForm = document.getElementsByClassName("search-form")[0];
  const addButtonEl = document.getElementById("addButton");
  const tableDataEls = document.getElementById("table-data");
  const menuItemsEls = document.getElementsByClassName("menu-items")[0];
  const searchResDescription = document.getElementsByClassName("search-res-description")[0];

  // const delRowEls = document.getElementsByClassName("delete-btn");
  const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
  renderPage();
  updateCounters();

  // search function implemented as a form so that user can enter a 'search submission' if clicking or using enter key
  searchBtnEl.addEventListener("click", () => {
    
    searchForm.addEventListener("submit", (event) => {
      event.stopImmediatePropagation();
      const searchTerm = searchTermEl.value.trim().toLowerCase();
      console.log(searchTerm)
      const searchResults = allTasks.filter(task => task["title"].toLowerCase().includes(searchTerm));

      renderPage(searchResults);
      searchTermEl.value = "";

      searchResDescription.innerHTML = `<em>'${searchTerm}'</em> found ${searchResults.length} times`;
      searchResDescription.classList.remove("hidden");
      

      // TODO - implement highligh of search term
    });
  }); // eventListener ends here

  menuItemsEls.addEventListener("click", (event) => {
    switch (event.target.className) {
      case "all-tasks": {
        renderPage();
        break;
      };
      case "open-tasks": {
        // .filter() creates a new array is the condition returns true
        renderPage(allTasks.filter(row => row["status"].toLowerCase() === 'incomplete'));
        break;
      };
      case "completed-tasks": {
        renderPage(allTasks.filter(row => row["status"].toLowerCase() === 'completed'));
        break;
      };
    };
  });

  addButtonEl.addEventListener("click", () => {
    openModal();
    // populates the modal with a title and description
    const modalTitle = document.getElementsByClassName("modal-title")[0];
    modalTitle.textContent = "New task";
    const modalDescription = document.getElementsByClassName("modal-description")[0];
    modalDescription.textContent = "Create a new task, type away...";

    const editField = document.getElementsByName("edit-field")[0];
    const dateValue = document.getElementsByName("edit-date")[0];
    // populates the date field with today's date in the right format
    dateValue.value = new Date().toISOString().slice(0, 10);

    // create a form which takes the value of the submit
    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", () => {

      const taskTitle = editField.value.trim();
      // checks if title is empty and title duplicates
      if (taskTitle && !taskExists(taskTitle)) {
        allTasks.push({
          "status": "Incomplete",
          "title": taskTitle,
          "date": dateValue.value
        });
        finishOps();
      };
    }); // eventListener ends here
  });

  // user clicks a button inside the table, let's find out which one
  tableDataEls.addEventListener("click", (event) => {
    const rowWithClick = getTableRowIndex(event.target.parentElement.parentElement);
    // look at the lower case button text to decide which action to take
    switch (event.target.textContent.toLowerCase()) {
      case "complete": {
        allTasks[rowWithClick]["status"] = "Completed";
        finishOps();
        break
      };

      case "restore": {
        allTasks[rowWithClick]["status"] = "Incomplete";
        finishOps();
        break;
      };

      case "delete": {
        allTasks.splice(getTableRowIndex(rowWithClick), 1);
        finishOps();
        break;
      };

      case "edit": {
        openModal();
        // populates the modal with a title, description, current task title and date
        const modalTitle = document.getElementsByClassName("modal-title")[0];
        modalTitle.textContent = "Edit task";
        const modalDescription = document.getElementsByClassName("modal-description")[0];
        modalDescription.textContent = "Go ahead, change what you need, type away :)";
        const editField = document.getElementsByName("edit-field")[0];
        editField.value = event.target.parentElement.parentElement.children[1].textContent;
        const dateValue = document.getElementsByName("edit-date")[0];
        dateValue.value = event.target.parentElement.parentElement.children[2].textContent;

        // create a form which takes the value of the form submit
        const editForm = document.getElementById("edit-form");
        editForm.addEventListener("submit", () => {

          const taskTitle = editField.value.trim();
          // checks if title is empty and title duplicates
          if (taskTitle && !taskExists(taskTitle)) {
            allTasks[rowWithClick] = {
              "status": "Incomplete",
              "title": taskTitle,
              "date": dateValue.value
            };
            finishOps();
          };
        }); // eventListener ends here
        break
      };
    };
  });

  function finishOps() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    renderPage();
    updateCounters();
  }

  function getTableRowIndex(rowWithClick) {
    return Array.prototype.indexOf.call(tableDataEls.children, rowWithClick);
  }

  function taskExists(taskTitle) {
    // create an array with only the lower case task titles
    const allTitles = allTasks.map(t => t.title.toLowerCase());
    // convert to lowercase for comparison only then returns true or false if the element is included
    return allTitles.includes(taskTitle.toLowerCase());
  };

  function renderPage(taskList = JSON.parse(localStorage.getItem('allTasks')) || []) {

    // clear the search result description if any
    // searchResDescription.classList.add("hidden");
    
    tableDataEls.innerHTML = "";

    taskList.forEach(oneRow => {
      // determine which buttons to include
      const rowButtons = oneRow["status"].toLowerCase() === "incomplete"
        ?
        `<button class="edit-btn modal-open-btn">Edit</button>
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>`
        :
        `<button class="restore-btn">Restore</button>
        <button class="delete-btn">Delete</button>`;

      // creates a new row and populates the tds
      const row = document.createElement("tr");
      row.innerHTML = `<td>${oneRow.status}</td>
                        <td>${oneRow.title}</td>
                        <td>${oneRow.date}</td>
                        <td>${rowButtons}</td>`;

      tableDataEls.appendChild(row);
    });

  };

  function updateCounters() {
    const totalTaskCount = allTasks.length;

    let openTaskCount = 0;
    for (let i = 0; i < totalTaskCount; i++) {
      openTaskCount += [tableDataEls.children[i].children[0].textContent.toLowerCase()] == 'incomplete' ? 1 : 0;
    }

    document.getElementsByClassName("all-tasks")[0].textContent = `All Tasks - ${totalTaskCount}`;
    document.getElementsByClassName("open-tasks")[0].textContent = `Open Tasks - ${openTaskCount}`;
    document.getElementsByClassName("completed-tasks")[0].textContent = `Completed - ${totalTaskCount - openTaskCount}`;
  }

  // the below are needed for modal implementation
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const closeModalBtn = document.querySelector(".modal-close-btn");

  // close modal on X btn click, overlay click or Escape key press
  closeModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  // also close modal if pressing the esc key (and the modal is not hidden)
  document.addEventListener("keydown", function (e) {
    // check if the event is the Escape key and the modal is not hidden
    e.key === "Escape" && !modal.classList.contains("hidden") && closeModal();
    
  });
  
  function closeModal() {
    document.querySelector(".modal").classList.add("hidden");
    document.querySelector(".overlay").classList.add("hidden");
  };
  function openModal() {
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
  };

});
