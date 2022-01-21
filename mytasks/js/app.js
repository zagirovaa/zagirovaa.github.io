import AboutModal from "../components/AboutModal.js";
import GroupModal from "../components/GroupModal.js";
import TaskModal from "../components/TaskModal.js";

// Service Worker registration block
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../sw.js", { scope: "." }).then(reg => {
        if(reg.installing) {
            console.log("Service worker installing");
        } else if (reg.waiting) {
            console.log("Service worker installed");
        } else if (reg.active) {
            console.log("Service worker active");
        };
    }).catch(function(error) {
        console.log("Registration failed with " + error);
    });
};

let localDB = [];
let pagesCount = 0;
let currentPage = 0;
const TASKS_PER_PAGE = 5;

const helpContext = {
    "title": "About",
    "name": "MyTasks",
    "version": "0.3.5",
    "developer": "Zagirov Abdul Askerovich"
};

const modalMode = {
    "add": 0,
    "edit": 1
};

loadData();

// Navbar burger event handler setting
document.addEventListener("DOMContentLoaded", () => {
    setMenuItemsEventListeners();
    const navbarBurger = document.querySelector(".navbar-burger");
    navbarBurger.addEventListener("click", () => {
        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle("is-active");
        target.classList.toggle("is-active");
    });
});


// Function loads all saved data from localStorage
function getData() {

    localDB = JSON.parse(localStorage.getItem("localDB")) || [];

};


// Function saves all data to localStorage
function saveData() {

    localStorage.setItem("localDB", JSON.stringify(localDB));

};


// On first start (reload) page loading subroutine
function loadData() {

    getData();
    // No need to load anything if there is no data
    if (localDB.length) {
        const groupsPanel = document.getElementById("groups-panel");
        const groupsCount = document.getElementById("groups-count");
        const activeGroup = getActiveGroup();
        const renderGroups = localDB.reduce((result, current) => {
            result += `<a id="${current.uuid}" class="panel-block is-radiusless">${current.name}</a>`;
            return result;
        }, "");
        groupsPanel.insertAdjacentHTML("beforeend", renderGroups);
        drawActiveGroup(activeGroup.uuid);
        groupsCount.textContent = localDB.length;
        // Groups event handlers
        localDB.forEach(el => {
            document.getElementById(el.uuid).addEventListener("click", () => {
                toggleActiveGroup(el.uuid);
            });
        });
        // Tasks of active group are loaded if there is any
        if (activeGroup.tasks.length) {
            changePage();
        };
    };

}


/* 
    Subroutines related to groups
 */

// Checks whether group with a given name already exists
function groupExists(name) {

    if (localDB.length) {
        for (const group of localDB) {
            if (group.name === name) {
                return true;
            };
        };
    };
    return false;

}


// Returnes a group that is active
function getActiveGroup() {

    if (localDB.length) {
        for (let group of localDB) {
            if (group.active) {
                return group;
            };
        };
    };
    return false;

}


// Returns an index of active group
function getGroupIndex(uuid) {

    if (localDB.length) {
        for (let group = 0; group < localDB.length; group++) {
            if (localDB[group].uuid === uuid) {
                return group;
            };
        };
    };
    return -1;

}


// Changes background of group element with a given uuid to be active
function drawActiveGroup(uuid) {

    const activeGroup = document.getElementById(uuid) || null;
    if (activeGroup) {
        activeGroup.classList.add("has-background-info", "has-text-white");
    };

}


// Changes background of group element with a given uuid to be inactive
function drawInActiveGroup() {

    const activeGroup = document.getElementById(getActiveGroup().uuid) || null;
    if (activeGroup) {
        activeGroup.classList.remove("has-background-info", "has-text-white");
    };

}


// Changes current active group to the one with the given uuid
function makeGroupActive(uuid) {

    localDB[getGroupIndex(getActiveGroup().uuid)].active = false;
    localDB[getGroupIndex(uuid)].active = true;

};


// Toggles active group
function toggleActiveGroup(uuid) {

    currentPage = 0;
    pagesCount = 0;
    drawInActiveGroup();
    drawActiveGroup(uuid);
    makeGroupActive(uuid);
    updateTasksList();
    saveData();

}


// Clears the contents of panel with group elements
function clearGroupsPanel() {

    const panel = document.querySelector("#groups-panel .panel-heading");
    const allSiblings = [...panel.parentElement.children].filter(child => child !== panel);
    allSiblings.forEach(el => {
        el.remove();
    });
    document.getElementById("groups-count").textContent = "0";

}


/* 
    Subroutines related to tasks
 */

// Returnes a task that is active
function getActiveTask() {

    const activeGroup = getActiveGroup();
    if (activeGroup && activeGroup.tasks.length) {
        for (let task of activeGroup.tasks) {
            if (task.active) {
                return task;
            };
        };
    };
    return false;

}


