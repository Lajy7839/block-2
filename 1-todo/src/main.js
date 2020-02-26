
// Waiting for jQuery to initialize
$(document).ready(function() {
  // Initialize Class (Component)
  new TodoListService($);
});

// Declaring our component class
class TodoListService {
  // Declaring class level properties
  LIST_ID = "todolist";
  TODO_CONTAINER = "aside.todo-items";
  TODO_INPUT = "input.todo-title";
  // array of objets
  existingTodos;
  jQuery;
  StatusEnum = {
    DONE : 0,
    TODO : 1
  };

  constructor(jQuery) {
    this.jQuery = jQuery;
    this.render();
    this.onEnterInit();
    this.onRemoveInit();
    this.onDoneInit();
  }

  // Rendering function for updating view
  render() {

    // localStorage read
    this.existingTodos = this.readStorage(this.LIST_ID);

    // replacing whole html content with result of array iteration
    this.jQuery(this.TODO_CONTAINER).html(
      this.existingTodos.map(item => {
        const title = item.title;
        const id = item.id;
        const ageInMin = Math.round((Date.now() - item.creationDate) / (1000 * 60)) + " min";
        return `<div id= ${id}>
                  <p>${title}</p><p>${ageInMin}</p>
                  <p><span class='${ "status status".concat(item.status) }' ></p>
                  <button id='remove' >Remove</button>
                  <button id='done' class='${ "status".concat(item.status) }'>Done</button>
                </div>`;
      })
    );
  }

  /**
   * Used to add new items to a list
   *
   * @param {string} item new item value
   */
  addItemToList(item) {
    const itemTask = {
      id: Date.now(),
      creationDate : Date.now(),
      title: item,
      status:this.StatusEnum.TODO
    }
    this.existingTodos.push(itemTask);
    this.storeList(this.LIST_ID, this.existingTodos);
    this.render();
  }

  /**
   * Used to read items from LocalStorage
   *
   * @param {*} listId
   */

  readStorage(listId) {
    if (localStorage.length) {
      const arrayOfTask = JSON.parse(localStorage.getItem(listId) ?? []);
      return arrayOfTask;
    } else {
      localStorage.setItem(listId, []);
      return [];
    }
  }

  /**
   *
   * Used to store an array to the LocalStorage
   *
   * @param {*} listId localStorage key
   * @param {*} toDos array of todos
   */
  storeList(listId, toDos) {
    try {
      localStorage.setItem(listId, JSON.stringify(toDos));
    } catch (e) {
      console.error(e);
    }
  }

  findIndexOfTask(id) {
    return this.existingTodos.map(function(e) { return e.id; }).indexOf(parseInt(id));

  }

  /**
   *
   * Used to remove one item from the local storage
   *
   * @param {*} item value of an array item
   */
  removeItemFromList(id) {
    const index = this.findIndexOfTask(id);
    if (index > -1) {
      this.existingTodos.splice(index, 1);
      this.storeList(this.LIST_ID, this.existingTodos);
    }
    this.render();
  }

  doneItemFromList(id) {
    const index = this.findIndexOfTask(id);
    if (index > -1) {
      this.existingTodos[index].status = this.StatusEnum.DONE;
      this.storeList(this.LIST_ID, this.existingTodos);
    }
    this.render();
  }


  /**
   * Binds onEnter event to the component input
   */
  onEnterInit() {
    this.jQuery(this.TODO_INPUT).keypress(e => {
      const key = e.which;
      const value = e.target.value;
      if (key == 13 && value) {
        $(this.TODO_INPUT).val("");
        this.addItemToList(value);
        return false;
      }
    });
  }

  /**
   * Binds onRemove event to the component input
   */
  onRemoveInit() {
    this.jQuery(this.TODO_CONTAINER).on("click", "button#remove", e => {
      this.removeItemFromList(
        this.jQuery(e.target)
          .parent().attr('id')
      );
    });
  }

    /**
   * Binds onDone event to the component input
   */
  onDoneInit() {
    this.jQuery(this.TODO_CONTAINER).on("click", "button#done", e => {
      this.doneItemFromList(
        this.jQuery(e.target)
          .parent().attr('id')
      );
    });
  }

}
