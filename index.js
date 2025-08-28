 async function fetchTodos() {
    try {
      const response = await fetch("http://localhost:3001/api/todo");
      const data = await response.json();

      // Clear existing todos in DOM
      const parent = document.getElementById("todos");
      parent.innerHTML = "";

      // Render each todo
      data.data.forEach(renderTodo);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  // 2️⃣ Render single todo
  function renderTodo(todo) {
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

    // Delete functionality
    deleteBtn.addEventListener("click", async () => {
      try {
        await fetch(`http://localhost:3001/api/todo/${todo.id}`, {
          method: "DELETE",
        });
        wrapper.remove(); // Remove from DOM
      } catch (err) {
        console.error("Failed to delete todo:", err);
      }
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