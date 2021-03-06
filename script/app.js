class Task {
  constructor(description) {
    this.description = description;
    this.id = `${new Date().getTime()}`;
    this.completed = false;
    this.isEdit = false;
  }
}

class ToDoList {
  constructor() {
    this.descTaskInput = document.getElementById('main_input');
    this.footerInfo = document.getElementById('footer_info_wrapper');
    this.checkAllBtn = document.getElementById('toggle-all');
    this.todosWrapper = document.getElementById('todos-wrapper');
    this.leftTasks = document.querySelector('.todo-count');
    this.clearCompleted = document.getElementById('clearCompleted');
    this.allBtn = document.getElementById('allBtn');
    this.activeBtn = document.getElementById('activeBtn');
    this.compBtn = document.getElementById('compBtn');
    this.tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
    this.router = {
      router: 'All',

      set newRouter(router) {
        this.router = router;
      },

      get curretntRouter() {
        return this.router;
      }
    };
    this.footerBtns = [];
    this.init();
  };

  init() {
    this.descTaskInput.addEventListener('keypress', (event) => {
      if (event.key === "Enter" && event.target.value.length && event.target.value.trim().length) {
        this.addNewTask()
      }
    });
    this.checkAllBtn.addEventListener('click', () => {
      const notCompleted = this.tasks.find(t => t.completed === false);
      this.tasks = this.tasks.map(t => {
        if (notCompleted) {
          return {
            ...t,
            completed: true,
          }
        }
        return {
          ...t,
          completed: false,
        };
      });
      this.saveInLocalStorage();
      this.withRouter();
    });
    this.allBtn.addEventListener('click', () => {
      this.router.newRouter = 'All';
      this.withRouter();
    });
    this.activeBtn.addEventListener('click', () => {
      this.router.newRouter = 'Active';
      this.withRouter();
    });
    this.compBtn.addEventListener('click', () => {
      this.router.newRouter = 'Completed';
      this.withRouter();
    });
    this.clearCompleted.addEventListener('click', () => {
      this.tasks = this.tasks.filter((t) => t.completed === false);
      this.saveInLocalStorage(this.tasks);
      this.withRouter();
    });
    this.withRouter();
  };

  render(chosenTaskArray) {
    this.todosWrapper.innerHTML = '';
    this.addTasksList(chosenTaskArray);
    this.addFooter();
  };

  addTasksList(chosenTaskArray) {
    chosenTaskArray.forEach((t, i) => {
      this.createTaskTemplate(t, i);
    });
    const haveNotCompleted = chosenTaskArray.find(t => t.completed === false);
    if (haveNotCompleted) {
      this.checkAllBtn.checked = false;
      return;
    };
    if (!haveNotCompleted && chosenTaskArray.length) {
      const fromLocal = this.tasks.find(t => t.completed === false);
      if (fromLocal) {
        this.heckAllBtn.checked = false;
        return;
      };
      this.checkAllBtn.checked = true;
      return;
    };
    this.checkAllBtn.checked = false;
  };

  addFooter() {
    this.footerBtns = [];
    this.footerBtns.push(allBtn);
    this.footerBtns.push(activeBtn);
    this.footerBtns.push(compBtn);
    const leftTaskLength = this.tasks.filter(t => t.completed !== true).length;
    if (this.tasks.length) {
      this.footerInfo.className = 'footer';
      const haveCompleted = this.tasks.find(t => t.completed === true);
      clearCompleted.className = haveCompleted ? 'clear-completed visible' : 'hidden';
      this.leftTasks.innerHTML = `${leftTaskLength} tasks left`;
      return;
    };
    this.footerInfo.className = 'hidden-footer';
  };

  createTaskTemplate(task, index) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const updateInput = document.createElement('input');
    const destroyButton = document.createElement('button');
    updateInput.className = 'edit';
    updateInput.type = 'text';
    updateInput.id = `updateInput${task.id}`;
    updateInput.autofocus = true;
    updateInput.addEventListener('blur', () => {
      this.toggleEditMode(task.id, true);
    });
    destroyButton.type = 'button';
    destroyButton.className = 'destroy';
    destroyButton.addEventListener('click', () => {
      this.removeTask(task.id);
    });
    label.innerText = task.description;
    label.classList.add('description', `${task.completed ? 'completed' : null}`);
    label.addEventListener('dblclick', () => {
      this.updateInput(task.id, index);
    });
    input.type = 'checkbox';
    input.className = 'toggle';
    input.checked = task.completed ? `checked` : '';
    input.addEventListener('click', () => {
      this.completeTask(task.id);
    });
    div.className = 'view';
    task.isEdit ? li.className = 'editing' : li.className = '';
    li.id = task.id;
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(destroyButton);
    li.appendChild(div);
    li.appendChild(updateInput);
    this.todosWrapper.append(li);
  };

  withRouter() {
    if (this.router.curretntRouter === 'All') {
      const allTasks = this.getAll();
      this.render(allTasks);
      this.setActive('All');
    };
    if (this.router.curretntRouter === 'Active') {
      const activeTasks = this.getActive();
      this.render(activeTasks);
      this.setActive('Active');
    };
    if (this.router.curretntRouter === 'Completed') {
      const completedTasks = this.getCompleted();
      this.render(completedTasks);
      this.setActive('Completed');
    };
  };

  getAll() {
    return JSON.parse(window.localStorage.getItem("tasks")) || []
  };

  getActive() {
    return (JSON.parse(window.localStorage.getItem("tasks")) || []).filter((t) => t.completed === false);
  };
  getCompleted() {
    return (JSON.parse(window.localStorage.getItem("tasks")) || []).filter((t) => t.completed === true);
  };

  setActive(buttonName) {
    this.footerBtns.forEach(b => {
      if (b.innerHTML === buttonName) {
        b.className = 'activeButton';
        return;
      };
      b.classList.remove('activeButton');
    });
  };

  addNewTask() {
    const description = this.descTaskInput.value;
    const newTask = new Task(description);
    this.tasks.push(newTask);
    this.saveInLocalStorage();
    this.withRouter();
    this.descTaskInput.value = '';
  };

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveInLocalStorage();
    this.withRouter();
  };

  completeTask(id) {
    this.tasks = this.tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          completed: !t.completed
        }
      }
      return t;
    });
    this.saveInLocalStorage(this.tasks);
    this.withRouter();
  };

  toggleEditMode(id, changed = false) {
    const currentTasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
    this.tasks = currentTasks.map((t) => {
      if (t.id === id) {
        if (t.id === id && changed) {
          const updateInput = document.getElementById(`updateInput${id}`);
          return {
            ...t,
            isEdit: !t.isEdit,
            description: updateInput.value.length && updateInput.value.trim().length ? updateInput.value : t.description
          };
        };
        return {
          ...t,
          isEdit: !t.isEdit
        };
      };
      return t;
    });
    this.saveInLocalStorage();
    this.withRouter();
  };

  updateInput(id) {
    this.toggleEditMode(id);
    const updateInput = document.getElementById(`updateInput${id}`);
    updateInput.focus();
    const currentTask = this.tasks.find(t => t.id === id)
    updateInput.value = currentTask.description
  };

  saveInLocalStorage() {
    window.localStorage.setItem("tasks", JSON.stringify(this.tasks))
  };

};

const todo = new ToDoList();