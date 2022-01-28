import AboutModal from "../components/AboutModal.js";
import GroupModal from "../components/GroupModal.js";
import TaskModal from "../components/TaskModal.js";
import SettingsModal from "../components/SettingsModal.js";


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js", { scope: "." }).then(reg => {
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
const settings = {
    "pagesCount": 0,
    "currentPage": 0,
    "tasksPerPage": 5
};

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


getData();
if (localDB.length) {
    const groupsPanel = document.getElementById("groups-panel");
    const tasksPanel = document.getElementById("tasks-panel");
    const groupsCount = document.getElementById("groups-count");
    const activeGroup = getActiveGroup();
    const renderGroups = localDB.reduce((result, current) => {
        result += `<a id="${current.uuid}" class="panel-block is-radiusless">${current.name}</a>`;
        return result;
    }, "");
    groupsPanel.insertAdjacentHTML("beforeend", renderGroups);
    drawActiveGroup(activeGroup.uuid);
    groupsCount.textContent = localDB.length;
    localDB.forEach(el => {
        document.getElementById(el.uuid).addEventListener("click", group => {
            group.stopPropagation();
            toggleActiveGroup(el.uuid);
        }, false);
    });
    if (activeGroup.tasks.length) {
        changePage();
    };
    groupsPanel.addEventListener("click", toggleGroupsPanel, false);
    tasksPanel.addEventListener("click", toggleTasksPanel, false);
};


document.addEventListener("DOMContentLoaded", () => {
    const menuItems = Array.from(document.querySelectorAll("a.navbar-item"));
    menuItems.forEach(el => {
        const menuText = el.textContent;
        switch (menuText) {
            case "Add new group":
                el.addEventListener("click", addGroup, false);
                break;
            case "Edit current group":
                el.addEventListener("click", editGroup, false);
                break;
            case "Delete current group":
                el.addEventListener("click", deleteGroup, false);
                break;
            case "Clear all groups":
                el.addEventListener("click", clearGroups, false);
                break;
            case "Add new task":
                el.addEventListener("click", addTask, false);
                break;
            case "Edit current task":
                el.addEventListener("click", editTask, false);
                break;
            case "Delete current task":
                el.addEventListener("click", deleteTask, false);
                break;
            case "Clear all tasks":
                el.addEventListener("click", clearTasks, false);
                break;
            case "Settings":
                el.addEventListener("click", showSettings, false);
                break;
            case "About":
                el.addEventListener("click", showAbout, false);
                break;
            case "«":
                el.addEventListener("click", moveToFirstPage, false);
                break;
            case "‹":
                el.addEventListener("click", moveToPreviousPage, false);
                break;
            case "›":
                el.addEventListener("click", moveToNextPage, false);
                break;
            case "»":
                el.addEventListener("click", moveToLastPage, false);
                break;
        };
    });
    const navbarBurger = document.querySelector(".navbar-burger");
    navbarBurger.addEventListener("click", () => {
        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle("is-active");
        target.classList.toggle("is-active");
    }, false);
});


function getData() {

    localDB = JSON.parse(localStorage.getItem("localDB")) || [];
    settings.tasksPerPage = JSON.parse(localStorage.getItem("tasksPerPage")) || 0;

};


function saveData() {

    localStorage.setItem("localDB", JSON.stringify(localDB));
    localStorage.setItem("tasksPerPage", JSON.stringify(settings.tasksPerPage));

};


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


function drawActiveGroup(uuid) {

    const activeGroup = document.getElementById(uuid) || null;
    if (activeGroup) {
        activeGroup.classList.add("has-background-info", "has-text-white");
    };

}


function drawInActiveGroup() {

    const activeGroup = document.getElementById(getActiveGroup().uuid) || null;
    if (activeGroup) {
        activeGroup.classList.remove("has-background-info", "has-text-white");
    };

}


function makeGroupActive(uuid) {

    localDB[getGroupIndex(getActiveGroup().uuid)].active = false;
    localDB[getGroupIndex(uuid)].active = true;

};


function toggleActiveGroup(uuid) {

    settings.currentPage = 0;
    settings.pagesCount = 0;
    drawInActiveGroup();
    drawActiveGroup(uuid);
    makeGroupActive(uuid);
    updateTasksList();
    saveData();

}


function toggleGroupsPanel() {

    const groups = Array.from(document.querySelectorAll("#groups-panel a"));
    if (groups.length) {
        for (let group of groups) {
            if (group.style.display == "block" || group.style.display == "") {
                group.style.display = "none";
            } else {
                group.style.display = "block";
            };
        };
    };

}


function clearGroupsPanel() {

    const panel = document.querySelector("#groups-panel .panel-heading");
    const allSiblings = [...panel.parentElement.children].filter(child => child !== panel);
    allSiblings.forEach(el => {
        el.remove();
    });
    document.getElementById("groups-count").textContent = "0";

}


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