// Returns an index of active task
function getTaskIndex(uuid) {

    const activeGroup = getActiveGroup();
    if (activeGroup.tasks.length) {
        for (let task = 0; task < activeGroup.tasks.length; task++) {
            if (activeGroup.tasks[task].uuid === uuid) {
                return task;
            };
        };
    };
    return -1;

}


// Changes background of task element with a given uuid to be active
function drawActiveTask(uuid) {

    const activeTask = document.getElementById(uuid);
    const cardContent = document.querySelector(`#${uuid} .card-content`);
    const title = document.querySelector(`#${uuid} .title`);
    const subtitle = document.querySelector(`#${uuid} .subtitle`);
    const content = document.querySelector(`#${uuid} .content`);
    activeTask.classList.add("has-background-info");
    cardContent.classList.add("has-background-info");
    title.classList.add("has-text-white");
    subtitle.classList.add("has-text-white");
    content.classList.add("has-text-white");

}


// Changes background of task element with a given uuid to be inactive
function drawInActiveTask() {

    const activeTask = getActiveTask();
    const activeTaskBlock = document.getElementById(activeTask.uuid) || null;
    if (activeTaskBlock) {
        const cardContent = document.querySelector(`#${activeTask.uuid} .card-content`);
        const title = document.querySelector(`#${activeTask.uuid} .title`);
        const subtitle = document.querySelector(`#${activeTask.uuid} .subtitle`);
        const content = document.querySelector(`#${activeTask.uuid} .content`);
        activeTaskBlock.classList.remove("has-background-info");
        cardContent.classList.remove("has-background-info");
        title.classList.remove("has-text-white");
        subtitle.classList.remove("has-text-white");
        content.classList.remove("has-text-white");
    };

}


// Changes current active task to the one with the given uuid
function makeTaskActive(uuid) {

    const activeGroup = getActiveGroup();
    activeGroup.tasks[getTaskIndex(getActiveTask().uuid)].active = false;
    activeGroup.tasks[getTaskIndex(uuid)].active = true;

}


// Toggles active task
function toggleActiveTask(uuid) {
    
    drawInActiveTask();
    drawActiveTask(uuid);
    makeTaskActive(uuid);
    saveData();

}


// Clears the contents of panel with task elements
function clearTasksPanel() {

    const panel = document.querySelector("#tasks-panel .panel-heading");
    const allSiblings = [...panel.parentElement.children].filter(child => child !== panel);
    allSiblings.forEach(el => {
        el.remove();
    });
    document.getElementById("tasks-count").textContent = "0";

}


// 
function getCurrentPageTasks() {

    const activeGroup = getActiveGroup();
    if (activeGroup.tasks.length <= TASKS_PER_PAGE) {
        pagesCount = 1;
    } else {
        pagesCount = Math.ceil(activeGroup.tasks.length / TASKS_PER_PAGE);
    };
    if (currentPage == 0) {
        currentPage = 1;
    };
    const startItem = currentPage * TASKS_PER_PAGE - TASKS_PER_PAGE;
    const endItem = startItem + TASKS_PER_PAGE;
    const outputList = activeGroup.tasks.slice(startItem, endItem);
    return outputList;

}


// 
function changePage() {

    const outputList = getCurrentPageTasks();
    makeTaskActive(outputList[0].uuid);
    updateTasksList();

}


// 
function updateTasksList() {

    const activeGroup = getActiveGroup();
    const pagination = document.getElementById("pagination");
    if (activeGroup) {
        clearTasksPanel();
        if (activeGroup.tasks.length) {
            const tasksPanel = document.getElementById("tasks-panel");
            const tasksCount = document.getElementById("tasks-count");
            const outputList = getCurrentPageTasks();
            const renderTasks = outputList.reduce((result, current) => {
                result += `
                    <a id="${current.uuid}" class="panel-block is-radiusless">
                        <div class="card is-shadowless">
                            <div class="card-content is-radiusless">
                                <div class="media">
                                    <div class="media-content">
                                        <p class="title is-4">${current.title}</p>
                                        <p class="subtitle is-6">
                                            <time datetime="${current.created}">${current.created}</time>
                                        </p>
                                    </div>
                                </div>
                                <div class="content">${current.message}</div>
                            </div>
                        </div>
                    </a>
                `;
                return result;
            }, "");
            tasksPanel.insertAdjacentHTML("beforeend", renderTasks);
            toggleActiveTask(outputList[0].uuid);
            tasksCount.textContent = activeGroup.tasks.length;
            outputList.forEach(el => {
                document.getElementById(el.uuid).addEventListener("click", () => {
                    toggleActiveTask(el.uuid);
                });
            });
        } else {
            currentPage = 0;
            pagesCount = 0;
        };
        pagination.textContent = `${currentPage} of ${pagesCount}`;
    };

}


/* 
    Subroutines related to event handling
 */

