import { ContainerAsync } from "./containerAsync";

export class ContainerHttpResponse {
    
    /**
     * @param {Function} jsonFunction
     * @param {Function} textFunction
     * @param {Number} status
     * @param {String} statusText
     * @param {Map<String, String>} headers
     * @param {Boolean} ok
     * @param {Response} response
     */
    constructor(jsonFunction, textFunction, blobFunction, status, statusText, headers, ok) {

        /** @type {Function} */
        this.jsonFunction = jsonFunction;

        /** @type {Function} */
        this.textFunction = textFunction;

        /** @type {Function} */
        this.blobFunction = blobFunction;

        /** @type {Number} */
        this.statusValue = status;

        /** @type {String} */
        this.statusTextValue = statusText;

        /** @type {Map<String, String>} */
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
     * @returns {Promise<String>}
     */
    async text() {
        return await this.textFunction.call();
    }

    /**
     * 
     * @returns {Promise<Blob>}
     */
    async blob() {
        return await this.blobFunction.call();
    }

    /**
     * 
     * @returns {Number}
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
     * @returns {Map<String, String>}
     */
    get headers() {
        return this.headersValue;
    }

    /**
     * 
     * @returns {Boolean}
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
        const headers = new Map();
        for (const pair of response.headers.entries()) {
            headers.set(pair[0], pair[1]);
        }
        const jsonPromise = () => response.json();
        const textPromise = () => response.text();
        const blobPromise = () => response.blob();
        return new ContainerHttpResponse(
            jsonPromise,
            textPromise,
            blobPromise,
            response.status,
            response.statusText,
            headers,
            response.ok
        );
    }

    /**
     * 
     * @param {XMLHttpRequest} xhr 
     * @param {Method} progressCallbackMethod
     * @returns {ContainerHttpResponse}
     * 
     */
    static async _fromXhr(xhr, progressCallbackMethod) {
        const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    progressCallbackMethod.call([100]);
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
            return new Promise((resolve, reject) => {
                uploadPromise.then((response) => {
                    resolve(JSON.parse(response));
                }).catch((error) => {
                    reject(error);
                });
            });
        };
        
        const textPromiseFunction = () => {
            return new Promise((resolve, reject) => {
                uploadPromise.then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
            });
        };

        const blobPromiseFunction = () => {
            return new Promise((resolve, reject) => {
                uploadPromise.then((response) => {
                    const blob = new Blob([response]);
                    resolve(blob);
                }).catch((error) => {
                    reject(error);
                });
            });
        };

        const responseHeadersString = xhr.getAllResponseHeaders();
        const headers = new Map();
        if (responseHeadersString) {
            const headerPairs = responseHeadersString.split("\u000d\u000a");
            for (const headerPair of headerPairs) {
                const index = headerPair.indexOf("\u003a\u0020");
                if (index > 0) {
                    const key = headerPair.substring(0, index);
                    const value = headerPair.substring(index + 2);
                    headers.set(key, value);
                }
            }
        }

        await uploadPromise;
        return new ContainerHttpResponse(
            jsonPromiseFunction,
            textPromiseFunction,
            blobPromiseFunction,
            xhr.status,
            xhr.statusText,
            headers,
            xhr.status >= 200 && xhr.status < 300);
    }
}