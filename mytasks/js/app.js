import AboutModal from '../components/AboutModal.js';
import GroupModal from '../components/GroupModal.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js', { scope: '.' }).then(reg => {
        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker installed');
        } else if(reg.active) {
            console.log('Service worker active');
        };
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
};

let myTasks = [];

const aboutModalContext = {
    'title': 'About',
    'name': 'MyTasks',
    'version': '0.3.5',
    'developer': 'Zagirov Abdul Askerovich'
};

const MODE = {
    'ADD': 0,
    'EDIT': 1
};

loadData();

document.addEventListener('DOMContentLoaded', () => {
    setMenuItemsEventListeners();
    const navbarBurger = document.querySelector('.navbar-burger');
    navbarBurger.addEventListener('click', () => {
        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle('is-active');
        target.classList.toggle('is-active');
    });
});


function getData() {

    myTasks = JSON.parse(localStorage.getItem('MyTasks')) || [];

};


function saveData() {

    localStorage.setItem('MyTasks', JSON.stringify(myTasks));

};


function loadData() {

    getData();
    if (myTasks.length) {
        const groupsPanel = document.getElementById('groups-panel');
        const activeGroup = getActiveGroup();
        const groupCount = document.getElementById('groups-count');
        const renderText = myTasks.reduce((result, current) => {
            result += `<a id="${current.uuid}" class="panel-block is-radiusless">${current.name}</a>`;
            return result;
        }, '');
        groupsPanel.insertAdjacentHTML('beforeend', renderText);
        drawActiveGroup(activeGroup.uuid);
        groupCount.textContent = myTasks.length;
        myTasks.forEach(el => {
            document.getElementById(el.uuid).addEventListener('click', () => {
                makeGroupActive(el.uuid);
            });
        });
    };

}


function groupExists(name) {

    if (myTasks.length) {
        for (let group = 0; group < myTasks.length; group++) {
            if (myTasks[group].name === name) {
                return true;
            };
        };
    };
    return false;

}


function getActiveGroup() {

    if (myTasks.length) {
        for (let group = 0; group < myTasks.length; group++) {
            if (myTasks[group].active) {
                return myTasks[group];
            };
        };
    };
    return {};

}


function getIndexByUUID(uuid) {

    if (myTasks.length) {
        for (let group = 0; group < myTasks.length; group++) {
            if (myTasks[group].uuid === uuid) {
                return group;
            };
        };
    };
    return -1;

}


function drawActiveGroup(uuid) {

    if (myTasks.length) {
        const activePanelBlock = document.getElementById(uuid);
        activePanelBlock.classList.add('has-background-info', 'has-text-white');
    }

}


function makeGroupActive(uuid) {

    const currentActiveGroup = document.getElementById(getActiveGroup().uuid);
    const newActiveGroup = document.getElementById(uuid);
    currentActiveGroup.classList.remove('has-background-info', 'has-text-white');
    newActiveGroup.classList.add('has-background-info', 'has-text-white');
    myTasks[getIndexByUUID(getActiveGroup().uuid)].active = false;
    myTasks[getIndexByUUID(uuid)].active = true;
    saveData();

};


function setMenuItemsEventListeners() {

    const menuItems = Array.from(document.querySelectorAll('a.navbar-item'));
    menuItems.forEach(el => {
        const menuText = el.textContent;
        switch (menuText) {
            case 'Add new group':
                el.addEventListener('click', addGroup);
                break;
            case 'Edit current group':
                el.addEventListener('click', editGroup);
                break;
            case 'Delete current group':
                el.addEventListener('click', deleteGroup);
                break;
            case 'Clear all groups':
                el.addEventListener('click', clearGroups);
                break;
            case 'Add new task':
                el.addEventListener('click', addTask);
                break;
            case 'Edit current task':
                el.addEventListener('click', editTask);
                break;
            case 'Delete current task':
                el.addEventListener('click', deleteTask);
                break;
            case 'Clear all tasks':
                el.addEventListener('click', clearTasks);
                break;
            case 'About':
                el.addEventListener('click', showAbout);
                break;
            case '&#171;':
                el.addEventListener('click', moveToFirstPage);
                break;
            case '&#8249;':
                el.addEventListener('click', moveToPreviousPage);
                break;
            case '&#8250;':
                el.addEventListener('click', moveToNextPage);
                break;
            case '&#187;':
                el.addEventListener('click', moveToLastPage);
                break;
        };
    });

};


function addGroup() {

    const groupModal = new GroupModal(MODE.ADD);
    groupModal.show();

};


function editGroup() {

    if (myTasks.length) {
        const groupModal = new GroupModal(MODE.EDIT);
        groupModal.show();
    } else {
        alert('No active group.')
    };

};


function deleteGroup() {

    const activeGroupID = getActiveGroup().uuid;
    const currentActiveIndex = getIndexByUUID(activeGroupID);
    const groupCount = document.getElementById('groups-count');
    if (myTasks.length > 1) {
        if (myTasks[currentActiveIndex - 1]) {
            makeGroupActive(myTasks[currentActiveIndex - 1].uuid);
        } else {
            makeGroupActive(myTasks[currentActiveIndex + 1].uuid);
        };
    };
    document.getElementById(activeGroupID).remove();
    myTasks.splice(currentActiveIndex, 1);
    groupCount.textContent = myTasks.length;
    saveData();
    drawActiveGroup(getActiveGroup().uuid);

};


function clearGroups() {

    localStorage.clear();
    myTasks = [];
    location.reload();

};


function addTask() {

    

};


function editTask() {

    

};


function deleteTask() {

    

};


function clearTasks() {



};


function showAbout() {

    const aboutModal = new AboutModal(aboutModalContext);
    aboutModal.show();
    
};


function moveToFirstPage() {



};


function moveToPreviousPage() {

    

};


function moveToNextPage() {

    

};


function moveToLastPage() {

    

};


export {myTasks, getData, saveData, groupExists, getActiveGroup, getIndexByUUID, makeGroupActive};