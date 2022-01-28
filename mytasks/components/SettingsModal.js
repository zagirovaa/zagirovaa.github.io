import MessageBox from "./MessageBox.js";
import { saveData } from "../js/app.js";


export default class SettingsModal {

    #settings;

    constructor(settings) {
        this.#settings = settings;
    }

    show() {
        const app = document.getElementById("app");
        app.insertAdjacentHTML("beforeend", this.render());
        const settingsModalClose = document.querySelectorAll(".settings-modal-close");
        const settingsModalApplyBtn = document.getElementById("settings-modal-apply");
        settingsModalClose.forEach(el => {
            el.addEventListener("click", this.close, false);
        });
        settingsModalApplyBtn.addEventListener("click", () => {
            this.apply();
        }, false);
    };

    apply() {
        const number = document.getElementById("pages-number");
        if (number.value > 0 && number.value < 51) {
            this.#settings.tasksPerPage = Number(number.value);
            saveData();
            this.close();
            MessageBox.show("Reload the page for the settings to take effect.");
        } else {
            MessageBox.show("Enter a value in the range from 1 to 50.");
        };
    };

    close() {
        document.getElementById("settings-modal").remove();
    };

    render() {
        return `
            <div class="modal is-active" id="settings-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Settings</p>
                        <button class="delete settings-modal-close" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field">
                            <label class="label">Number of tasks per page (maximum 50):</label>
                            <div class="control">
                                <input id="pages-number" class="input" type="number" min="1" max="50" step="1" value="${this.#settings.tasksPerPage}">
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button id="settings-modal-apply" class="button is-success">Apply</button>
                        <button class="button settings-modal-close">Cancel</button>
                    </footer>
                </div>
            </div>
        `;
    };

}