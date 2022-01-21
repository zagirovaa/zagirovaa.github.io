export default class MessageBox {

    message;

    static show(message) {
        this.message = message;
        document.getElementById("app").insertAdjacentHTML("beforeend", this.render());
        document.getElementById("message-modal-close").addEventListener("click", this.close);
    };
    static close() {
        document.getElementById("message-modal").remove();
    };
    static render() {
        return `
            <div class="modal is-active" id="message-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">MyTasks</p>
                        <button class="delete" aria-label="close" id="message-modal-close"></button>
                    </header>
                    <section class="modal-card-body has-text-centered">
                        <h6 class="subtitle is-6">${this.message}</h6>
                    </section>
                    <footer class="modal-card-foot"></footer>
                </div>
            </div>
        `;
    };

}