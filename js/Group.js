import Task from './Task.js';


export default class {

    #uuid; #name; #tasks; #active;
    constructor(name) {
        this.#uuid = crypto.randomUUID();
        this.#name = name;
        this.#tasks = [];
        this.#active = false;
    };
    get uuid() {
        return this.#uuid;
    };
    get name() {
        return this.#name;
    };
    set name(name) {
        this.#name = name;
    };
    get active() {
        return this.#active;
    };
    set active(condition) {
        this.#active = condition;
    };
    getTask(uuid) {
        for (let task in this.#tasks) {
            if (task.uuid === uuid) {
                return task;
            };
        };
    };
    addTask(title, message) {
        let newTask = new Task(title, message);
        this.#tasks.push(newTask);
    };
    editTask(uuid, title, message) {
        let currentTask = this.getTask(uuid);
        if (currentTask) {
            currentTask.title = title;
            currentTask.message = message;
        };
    };
    removeTask(uuid) {
        for (let i = 0; i < this.#tasks.length; i++) {
            if (this.#tasks[i].uuid == uuid) {
                this.#tasks.splice(i, 1);
                break;
            };
        };
    };
    clearTasks() {
        this.#tasks = [];
    };
    toJSON() {
        return {
            'uuid': this.#uuid,
            'name': this.#name,
            'tasks': this.#tasks,
            'active': this.#active
        };
    };

};