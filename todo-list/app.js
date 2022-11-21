const button = document.getElementById("btn-group-add");
const todoInput = document.getElementById("todo");
const todoList = document.getElementById("todo-list");
const inputContainer = document.getElementById("input-section");
const sorterButton = document.querySelector(".arrow-down-icon");
const getTodo = document.getElementById("todo-enter");

let todosArr = [];

eventListeners();
dragAndDrop();

function eventListeners() {
  button.addEventListener("click", addInput);
  getTodo.addEventListener("submit", addNewToDo);
  sorterButton.addEventListener("click", sortData);
  document.addEventListener("DOMContentLoaded", addUIController_ASYNC);
}

// !add todo to list
function addNewToDo(e) {
  if (todoInput.value === "") {
    alert("bir todo daxil edin");
  } else {
    todoList.innerHTML += `
      <li class="task-list-li draggable" draggable="true">
             ${todoInput.value}
             <img src="./img/timesIcon.svg" alt="remove" id="delete-img"
             onmouseover="redImg(this)" onmouseout="normalImg(this)" onclick="deleteTodo(this)" 
             />
     </li> 
     `;
    todosArr.push(todoInput.value);
    todoInput.value = "";
    inputContainer.style.display = "none";
    todoList.style.borderRadius = "10px";
    todoList.style.border = "1px solid #c4c4c4";
    todoList.scrollTop = todoList.scrollHeight;
    console.log(todosArr)
  }
  if (todoList.childElementCount > 5) {
    todoList.style.overflowY = "scroll";
    todoList.scrollTop = todoList.scrollHeight;
    inputContainer.style.paddingRight = '24px';
  }
  e.preventDefault();
  dragAndDrop();
}

// !add input
function addInput(e) {
  const viewer = inputContainer.style.display;
  if (viewer === "flex") {
    if (newTodo === "") {
      alert("bir todo daxil edin");
    }
  } else if (todoList.childElementCount == 0) {
    inputContainer.style.display = "flex";
    inputContainer.style.border = " 1px solid #c4c4c4";
    inputContainer.style.borderRadius = "10px";
    todoList.scrollTop = todoList.scrollHeight;
  } else {
    inputContainer.style.display = "flex";
    inputContainer.style.borderTop = "none";
    todoList.style.marginBottom = "0";
    todoList.style.borderRadius = "10px 10px 0 0";
    inputContainer.style.borderRadius = " 0 0 10px 10px";
    todoList.style.borderBottom = "none";
    todoList.scrollTop = todoList.scrollHeight;
  }

  e.preventDefault();
  todoInput.focus();
}

// !change delete icon color
function redImg(x) {
  x.src = "./img/timesRed1.svg";
}

function normalImg(x) {
  x.src = "./img/timesIcon.svg";
}

// !delete item
function deleteTodo() {
  const element = window.event.target.parentElement;
  const elementText = element.textContent.trim();
  todosArr.forEach((item, index) => {
    if (item == elementText) {
      console.log(index)
      todosArr.splice(index, 1);
      element.remove()
    }
  });
  console.log(todosArr)

  if (todoList.childElementCount == 0) {
    todoList.style.border = "none";
    inputContainer.style.display = "flex";
    inputContainer.style.border = " 1px solid #c4c4c4";
    inputContainer.style.borderRadius = "10px";
  }
  if (todoList.childElementCount <= 5) {
    inputContainer.style.paddingRight = '22px';
    todoList.style.overflowY = "hidden";
    inputContainer.style.paddingRight = null;
  }
}

// line delete
function addUIController_ASYNC() {
  todoList.style.border = "none";
}

// !sorting
function sortData(e) {
  let sorting = todosArr.sort();
  element = e.target;

  if (e.target.classList.contains("fa-arrow-down-short-wide")) {
    element.classList.remove("fa-arrow-down-short-wide");
    element.classList.add("fa-arrow-up-short-wide");
  } else if (e.target.classList.contains("fa-arrow-up-short-wide")) {
    element.classList.remove("fa-arrow-up-short-wide");
    element.classList.add("fa-arrow-down-short-wide");
    sorting.reverse();
  }
  todoList.innerHTML = "";

  todosArr.forEach((element) => {
    todoList.innerHTML += `
  <li class="task-list-li draggable" draggable="true"">
         ${element}
         <img src="./img/timesIcon.svg" alt="remove" id="delete-img"
         onmouseover="redImg(this)" onmouseout="normalImg(this)"  onclick="deleteTodo(this)"   />
 </li>  `;
  });
  e.preventDefault();
  dragAndDrop();
}


// !draggbale event
function dragAndDrop() {
  const draggables = document.querySelectorAll(".draggable");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
  });

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  // draggable
  todoList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    const draggable = document.querySelector(".dragging");
    todoList.appendChild(draggable);
    if (afterElement == null) {
      todoList.appendChild(draggable);
    } else {
      todoList.insertBefore(draggable, afterElement);
    }
  });

  function getDragAfterElement(todoList, y) {
    const draggableElements = [
      ...todoList.querySelectorAll(".draggable:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return {
            offset: offset,
            element: child,
          };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    ).element;
  }
}