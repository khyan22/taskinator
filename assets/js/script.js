var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0
var pageContentEl = document.querySelector("#page-content")
var taskInProgressEl = document.querySelector("#task-in-progress");
var taskCompletedEl = document.querySelector("#task-completed");
var tasks = [];

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

    var isEdit = formEl.hasAttribute("data-task-id");

    //if formEl has a  data attribute then the function along with the taskId are called
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    //if formEl has no data attribute, the createTaskEl() will be called along with the form values
    else {
        //package data as object
        var taskDataObj = {
            name: taskNameInput,
            type :taskTypeInput,
            status: "to do"
        };

        // send taskDataObj to createTaskEL as an argument
        createTaskEl(taskDataObj);
    };
};

var createTaskEl = function(taskDataObj) {
     //creat list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //sets id and attribute 
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //creates div to hold task info and add to list item
     var taskInfoEl = document.createElement("div");
    
     //gave div a class name
    taskInfoEl.className = "task-info";
    //adds html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionEl = createTaskAction(taskIdCounter);
    listItemEl.appendChild(taskActionEl)



    if (taskDataObj.status === "to do") {
        tasksToDoEl.appendChild(listItemEl);
    } else if (taskDataObj.status === "in progress") {
        taskInProgressEl.appendChild(listItemEl);
    } else if (taskDataObj.status === "completed") {
        taskCompletedEl.appendChild(listItemEl);
    }
    //add entire list item to list
    // tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    //saves data into localStorage
    saveTasks()

    //increases the counter for every unique id 
    taskIdCounter++;
};

var createTaskAction = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(deleteButtonEl)

    //status dropdown options
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //status array
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select 
        statusSelectEl.appendChild(statusOptionEl);
    };

    return actionContainerEl;
}

//function lets the user edit their tasks
var completeEditTask = function(taskName, taskType, taskId) {
    //finds the matching list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    //gives task-item the new edited values 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loops through tasks array and object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    //saves data into localStorage
    saveTasks()

    //was supposed to have a window alert but decided it was annoying and unnecessary 
    // alert("Task Updated!")

    //resets formEl
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

//this function matches the different button id's to their corresponding function
var taskButtonHandler = function(event) {
    //get element from event
    var targetEl = event.target;

    //if delete button is clicked
    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
    //if edit button is clicked
    else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};

var deleteTask = function (taskId) {
     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); 
    taskSelected.remove()

    //create new array to hold updated lists of tasks
    var updateTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into a new array
        if (tasks[i].id !== parseInt(taskId)) {
            updateTaskArr.push(tasks[i]);
        }
    };

    //reassign tasks array to be the same as updateTaskArr
    tasks = updateTaskArr;

    //saves data into localStorage
    saveTasks()
};

var editTask = function(taskId) {
    //get task list item element 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //sending taskSelected name and type value back to the task-form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //changes add task button's text content
    document.querySelector('#save-task').textContent = "Save Changes";
    
    //gives form the edited task's id
    formEl.setAttribute("data-task-id", taskId);
}

//changes the task placement to a different status
var taskStatusChangeHandler = function(event) {
    //get task items id
    var taskId = event.target.getAttribute("data-task-id");

    //set current selected option's value to lowercase
    var statusValue = event.target.value.toLowerCase();

    //selects the parent task item based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //appends list item to desired status column 
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
    }

    //updates tasks in tasks array
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };

    //saves data into localStorage
    saveTasks()
}

//saves data to local storage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


//loads data from localStorage
var loadTasks = function() {
    //localstorage.getItem(tasks)
    //use JSON.parse on tasks data
    // use a for loop to iterate through tasks and create task elements on the page
    var savedTasks = localStorage.getItem("tasks");
    console.log(tasks);

    if (!tasks) {
        tasks = [];
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    //loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into createTaskEl()
        createTaskEl(savedTasks[i]);
    }
}


loadTasks()
formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);