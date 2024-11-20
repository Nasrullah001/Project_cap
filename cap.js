const tasksContainer = document.querySelector('#tasks');
const addTaskForm = document.querySelector('#addTaskForm');
const filterPriority = document.querySelector('#filterPriority');
const searchTasks = document.querySelector('#searchTasks');

const apiBaseUrl = 'http://localhost:5000'; // Replace with your backend URL

// Fetch tasks from API
async function fetchTasks(filter = {}, search = '') {
  let url = `${apiBaseUrl}/tasks?`;

  if (filter.priority) url += `priority=${filter.priority}&`;
  if (search) url += `keyword=${search}`;

  const response = await fetch(url);
  const tasks = await response.json();
  renderTasks(tasks);
}

// Add a new task
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTask = {
    title: document.querySelector('#taskTitle').value,
    description: document.querySelector('#taskDescription').value,
    deadline: document.querySelector('#taskDeadline').value,
    priority: document.querySelector('#taskPriority').value,
  };

  const response = await fetch(`${apiBaseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });

  if (response.ok) {
    fetchTasks();
    addTaskForm.reset();
  } else {
    console.error('Failed to add task');
  }
});

// Render tasks to the DOM
function renderTasks(tasks) {
  tasksContainer.innerHTML = '';
  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}, Deadline: ${task.deadline}</p>
      </div>
      <div class="taskActions">
        <button onclick="deleteTask('${task._id}')">Delete</button>
        <button onclick="editTask('${task._id}')">Edit</button>
      </div>
    `;
    tasksContainer.appendChild(taskItem);
  });
}

// Delete a task
async function deleteTask(taskId) {
  const response = await fetch(`${apiBaseUrl}/tasks/${taskId}`, { method: 'DELETE' });
  if (response.ok) fetchTasks();
  else console.error('Failed to delete task');
}

// Filter tasks by priority
filterPriority.addEventListener('change', () => {
  const priority = filterPriority.value;
  fetchTasks({ priority });
});

// Search tasks
searchTasks.addEventListener('input', () => {
  const keyword = searchTasks.value;
  fetchTasks({}, keyword);
});

// Load tasks initially
fetchTasks();