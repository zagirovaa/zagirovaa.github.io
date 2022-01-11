import Group from "../js/Group.js";
import { 
        myTasks, 
        saveData, 
        groupExists, 
        getActiveGroup,
        getIndexByUUID,
        makeGroupActive } from "../js/app.js";


export default class GroupModal {

    #title; #mode;
    
    constructor(mode) {
        this.#mode = mode;
        if (this.#mode) {
            this.#title = "Edit group";
        } else {
            this.#title = "Add group";
        };
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
                alert("These is already a group with an identical name.");
            } else {
                if (mode) {
                    const activeGroup = getActiveGroup();
                    const groupModalInput = document.getElementById("group-modal-input");
                    const activePanelBlock = document.getElementById(activeGroup.uuid);
                    const newGroupName = groupModalInput.value;
                    activePanelBlock.textContent = newGroupName;
                    myTasks[getIndexByUUID(activeGroup.uuid)].name = newGroupName;
                    saveData();
                } else {
                    const newGroup = new Group(groupName);
                    const groupPanel = document.getElementById("groups-panel");
                    const groupCount = document.getElementById("groups-count");
                    if (! myTasks.length)  {
                        newGroup.active = true;
                    };
                    myTasks.push(newGroup);
                    saveData();
                    groupPanel.insertAdjacentHTML("beforeend", `
                        ${myTasks.length == 1 ? 
                        `<a id="${newGroup.uuid}" class="panel-block is-radiusless has-background-info has-text-white">${newGroup.name}</a>` 
                        : `<a id="${newGroup.uuid}" class="panel-block is-radiusless">${newGroup.name}</a>`}
                    `);
                    groupCount.textContent = myTasks.length;
                    document.getElementById(newGroup.uuid).addEventListener("click", el => {
                        makeGroupActive(newGroup.uuid);
                    });
                };
                GroupModal.close();
            };
        } else {
            alert("Enter group name.");
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
                        <input id="group-modal-input" class="input" type="text" placeholder="Enter group name">
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