// Menu items event handlers with associated functions
function setMenuItemsEventListeners() {

    const menuItems = Array.from(document.querySelectorAll("a.navbar-item"));
    menuItems.forEach(el => {
        const menuText = el.textContent;
        switch (menuText) {
            case "Add new group":
                el.addEventListener("click", addGroup);
                break;
            case "Edit current group":
                el.addEventListener("click", editGroup);
                break;
            case "Delete current group":
                el.addEventListener("click", deleteGroup);
                break;
            case "Clear all groups":
                el.addEventListener("click", clearGroups);
                break;
            case "Add new task":
                el.addEventListener("click", addTask);
                break;
            case "Edit current task":
                el.addEventListener("click", editTask);
                break;
            case "Delete current task":
                el.addEventListener("click", deleteTask);
                break;
            case "Clear all tasks":
                el.addEventListener("click", clearTasks);
                break;
            case "About":
                el.addEventListener("click", showAbout);
                break;
            case "«":
                el.addEventListener("click", moveToFirstPage);
                break;
            case "‹":
                el.addEventListener("click", moveToPreviousPage);
                break;
            case "›":
                el.addEventListener("click", moveToNextPage);
                break;
            case "»":
                el.addEventListener("click", moveToLastPage);
                break;
        };
    });

};


// Function adds new group
function addGroup() {

    const groupModal = new GroupModal(modalMode.add, localDB);
    groupModal.show();

};


// Function edits active group
function editGroup() {

    if (getActiveGroup()) {
        const groupModal = new GroupModal(modalMode.edit, localDB);
        groupModal.show();
    };

};


// Function deletes active group
function deleteGroup() {

    if (getActiveGroup()) {
        const activeGroupID = getActiveGroup().uuid;
        const currentActiveIndex = getGroupIndex(activeGroupID);
        const groupCount = document.getElementById("groups-count");
        if (localDB.length > 1) {
            if (localDB[currentActiveIndex - 1]) {
                toggleActiveGroup(localDB[currentActiveIndex - 1].uuid);
            } else {
                toggleActiveGroup(localDB[currentActiveIndex + 1].uuid);
            };
        };
        localDB.splice(currentActiveIndex, 1);
        saveData();
        document.getElementById(activeGroupID).remove();
        groupCount.textContent = localDB.length;
        drawActiveGroup(getActiveGroup().uuid);
    };

};


// Function removes all groups
function clearGroups() {

    if (localDB.length) {
        const pagination = document.getElementById("pagination");
        localStorage.clear();
        localDB = [];
        clearGroupsPanel();
        clearTasksPanel();
        currentPage = 0;
        pagesCount = 0;
        pagination.textContent = `${currentPage} of ${pagesCount}`;
    };

};


// Function adds new task to the active group
function addTask() {

    const taskModal = new TaskModal(modalMode.add);
    taskModal.show();

};


// Function edits active task in the active group
function editTask() {

    if (getActiveTask()) {
        const taskModal = new TaskModal(modalMode.edit);
        taskModal.show();
    };

};


// Function removes active task from the active group
function deleteTask() {

    const activeGroup = getActiveGroup();
    if (activeGroup && activeGroup.tasks.length) {
        const activeTaskID = getActiveTask().uuid;
        const currentActiveIndex = getTaskIndex(activeTaskID);
        const taskCount = document.getElementById("tasks-count");
        if (activeGroup.tasks.length > 1) {
            if (activeGroup.tasks[currentActiveIndex - 1]) {
                makeTaskActive(activeGroup.tasks[currentActiveIndex - 1].uuid);
            } else {
                makeTaskActive(activeGroup.tasks[currentActiveIndex + 1].uuid);
            };
        };
        activeGroup.tasks.splice(currentActiveIndex, 1);
        saveData();
        document.getElementById(activeTaskID).remove();
        taskCount.textContent = activeGroup.tasks.length;
        updateTasksList();
    };

};


// Function removes all tasks from the active group
function clearTasks() {

    const activeGroup = getActiveGroup();
    if (activeGroup && activeGroup.tasks.length) {
        const pagination = document.getElementById("pagination");
        activeGroup.tasks.length = 0;
        saveData();
        clearTasksPanel();
        currentPage = 0;
        pagesCount = 0;
        pagination.textContent = `${currentPage} of ${pagesCount}`;
    };

};


// Function shows a dialog about the app
function showAbout() {

    const aboutModal = new AboutModal(helpContext);
    aboutModal.show();
    
};


// Function moves to the first page
function moveToFirstPage() {

    if (pagesCount > 0) {
        currentPage = 1;
        changePage();
    };

};


// Function moves to the previous page
function moveToPreviousPage() {

    if (currentPage > 1) {
        currentPage -= 1;
        changePage();
    };

};


// Function moves to the next page
function moveToNextPage() {

    if (currentPage < pagesCount) {
        currentPage += 1;
        changePage();
    };

};


// Function moves to the last page
function moveToLastPage() {

    if (pagesCount > 0) {
        currentPage = pagesCount;
        changePage();
    };

};


// Export block
export {
    saveData, 
    getActiveGroup, 
    groupExists, 
    getGroupIndex, 
    toggleActiveGroup, 
    getActiveTask, 
    getTaskIndex, 
    updateTasksList
};