function makeTaskActive(uuid) {

    const activeGroup = getActiveGroup();
    activeGroup.tasks[getTaskIndex(getActiveTask().uuid)].active = false;
    activeGroup.tasks[getTaskIndex(uuid)].active = true;

}


function toggleActiveTask(uuid) {
    
    drawInActiveTask();
    drawActiveTask(uuid);
    makeTaskActive(uuid);
    saveData();

}


function toggleTasksPanel() {

    const tasks = Array.from(document.querySelectorAll("#tasks-panel a"));
    if (tasks.length) {
        for (let task of tasks) {
            if (task.style.display == "block" || task.style.display == "") {
                task.style.display = "none";
            } else {
                task.style.display = "block";
            };
        };
    };

}


function clearTasksPanel() {

    const panel = document.querySelector("#tasks-panel .panel-heading");
    const allSiblings = [...panel.parentElement.children].filter(child => child !== panel);
    allSiblings.forEach(el => {
        el.remove();
    });
    document.getElementById("tasks-count").textContent = "0";

}


function getCurrentPageTasks() {

    const activeGroup = getActiveGroup();
    if (activeGroup.tasks.length <= settings.tasksPerPage) {
        settings.pagesCount = 1;
        settings.currentPage = 1;
    } else {
        settings.pagesCount = Math.ceil(activeGroup.tasks.length / settings.tasksPerPage);
        if (settings.currentPage > settings.pagesCount) {
            settings.currentPage = settings.pagesCount;
        };
    };
    if (settings.currentPage == 0) {
        settings.currentPage = 1;
    };
    const startItem = settings.currentPage * settings.tasksPerPage - settings.tasksPerPage;
    const endItem = startItem + settings.tasksPerPage;
    const outputList = activeGroup.tasks.slice(startItem, endItem);
    return outputList;

}


function changePage() {

    const outputList = getCurrentPageTasks();
    makeTaskActive(outputList[0].uuid);
    updateTasksList();

}


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
                document.getElementById(el.uuid).addEventListener("click", task => {
                    task.stopPropagation();
                    toggleActiveTask(el.uuid);
                }, false);
            });
        } else {
            settings.currentPage = 0;
            settings.pagesCount = 0;
        };
        pagination.textContent = `${settings.currentPage} of ${settings.pagesCount}`;
    };

}


function addGroup() {

    const groupModal = new GroupModal(modalMode.add, localDB);
    groupModal.show();

};


function editGroup() {

    if (getActiveGroup()) {
        const groupModal = new GroupModal(modalMode.edit, localDB);
        groupModal.show();
    };

};


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


function clearGroups() {

    if (localDB.length) {
        const pagination = document.getElementById("pagination");
        localStorage.clear();
        localDB = [];
        clearGroupsPanel();
        clearTasksPanel();
        settings.currentPage = 0;
        settings.pagesCount = 0;
        pagination.textContent = `${settings.currentPage} of ${settings.pagesCount}`;
    };

};


function addTask() {

    const taskModal = new TaskModal(modalMode.add);
    taskModal.show();

};


function editTask() {

    if (getActiveTask()) {
        const taskModal = new TaskModal(modalMode.edit);
        taskModal.show();
    };

};


function deleteTask() {

    const activeGroup = getActiveGroup();
    if (activeGroup && activeGroup.tasks.length) {
        const activeTaskID = getActiveTask().uuid;
        const currentActiveIndex = getTaskIndex(activeTaskID);
        const tasksCount = document.getElementById("tasks-count");
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
        tasksCount.textContent = activeGroup.tasks.length;
        updateTasksList();
    };

};


function clearTasks() {

    const activeGroup = getActiveGroup();
    if (activeGroup && activeGroup.tasks.length) {
        const pagination = document.getElementById("pagination");
        activeGroup.tasks.length = 0;
        saveData();
        clearTasksPanel();
        settings.currentPage = 0;
        settings.pagesCount = 0;
        pagination.textContent = `${settings.currentPage} of ${settings.pagesCount}`;
    };

};


function showSettings() {

    const settingsModal = new SettingsModal(settings);
    settingsModal.show();

}


function showAbout() {

    const aboutModal = new AboutModal(helpContext);
    aboutModal.show();
    
};


function moveToFirstPage() {

    if (settings.pagesCount > 0) {
        settings.currentPage = 1;
        changePage();
    };

};


function moveToPreviousPage() {

    if (settings.currentPage > 1) {
        settings.currentPage -= 1;
        changePage();
    };

};


function moveToNextPage() {

    if (settings.currentPage < settings.pagesCount) {
        settings.currentPage += 1;
        changePage();
    };

};


function moveToLastPage() {

    if (settings.pagesCount > 0) {
        settings.currentPage = settings.pagesCount;
        changePage();
    };

};


export {
    saveData, 
    changePage, 
    getActiveGroup, 
    groupExists, 
    getGroupIndex, 
    toggleActiveGroup, 
    getActiveTask, 
    getTaskIndex, 
    updateTasksList
};
