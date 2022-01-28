import Task from "../js/Task.js";
import MessageBox from "./MessageBox.js";
import { 
    saveData, 
    getActiveGroup, 
    getActiveTask, 
    getTaskIndex, 
    updateTasksList
} from "../js/app.js";


export default class TaskModal {

    #title; #mode;
    
    constructor(mode) {
        this.#mode = mode;
        if (this.#mode) {
            this.#title = "Edit task";
        } else {
            this.#title = "Add task";
        };
    };

    show() {
        const app = document.getElementById("app");
        app.insertAdjacentHTML("beforeend", this.render());
        const taskModalClose = document.querySelectorAll(".task-modal-close");
        const taskModalApplyBtn = document.getElementById("task-modal-apply");
        const taskModalInput = document.getElementById("task-modal-input");
        const taskModalTextArea = document.getElementById("task-modal-textarea");
        taskModalClose.forEach(el => {
            el.addEventListener("click", this.close, false);
        });
        taskModalApplyBtn.addEventListener("click", () => {
            this.apply(this.#mode);
        }, false);
        taskModalInput.addEventListener("keyup", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                taskModalApplyBtn.click();
            };
        }, false);
        if (this.#mode) {
            const activeTask = getActiveTask();
            taskModalInput.value = activeTask.title;
            taskModalTextArea.value = activeTask.message;
        };
        taskModalInput.focus();
    };

    apply(mode) {
        const taskTitle = document.getElementById("task-modal-input").value.trim() || "";
        const taskMessage = document.getElementById("task-modal-textarea").value.trim() || "";
        if (taskTitle && taskMessage) {
            if (mode) {
                const activeTask = getActiveTask();
                const activeGroup = getActiveGroup();
                activeGroup.tasks[getTaskIndex(activeTask.uuid)].title = taskTitle;
                activeGroup.tasks[getTaskIndex(activeTask.uuid)].message = taskMessage;
                saveData();
                document.querySelector(`#${activeTask.uuid} .title`).textContent = taskTitle;
                document.querySelector(`#${activeTask.uuid} .content`).textContent = taskMessage;
            } else {
                const newTask = new Task(taskTitle, taskMessage);
                const tasksPanel = document.getElementById("tasks-panel");
                const tasksCount = document.getElementById("tasks-count");
                const activeGroup = getActiveGroup();
                if (! activeGroup.tasks.length) {
                    newTask.active = true;
                };
                activeGroup.tasks.push(newTask);
                saveData();
                updateTasksList();
            };
            this.close();
        } else {
            MessageBox.show("You did not fill one of the required fields.");
        };
    };

    close() {
        document.getElementById("task-modal").remove();
    };

    render() {
        return `
            <div class="modal is-active" id="task-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${this.#title}</p>
                        <button class="delete task-modal-close" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field">
                            <label class="label">Task title:</label>
                            <div class="control">
                                <input id="task-modal-input" class="input" type="text">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Task message:</label>
                            <div class="control">
                                <textarea id="task-modal-textarea" class="textarea"></textarea>
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button id="task-modal-apply" class="button is-success">Apply</button>
                        <button class="button task-modal-close">Cancel</button>
                    </footer>
                </div>
            </div>
        `;
    };

}