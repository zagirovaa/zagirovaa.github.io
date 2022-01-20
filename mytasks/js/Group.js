export default class Group {

    #uuid; #name; #tasks; #active;
    constructor(name) {
        this.#uuid = "group-" + crypto.randomUUID();
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
    get tasks() {
        return this.#tasks;
    };
    toJSON() {
        return {
            "uuid": this.#uuid,
            "name": this.#name,
            "tasks": this.#tasks,
            "active": this.#active
        };
    };

};