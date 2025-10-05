import { ContainerAsync } from "./containerAsync";

export class ContainerHttpResponse {
    
    /**
     * @param {Function<Promise<Object>>} jsonFunction
     * @param {Function<Promise<String>>} textFunction
     * @param {Number} status
     * @param {String} statusText
     * @param {Headers} headers
     * @param {Boolean} ok
     * @param {Response} response
     */
    constructor(jsonFunction, textFunction, status, statusText, headers, ok) {

        /** @type {Function<Promise<Object>>} */
        this.jsonFunction = jsonFunction;

        /** @type {Function<Promise<String>>} */
        this.textFunction = textFunction;

        /** @type {Number} */
        this.statusValue = status;

        /** @type {String} */
        this.statusTextValue = statusText;

        /** @type {Headers} */
        this.headersValue = headers;

        /** @type {Boolean} */
        this.okValue = ok;
    }

    /**
     * 
     * @returns {Promise<Object>}
     */
    async json() {
        return await this.jsonFunction.call();
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    async text() {
        return await this.textFunction.call();
    }

    /**
     * 
     * @returns {number}
     */
    get status() {
        return this.statusValue;
    }

    /**
     * 
     * @returns {string}
     */
    get statusText() {
        return this.statusTextValue;
    }

    /**
     * 
     * @returns {Headers}
     */
    get headers() {
        return this.headersValue;
    }

    /**
     * 
     * @returns {boolean}
     */
    get ok() {
        return this.okValue;
    }

    /**
     * 
     * @param {Promise<Response>} responsePromise
     * @returns {ContainerHttpResponse}
     */
    static async _fromResponse(responsePromise) {

        const response = await responsePromise;
        const jsonPromise = () => response.json();
        const textPromise = () => response.text();
        return new ContainerHttpResponse(
            jsonPromise,
            textPromise,
            response.status,
            response.statusText,
            response.headers,
            response.ok
        );
    }

    /**
     * 
     * @param {XMLHttpRequest} xhr 
     * @returns {ContainerHttpResponse}
     */
    static async _fromXhr(xhr) {
        const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            };
            xhr.ontimeout = () => {
                reject("Request timed out");
            };
        });

        const jsonPromiseFunction = () => {
            uploadPromise.then((response) => {
                resolve(JSON.parse(response));
            }).catch((error) => {
                reject(error);
            });
        };
        
        const textPromiseFunction = () => {
            uploadPromise.then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        }

        return new ContainerHttpResponse(jsonPromiseFunction, textPromiseFunction, xhr.status, xhr.statusText, null, xhr.status >= 200 && xhr.status < 300);
    }
}