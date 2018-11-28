const form = document.querySelector('#task-form');
const taskList = document.querySelector('.current-tasks');
const clearAll = document.querySelector('.clear-all');
const clearOld = document.querySelector('.clear-old');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

loadEventListeners();

function loadEventListeners(){
    document.body.style.background = '#ddd';
    
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeTask); //Event delegate
    clearAll.addEventListener('click', clearAllTasks);
    clearOld.addEventListener('click', clearOldTasks);
    filter.addEventListener('keyup', filterTasks);
}

function getTasks(){
    let arrTasks;
    if (localStorage.getItem('tasks') === null){
        arrTasks = [];
    }
    else {
        arrTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    // Current tasks
    arrTasks.forEach(function(task, index){
        if (task){
            
            let taskData = task.substr(2, task.length);
            let taskType = task.substr(0, 1);
            if (taskType == '1'){
                const li = document.createElement("li");
                li.className = 'collection-item';
                li.appendChild(document.createTextNode(taskData));
                const link = document.createElement('a');
                link.className = 'delete-item secondary-content'
                link.innerHTML = '<i class="material-icons">done</i>';
                li.appendChild(link);
                taskList.appendChild(li);
            }
        }
    });

    // Old completed tasks
    arrTasks.forEach(function(task, index){
        if (task){
            
            let taskData = task.substr(2, task.length);
            let taskType = task.substr(0, 1);
            if (taskType == '0'){
                const li = document.createElement("li");
                li.className = 'collection-item';
                li.appendChild(document.createTextNode(taskData));
                li.style.setProperty("text-decoration", "line-through"); 
                li.style.background = '#ffe';

                const link = document.createElement('a');
                link.className = 'delete-item secondary-content'
                link.innerHTML = '<i class="material-icons">delete</i>';
                li.appendChild(link);
                taskList.appendChild(li);
            }
        }
    });
}

function filterTasks(e){
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task){
        const item = task.firstChild.textContent.toLowerCase();
        if (item.indexOf(text) != -1){
            task.style.display = 'block';
        }
        else {
            task.style.display = 'none';
        }
    });
}

function clearAllTasks(){
    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild);
    }
    clearLocalStorage();
}

function clearOldTasks(){
    var allIcons = document.querySelectorAll('.material-icons');
    allIcons.forEach(function(icon){
        if (icon.textContent === 'delete'){
            var task_element = icon.parentElement.parentElement;
            task_element.remove();
            removeFromLocalStorage(task_element.firstChild.textContent, 0);
        }
    });
}

function removeTask(e){
    
    // <i> - <a> - <li> 
    if (e.target.textContent === 'done'){
    
        var coll_element = e.target.parentElement.parentElement.parentElement;
        var task_element = e.target.parentElement.parentElement;
        task_element.style.background = '#ffe';
        task_element.remove();

        updateLocalStorage(task_element.firstChild.textContent);

        coll_element.appendChild(task_element);
        e.target.parentElement.parentElement.style.setProperty("text-decoration", "line-through"); 
        //e.target.parentElement.parentElement.style.color = 'red';
        e.target.textContent = 'delete';
    }
    else if (e.target.textContent === 'delete'){
        var task_element = e.target.parentElement.parentElement;
        removeFromLocalStorage(task_element.firstChild.textContent, 0);
        e.target.parentElement.parentElement.remove();
    }
}

function addTask(e){
    let taskText = String(taskInput.value).replace('|', '-');
    
    const li = document.createElement("li");
    li.className = 'collection-item';
    li.appendChild(document.createTextNode(taskText));
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content'
    link.innerHTML = '<i class="material-icons">done</i>';
    li.appendChild(link);

    if (taskText) taskList.appendChild(li);

    add2LocalStorage(taskText);

    taskInput.value = null;
    e.preventDefault(); //prevents the form submission
}


function add2LocalStorage(taskData)
{
    let arrTasks;
    if (localStorage.getItem('tasks') === null){
        arrTasks = [];
    }
    else {
        arrTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    arrTasks.push('1|' + taskData);
    localStorage.setItem('tasks', JSON.stringify(arrTasks));
}

function updateLocalStorage(taskData)
{
    let arrTasks;
    if (localStorage.getItem('tasks') === null){
        arrTasks = [];
    }
    else {
        arrTasks = JSON.parse(localStorage.getItem('tasks'));
    }

    arrTasks.forEach(function(task, index){
        if (task === '1|' + taskData){
            arrTasks[index] = '0|' + taskData;
        }
    });
    
    localStorage.setItem('tasks', JSON.stringify(arrTasks));
}

function removeFromLocalStorage(taskItem, currentTask){
    
    let taskdata = currentTask ? '1|' + taskItem : '0|' + taskItem; //to identify completed vs old tasks
    let arrTasks;
    if (localStorage.getItem('tasks') === null){
        arrTasks = [];
    }
    else {
        arrTasks = JSON.parse(localStorage.getItem('tasks'));
    }

    arrTasks.forEach(function(task, index){
        if (task === taskdata){
            arrTasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(arrTasks));
    
}

function clearLocalStorage(){
    localStorage.clear();
}