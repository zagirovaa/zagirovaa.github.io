import Group from "../js/Group.js";
import MessageBox from "./MessageBox.js";
import {
    saveData, 
    groupExists, 
    getActiveGroup,
    getGroupIndex, 
    toggleActiveGroup
} from "../js/app.js";


export default class GroupModal {

    #title; #mode; #local_db;
    
    constructor(mode, local_db) {
        this.#mode = mode;
        if (this.#mode) {
            this.#title = "Edit group";
        } else {
            this.#title = "Add group";
        };
        this.#local_db = local_db;
    };

    show() {
        const app = document.getElementById("app");
        app.insertAdjacentHTML("beforeend", this.render());
        const groupModalClose = document.querySelectorAll(".group-modal-close");
        const groupModalApplyBtn = document.getElementById("group-modal-apply");
        const groupModalInput = document.getElementById("group-modal-input");
        groupModalClose.forEach(el => {
            el.addEventListener("click", GroupModal.close);
        });
        groupModalApplyBtn.addEventListener("click", () => {
            this.apply(this.#mode);
        });
        groupModalInput.addEventListener("keyup", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                groupModalApplyBtn.click();
            };
        });
        if (this.#mode) {
            const activeGroup = getActiveGroup();
            groupModalInput.value = activeGroup.name;
        };
        groupModalInput.focus();
    };

    apply(mode) {
        const groupName = document.getElementById("group-modal-input").value.trim() || "";
        if (groupName) {
            if (groupExists(groupName)) {
                MessageBox.show("These is already a group with an identical name.");
            } else {
                if (mode) {
                    const activeGroup = getActiveGroup();
                    const groupModalInput = document.getElementById("group-modal-input");
                    const activePanelBlock = document.getElementById(activeGroup.uuid);
                    const newGroupName = groupModalInput.value;
                    activePanelBlock.textContent = newGroupName;
                    this.#local_db[getGroupIndex(activeGroup.uuid)].name = newGroupName;
                    saveData();
                } else {
                    const newGroup = new Group(groupName);
                    const groupsPanel = document.getElementById("groups-panel");
                    const groupsCount = document.getElementById("groups-count");
                    if (! this.#local_db.length)  {
                        newGroup.active = true;
                    };
                    this.#local_db.push(newGroup);
                    saveData();
                    groupsPanel.insertAdjacentHTML("beforeend", `
                        ${this.#local_db.length == 1 ? 
                        `<a id="${newGroup.uuid}" class="panel-block is-radiusless has-background-info has-text-white">${newGroup.name}</a>` 
                        : `<a id="${newGroup.uuid}" class="panel-block is-radiusless">${newGroup.name}</a>`}
                    `);
                    groupsCount.textContent = this.#local_db.length;
                    document.getElementById(newGroup.uuid).addEventListener("click", el => {
                        toggleActiveGroup(newGroup.uuid);
                    });
                };
                GroupModal.close();
            };
        } else {
            MessageBox.show("You did not enter a group name.");
        };
    };

    static close() {
        document.getElementById("group-modal").remove();
    };

    render() {
        return `
            <div class="modal is-active" id="group-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${this.#title}</p>
                        <button class="delete group-modal-close" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field">
                            <label class="label">Group name:</label>
                            <div class="control">
                                <input id="group-modal-input" class="input" type="text">
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button id="group-modal-apply" class="button is-success">Apply</button>
                        <button class="button group-modal-close">Cancel</button>
                    </footer>
                </div>
            </div>
        `;
    };

}