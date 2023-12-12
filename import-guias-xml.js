class ImportGuiasXML extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <input type="file" id="fileInput" accept=".xml">
            <button id="importButton">Importar</button>
            <div id="mappingContainer"></div>
            <button id="confirmButton">Confirmar</button>
        `;
        this.shadowRoot.querySelector('#importButton').addEventListener('click', this.importXML.bind(this));
        this.shadowRoot.querySelector('#confirmButton').addEventListener('click', this.confirm.bind(this));
    }

    async importXML() {
        const fileInput = this.shadowRoot.querySelector('#fileInput');
        const file = fileInput.files[0];
        if (file) {
            const text = await file.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text,"text/xml");
            // Aqui você pode fazer o mapeamento de->para e mostrar na tela
            // ...
        }
    }

    async confirm() {
        // Aqui você pode fazer a chamada de API para inserir os dados na base de dados
        // ...
    }
}
export default(ImportGuiasXML);