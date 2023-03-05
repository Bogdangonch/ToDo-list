import "./css/settings.scss";

class Todo {
  constructor(text) {
    this.text = text;
    this.isCompleted = false;
  }
}

class ShowAlert {
  constructor(text, importance) {
    this.text = text;
    this.importance = importance;
    this.alert(this.text, this.importance);
  }
  alert(text, importance) {
    const alert = document.createElement("div");
    const message = document.createElement("p");
    message.className = "message";
    message.innerText = text;
    alert.appendChild(message);
    alert.className = "alert";

    switch (importance) {
      case "error":
        alert.style.backgroundColor = "#e25858";
        break;
      case "sucsses":
        alert.style.backgroundColor = "#228636";
        break;
      default:
        break;
    }
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.classList.add("active");
    });
    setTimeout(() => {
      alert.classList.toggle("active");
    }, 3000);
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
}

class ToDoList {
  constructor(selectedHtmlElement) {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.completed = [];
    this.selectedHtmlElement =
      selectedHtmlElement || document.querySelector("#app");
    this.render(this.todos);
  }

  render(todoArray) {
    this.selectedHtmlElement.innerHTML = "";
    this.layout();
    this.addListWithToDo(todoArray);
    this.getStatistics(todoArray);
  }

  addToDoToList(text) {
    if (text == "" || text == null) {
      const showalert = new ShowAlert("The field cannot be empty", "error");
    } else {
      this.todos.push(new Todo(text));
      const showalert = new ShowAlert("Your adding new todo", "sucsses");
      localStorage.setItem("todos", JSON.stringify(this.todos));
    }
    this.render(this.todos);
  }

  getStatistics(todoArray) {
    this.completed = todoArray.filter((n) => {
      if (n.isCompleted) {
        return n;
      }
    });
    const statisticsWrapper = document.createElement("div");
    statisticsWrapper.classList = "statistics_wrapper";

    const headerTextTodoWrapper = document.createElement("div");
    headerTextTodoWrapper.classList = "header_items";

    const headerTextTodo = document.createElement("p");
    headerTextTodo.classList = "header_text_todo";
    const numberOfTodo = document.createElement("span");
    numberOfTodo.innerText = todoArray.length;
    headerTextTodo.innerText = "Created tasks";
    headerTextTodoWrapper.appendChild(headerTextTodo);
    headerTextTodoWrapper.appendChild(numberOfTodo);

    const headerTextCompletedWrapper = document.createElement("div");
    headerTextCompletedWrapper.classList = "header_items";
    const headerTextCompleted = document.createElement("p");
    headerTextCompleted.classList = "header_text_completed";
    const numberOfCompleated = document.createElement("span");
    numberOfCompleated.innerText = `${this.completed.length} to ${todoArray.length}`;
    headerTextCompleted.innerText = "Completed";
    headerTextCompletedWrapper.appendChild(headerTextCompleted);
    headerTextCompletedWrapper.appendChild(numberOfCompleated);

    statisticsWrapper.appendChild(headerTextTodoWrapper);

    statisticsWrapper.appendChild(headerTextCompletedWrapper);

    this.selectedHtmlElement
      .querySelector(".main")
      .insertAdjacentElement("afterbegin", statisticsWrapper);
  }

  addListWithToDo(todoArray) {
    const ul = document.createElement("ul");
    ul.className = "todo_list";
    todoArray.forEach((todo, todoIndex) => {
      const li = document.createElement("li");
      // check__input
      const check__input = document.createElement("input");
      const label = document.createElement("label");
      const check__box = document.createElement("span");
      check__box.className = "check__box";
      check__input.className = "check__input";
      check__input.type = "checkbox";
      li.innerText = todo.text;
      check__input.checked = todo.isCompleted;
      label.appendChild(check__input);
      label.appendChild(check__box);
      li.insertAdjacentElement("afterbegin", label);
      li.className = "todo_item";
      if (todo.isCompleted) {
        li.classList.add("completed");
      }
      // trashWrapper
      const trash = document.createElement("div");
      trash.classList = "trash";

      trash.addEventListener("click", () => {
        ul.removeChild(li);
        this.todos = this.todos
          .slice(0, todoIndex)
          .concat(this.todos.slice(todoIndex + 1, this.todos.length));

        this.render(this.todos);
      });
      //! Error
      const todoComplete = (event) => {
        if (todo.isCompleted) {
          todo.isCompleted = false;
          event.target.classList.remove("completed");
          check__input.checked = false;
          localStorage.setItem("todos", JSON.stringify(this.todos));
        } else {
          event.target.classList.add("completed");
          todo.isCompleted = true;
          check__input.checked = true;
          localStorage.setItem("todos", JSON.stringify(this.todos));
        }
      };

      li.addEventListener("click", (event) => todoComplete(event));
      check__box.addEventListener("click", (event) => todoComplete(event));
      check__input.addEventListener("change", (event) =>
        this.render(this.todos)
      );

      li.appendChild(trash);
      ul.appendChild(li);
    });
    this.selectedHtmlElement.querySelector(".main").appendChild(ul);
  }

  layout() {
    // header
    const header = document.createElement("header");
    header.className = "header";
    // logo
    const logo = document.createElement("img");
    logo.src = "./img/logo.svg";
    logo.alt = "logo";
    header.appendChild(logo);
    // input_wrapper
    const input_wrapper = document.createElement("div");
    input_wrapper.className = "input_wrapper";
    header.appendChild(input_wrapper);
    // input
    const input = document.createElement("input");
    input.className = "input";
    input.type = "text";
    input.placeholder = "Add a new task";
    // button
    const button = document.createElement("button");
    button.className = "button";
    button.innerText = "Create";
    const plus_img = document.createElement("img");
    plus_img.src = "./img/plus.svg";
    plus_img.alt = "plus";
    button.appendChild(plus_img);
    input_wrapper.appendChild(input);
    input_wrapper.appendChild(button);

    button.addEventListener("click", () => {
      this.addToDoToList(input.value);
      input.value = "";
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addToDoToList(input.value);
        input.value = "";
      }
    });

    // main
    const main = document.createElement("main");
    main.className = "main";

    this.selectedHtmlElement.appendChild(header);
    this.selectedHtmlElement.appendChild(main);
  }
}
const todo = new ToDoList();
