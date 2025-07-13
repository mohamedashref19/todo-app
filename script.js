let form = document.querySelector('.form');
let input = document.querySelector('.input');
let btn = document.querySelector('.add');
let tasks = document.querySelector('.tasks');
let fillterdiv = document.querySelector('.filters');
let searchinput = document.querySelector('.search');

let addtask = [];

if (localStorage.getItem('Task')) {
  addtask = JSON.parse(localStorage.getItem('Task'));
}
getdatalocal();
deletall();

tasks.addEventListener('click', (e) => {
  if (e.target.classList.contains('del')) {
    deletetask(e.target.parentElement.getAttribute('data-id'));
    e.target.parentElement.remove();
  }
  if (e.target.classList.contains('task')) {
    toggletask(e.target.getAttribute('data-id'));
    e.target.classList.toggle('done');
  }
});

btn.onclick = function () {
  if (input.value !== '') {
    addtasktoarray(input.value);
    input.value = '';
    deletall();
  }
};
searchinput.addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const filteredTasks = addtask.filter((task) =>
    task.tittle.toLowerCase().includes(searchTerm)
  );
  addtaskpage(filteredTasks);
});

function addtasktoarray(taskdetails) {
  let task = {
    id: Date.now(),
    tittle: taskdetails,
    complete: false,
    date: new Date().toLocaleString(),
  };
  addtask.push(task);
  addtasktolocal(addtask);
  addtaskpage(addtask);
}

function addtaskpage(displayedTasks) {
fillterdiv.style.display = addtask.length > 0 ? 'flex' : 'none';
  tasks.innerHTML = '';
  displayedTasks.forEach((task) => {
    let div = document.createElement('div');
    let span = document.createElement('span');
    div.className = 'task';
    if (task.complete) {
      div.className = 'task done';
    }
    div.setAttribute('data-id', task.id);
    //div.appendChild(document.createTextNode(task.tittle));
    let title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.tittle;

    let spanEdit = document.createElement('span');
    spanEdit.className = 'edit';
    spanEdit.textContent = 'Edit';
    spanEdit.addEventListener('click', () => {
      let inputedit = document.createElement('input');
      inputedit.type = 'text';
      inputedit.value = task.tittle;
      inputedit.className = 'edit-input';

      inputedit.addEventListener('blur', () => {
        task.tittle = inputedit.value.trim() || task.tittle;
        addtasktolocal(addtask);
        addtaskpage(addtask);
      });
      inputedit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') inputedit.blur();
      });
      title.replaceWith(inputedit);
      inputedit.focus();
    });

    let time = document.createElement('span');
    time.className = 'time';
    time.textContent = `${task.date}`;
    span.appendChild(document.createTextNode('Delete'));
    span.className = 'del';
    div.appendChild(title);
    div.appendChild(time);
    div.appendChild(spanEdit);
    div.appendChild(span);
    tasks.appendChild(div);
  });
  
}

function addtasktolocal(addtask) {
  localStorage.setItem('Task', JSON.stringify(addtask));
}
function getdatalocal() {
  let task = localStorage.getItem('Task');
  if (task) {
    addtask = JSON.parse(task);
    addtaskpage(addtask);
  }
}

function deletetask(taskid) {
  addtask = addtask.filter((task) => task.id != taskid);
  addtasktolocal(addtask);
}

function toggletask(taskid) {
  for (let i = 0; i < addtask.length; i++) {
    if (addtask[i].id == taskid) {
      addtask[i].complete == false
        ? (addtask[i].complete = true)
        : (addtask[i].complete = false);
    }
  }
  addtasktolocal(addtask);
}

function deletall() {
  if (localStorage.getItem('Task') && !document.querySelector('.delte')) {
    let div = document.createElement('div');
    let span = document.createElement('span');
    span.appendChild(document.createTextNode('Delete All'));
    div.className = 'delte';

    span.addEventListener('click', (e) => {
      localStorage.removeItem('Task');
      tasks.innerHTML = '';
      addtask = [];
      addtaskpage(addtask);
      div.remove();
    });

    div.appendChild(span);
    fillterdiv.insertAdjacentElement('afterend', div);
  }
}

document.querySelectorAll('.filters button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filtertask(filter);
  });
});

function filtertask(fillterType) {
  let filtersTasked = [];
  if (fillterType === 'all') {
    filtersTasked = addtask;
  } else if (fillterType === 'completed') {
    filtersTasked = addtask.filter((task) => task.complete);
  } else if (fillterType === 'not-completed') {
    filtersTasked = addtask.filter((task) => !task.complete);
  }

  addtaskpage(filtersTasked);
}
////////////////////
