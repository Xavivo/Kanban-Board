function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }
    
    const backLog = document.getElementById('backLog');
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.draggable = true;
    newItem.textContent = taskText;
    newItem.addEventListener('dragstart', dragStart);
    newItem.addEventListener('dragend', dragEnd);
    
    backLog.appendChild(newItem);
    input.value = '';
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