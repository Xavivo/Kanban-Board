function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }
    
    const backLog = document.getElementById('backLog');
    const newItem = createTaskElement(taskText);
    
    backLog.appendChild(newItem);
    saveTasks();
    input.value = '';
}

function createTaskElement(text) {
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.draggable = true;

    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.draggable = false;
    deleteBtn.title = 'Delete task';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', deleteTask);

    newItem.appendChild(span);
    newItem.appendChild(deleteBtn);

    newItem.addEventListener('dragstart', dragStart);
    newItem.addEventListener('dragend', dragEnd);
    return newItem;
}

function deleteTask(e) {
    e.stopPropagation();
    const item = e.target.closest('.item');
    if (!item) return;
    item.remove();
    saveTasks();
}

function saveTasks() {
    const tasks = {};
    document.querySelectorAll('.card').forEach(card => {
        const columnId = card.id;
        tasks[columnId] = [];
        card.querySelectorAll('.item').forEach(item => {
            const text = item.querySelector('.item-text')?.textContent || '';
            if (text) tasks[columnId].push(text);
        });
    });
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('kanbanTasks'));
    if (tasks) {
        Object.keys(tasks).forEach(columnId => {
            const card = document.getElementById(columnId);
            tasks[columnId].forEach(taskText => {
                const newItem = createTaskElement(taskText);
                card.appendChild(newItem);
            });
        });
    }
}

let draggedElement = null;

function dragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
}

function dragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
    saveTasks();
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const card = e.target.closest('.card');
    if (card && draggedElement) {
        card.appendChild(draggedElement);
    }
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragover', dragOver);
    card.addEventListener('drop', drop);
});

document.querySelectorAll('.item').forEach(item => {
    item.draggable = true;
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

// Load tasks on page load
loadTasks();