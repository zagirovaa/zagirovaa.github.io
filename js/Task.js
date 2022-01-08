export default class {

    #uuid; #title; #message; #created; #active;
    
    constructor(title, message) {
        this.#uuid = crypto.randomUUID();
        this.#title = title;
        this.#message = message;
        this.#created = new Date().toLocaleString();
        this.#active = false;
    };

    get uuid() {
        return this.#uuid;
    };

    get title() {
        return this.#title;
    };

    set title(title) {
        this.#title = title;
    };

    get message() {
        return this.#message;
    };

    set message(message) {
        this.#message = message;
    };

    get created() {
        return this.#created;
    };

    get active() {
        return this.#active;
    };

    set active(condition) {
        this.#active = condition
    };

    toJSON() {
        return {
            'uuid': this.#uuid,
            'title': this.#title,
            'message': this.#message,
            'created': this.#created,
            'active': this.#active
        };
    };

};