export default class AboutModal {

    #title; #name; #version; #developer;
    
    constructor(context) {
        this.#title = context.title;
        this.#name = context.name,
        this.#version = context.version;
        this.#developer = context.developer;
    };
    show() {
        document.getElementById("app").insertAdjacentHTML("beforeend", this.render());
        document.getElementById("about-modal-close").addEventListener("click", this.close);
    };
    close() {
        document.getElementById("about-modal").remove();
    };
    render() {
        return `
            <div class="modal is-active" id="about-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${this.#title}</p>
                        <button class="delete" aria-label="close" id="about-modal-close"></button>
                    </header>
                    <section class="modal-card-body has-text-centered">
                        <h3 class="title is-3">${this.#name}</h3>
                        <h5 class="subtitle is-5">Version ${this.#version}</h5>
                        <h6 class="subtitle is-6">
                            - Created using -<br>
                            Html ✦ Css ✦ Javascript ✦ Bulma
                        </h6>
                        <h6 class="subtitle is-6">
                            - Developer -<br>
                            ${this.#developer}
                        </h6>
                    </section>
                    <footer class="modal-card-foot"></footer>
                </div>
            </div>
        `;
    };

}