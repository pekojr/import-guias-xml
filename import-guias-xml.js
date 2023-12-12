const ATTRIBUTE_FETCH = 'fetch';
class ImportGuiasXML extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    setCampoComparacao(campo) {
        this.campoComparacao = campo;
    }

    setRegistros(registros) {
        this.registros = registros;
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
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(this.registros, null, 2);
            this.shadowRoot.appendChild(pre);            
        }
    }

    async confirm() {
        // Aqui você pode fazer a chamada de API para inserir os dados na base de dados
        // ...
        this.postData();
        this.remove();
    }
    postData() {
        const fetchUrl = this.getAttribute(ATTRIBUTE_FETCH);
        if (fetchUrl !== null) {
            this.postDataToUrl(fetchUrl);
        }
    }
    async postDataToUrl(url) {
        this.showLoadingIndicator();
        try {
            const token = urlParams.get('access_token');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    datas: this.getDatas(),
                    uuid: this.getAttribute('uuid'),
                    mes_envio: this.getAttribute('mes-envio')
                })
            });
            const data = await response.json();
            // Evento disparado no encerramento da escolha das datas
            const event = new CustomEvent('fetchCompleted', {
                detail: {
                    'data': data
                }
            });

            this.dispatchEvent(event);

            console.log('Success:', data);
            this.showToast('Datas atualizadas com sucesso!');
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = this.formatErrorMessage(error);            
            this.showToast(errorMessage);
        } finally {
            this.hideLoadingIndicator();
        }
    }
    formatErrorMessage(error) {
        if (error instanceof TypeError) {
            return 'Ocorreu um erro de tipo. Por favor, verifique seus dados.';
        } else if (error instanceof RangeError) {
            return 'Ocorreu um erro de intervalo. Por favor, verifique seus dados.';
        } else if (error instanceof SyntaxError) {
            return 'Ocorreu um erro de sintaxe. Por favor, verifique seu código.';
        } else {
            return 'Ocorreu um erro desconhecido. Por favor, tente novamente.';
        }
    }
}
export default ImportGuiasXML;