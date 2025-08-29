// Get modal elements
const modal = document.getElementById("deleteModal");
const confirmBtn = document.getElementById("confirmDelete");
const cancelBtn = document.getElementById("cancelDelete");

// get edit modals elements
const editModal = document.getElementById("edit-modal");

// loading modal
const loadingModal = document.getElementById("loader");

// add form elements
const addForm = document.getElementById("add-form");

// edit form elements
const editForm = document.getElementById("edit-form");
let editFormId = null;

function showLoadingSpinner() {
  loadingModal.style.display = "block";
}

function hideLoadingSpinner() {
  loadingModal.style.display = "none";
}

editForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let todo = document.getElementById("edit-todo").value.trim();
  try {
    const response = await fetch(
      `http://localhost:3001/api/todo/${editFormId}`,
      {
        method: "PUT", // PUT method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: todo }),
      }
    );
    const data = await response.json();

    const wrapper = document.querySelector(`.todo-wrapper[id='${editFormId}']`);

    const heading = wrapper.querySelector("h4");

    if (heading) {
      heading.textContent = data.data.todo;
    }
  } catch (error) {
    alert("error");
    console.log(error);
  } finally {
    editModal.style.display = 'none';
  }
});

addForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let todo = document.getElementById("todo").value.trim();
  try {
    const response = await fetch("http://localhost:3001/api/todo", {
      method: "POST", // POST method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: todo,
      }),
    });

    const data = await response.json();

    console.log("submit add data", data.data);
    renderTodo(data.data);
  } catch (error) {}
  addForm.reset();
});

// Function to show modal
function showModal(todoWrapper) {
  todoToDelete = todoWrapper;
  modal.style.display = "block";
}

// Function to hide modal
function hideModal() {
  modal.style.display = "none";
  todoToDelete = null;
}

function showEditModal(todoData) {
  editModal.style.display = "block";
  console.log("editing data", todoData);
  editFormId = todoData.id;
  document.getElementById("edit-todo").value = todoData.todo;
}

// Cancel button click
cancelBtn.addEventListener("click", hideModal);

// Confirm delete click
confirmBtn.addEventListener("click", async () => {
  if (!todoToDelete) return;
  const todoId = todoToDelete.id;

  try {
    await fetch(`http://localhost:3001/api/todo/${todoId}`, {
      method: "DELETE",
    });
    todoToDelete.remove();
  } catch (err) {
    console.error("Failed to delete todo:", err);
  } finally {
    hideModal();
  }
});

async function fetchTodos() {
  try {
    showLoadingSpinner();
    const response = await fetch("http://localhost:3001/api/todo");
    const data = await response.json();

    // Clear existing todos in DOM
    const parent = document.getElementById("todos");
    parent.innerHTML = "";

    // Render each todo
    data.data.forEach(renderTodo);
  } catch (error) {
    console.error("Error fetching todos:", error);
  } finally {
    hideLoadingSpinner();
  }
}

// 2️⃣ Render single todo
function renderTodo(todo) {
  console.log("todo====>>>", todo);
  const parent = document.getElementById("todos");

  // Wrapper div
  const wrapper = document.createElement("div");
  wrapper.className = "todo-wrapper d-flex justify-content-between mt-2";
  wrapper.id = todo.id; // unique id for reference

  // Task title
  const taskTitle = document.createElement("h4");
  taskTitle.textContent = todo.todo;

  // Button container
  const btnContainer = document.createElement("div");

  // Edit button (you can add edit logic later)
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary";
  editBtn.textContent = "Edit";

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger ms-2";
  deleteBtn.textContent = "Delete";

  editBtn.addEventListener("click", async () => {
    showEditModal(todo);
  });

  // Delete functionality
  deleteBtn.addEventListener("click", async () => {
    showModal(wrapper); // pass wrapper div to modal
  });

  // Append buttons to container
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  // Append title + buttons to wrapper
  wrapper.appendChild(taskTitle);
  wrapper.appendChild(btnContainer);

  // Append wrapper to parent container
  parent.appendChild(wrapper);
}

// Initial fetch
fetchTodos();
