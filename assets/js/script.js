var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();
    
    var taskNameInput = document.querySelector("input[name='task-name']").value; 
    var taskTypeInput = document.querySelector("select[name='task-type']").value; 

    if (!taskNameInput && taskTypeInput) {
        alert("You need to enter a task name!");
        return false;
    } else if (taskNameInput && !taskTypeInput) {
        alert("You need to choose a type!");
        return false
    } else if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    };

    formEl.reset();

    //package data as object
    var taskDataObj = {
        name: taskNameInput,
        type :taskTypeInput
    };
    
    //send it to createTaskEL as an argument
    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
     //creat list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //creates div to hold task info and add to list item
     var taskInfoEl = document.createElement("div");
    
     //gave div a class name
    taskInfoEl.className = "task-info";
    //adds html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    console.dir(listItemEl);

}
 
formEl.addEventListener("submit", taskFormHandler)