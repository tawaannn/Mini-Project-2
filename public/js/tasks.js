const token = localStorage.getItem('token');

// ถ้าไม่มี token ให้เด้งกลับไปหน้า login
if (!token) {
  window.location.href = '/index.html';
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
}

async function loadTasks() {
  const res = await fetch('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 401) {
    logout();
    return;
  }

  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span onclick="toggleComplete('${task._id}', ${!task.completed})">
        ${task.title} - ${task.description || ''}
      </span>
      <div class="task-actions">
        <button onclick="deleteTask('${task._id}')">ลบ</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;

  if (!title) {
    alert('กรุณาใส่ชื่องาน');
    return;
  }

  await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  loadTasks();
}

async function toggleComplete(id, completed) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  loadTasks();
}

// โหลดงานทันทีที่เปิดหน้า
loadTasks();