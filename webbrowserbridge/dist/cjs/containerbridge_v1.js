'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var coreutil_v1 = require('coreutil_v1');

class ContainerAsync {

    /**
     * @template T
     * @param {number} milliseconds 
     * @param {Promise<T>} promise 
     * @returns {Promise<T>}
     */
    static timeout(milliseconds, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"));
            }, milliseconds);
            promise.then(resolve, reject);
        });
    }

    /**
     * 
     * @param {number} milliseconds 
     * @param {function} callback 
     */
    static delay(milliseconds, callback) {
        return setTimeout(callback, milliseconds);
    }

    /**
     * 
     * @param {long} milliseconds 
     * @returns Promise which resolves when milliseconds have passed
     */
    static pause(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    }
}

class ContainerCredentialsStorage {

    static async store(username, password) {
        if (window.PasswordCredential) {
			const passwordCredential = new PasswordCredential({
				id: username,
				password: password
            });

            //const passwordCredentialsData = new CredentialCreationOptions();
			const credential = await navigator.credentials.store(passwordCredential);
            LOG.info(credential);
            return credential;
        }
        return null;
    }

}

class ContainerDatabaseStorage {

    /**
     * 
     * @param {String} dbName 
     * @param {Number} version
     * @returns {IDBOpenDBRequest}
     */
    static open(dbName, version) {
        return window.indexedDB.open(dbName, version);
    }

}

class ContainerText {

    /**
     * 
     * @param {Text} text 
     */
    constructor(text) {

        /** @type {Text} */
        this.text = text;
    }

    get value() {
        return this.text.nodeValue;
    }

    set value(value) {
        this.text.nodeValue = value;
    }
}

class ContainerFileData {
    
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        this.file = file;
        this.uploadPercentage = 0;
        this.uploadComplete = false;
    }

    get name() {
        return this.file.name;
    }

    get size() {
        return this.file.size;
    }

    get type() {
        return this.file.type;
    }

    get lastModified() {
        return this.file.lastModified;
    }

    /**
     * 
     * @returns {Promise<ArrayBuffer>}
     */
    async toArrayBuffer() {
        return await this.file.arrayBuffer();
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    async toBase64() {
        const arrayBuffer = await this.toArrayBuffer();
        return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }   
}

new coreutil_v1.Logger("ContainerElement");

class ContainerElementUtils {

    /**
     * 
     * @param {string} id 
     */
    static getElementById(id) {
        return new ContainerElement(document.getElementById(id));
    }

    /**
     * 
     * @param {string} valeu 
     */
    static createTextNode(value) {
        return new ContainerText(document.createTextNode(value));
    }

    /**
     * 
     * @param {string} name 
     */
    static createElement(name) {
        return new ContainerElement(document.createElement(name));
    }

    /**
     * 
     * @param {String} id 
     */
    static removeElement(id) {
        const element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }

    /**
     * 
     * @param {string} nameSpace 
     * @param {string} name 
     */
    static createElementNS(nameSpace, name) {
        return new ContainerElement(document.createElementNS(nameSpace, name));
    }

    /**
     * 
     * @param {ContainerElement} containerElement 
     */
    static appendRootUiChild(containerElement) {
        const header = document.getElementsByTagName("body")[0];
        header.appendChild(containerElement.element);
    }


    /**
     * 
     * @param {ContainerElement} containerElement 
     */
     static appendRootMetaChild(containerElement) {
        const header = document.getElementsByTagName("head")[0];
        header.appendChild(containerElement.element);
    }

    /**
     * 
     * @param {ContainerElement} element 
     * @param {String} attributeKey 
     * @param {any} attributeValue 
     */
    static setAttributeValue(element, attributeKey, attributeValue) {
        element.setAttributeValue(attributeKey, attributeValue);
    }

    /**
     * 
     * @param {ContainerElement} element 
     * @param {String} attributeKey 
     */
     static getAttributeValue(element, attributeKey) {
        return element.getAttributeValue(attributeKey);
    }

    /**
     * 
     * @param {ContainerElement} parentElement 
     * @param {ContainerElement} childElement 
     */
    static contains(parentElement, childElement) {
        return parentElement.contains(childElement);
    }

    /**
     * 
     * @param {ContainerElement} element 
     * @returns 
     */
    static isConnected(element) {
        return element.isConnected;
    }

    static isUIElement(value) {
        return value instanceof HTMLElement;
    }

    /**
     * 
     * @param {ContainerElement} element element to scroll lock
     * @param {Number} x x coordinate to lock to
     * @param {Number} y y coordinate to lock to
     * @param {Number} duration milliseconds
     */
    static scrollLockTo(element, x, y, duration) {
        const scrollTo = (event) => {
            event.target.scrollTo(x,y);
        };
        element.addEventListener("scroll", scrollTo);
        coreutil_v1.TimePromise.asPromise(duration, () => {
            element.removeEventListener("scroll", scrollTo);
        });
    }

    static toFileDataArray(fileList) {
        const array = [];
        for (const file of fileList) {
            array.push(new ContainerFileData(file));
        }
        return array;
    }

}

class ContainerEvent {

    /**
     * 
     * @param {Event} event 
     */
    constructor(event){

        /** @type {Event} */
        this.event = event;
        if (this.event.type.toLowerCase() == "dragstart"){
            this.event.dataTransfer.setData('text/plain', null);
        }
    }

    stopPropagation(){
        this.event.stopPropagation();
    }

    preventDefault(){
        this.event.preventDefault();
    }

    /**
     * @returns {ContainerFileData[]}
     */
    get files() {
        if (this.event.target && this.event.target.files) {
            /** @type {HTMLInputElement} */
            const target = this.event.target;
            return ContainerElementUtils.toFileDataArray(target.files);
        }
        if (this.event.dataTransfer) {
            /** @type {DataTransfer} */
            const dataTransfer = this.event.dataTransfer;
            if (dataTransfer.files) {
                return ContainerElementUtils.toFileDataArray(dataTransfer.files);
            }
        }
        return [];
    }

    /**
     * The distance between the event and the edge x coordinate of the containing object
     */
    get offsetX(){
        return this.event.offsetX;
    }

    /**
     * The distance between the event and the edge y coordinate of the containing object
     */
    get offsetY(){
        return this.event.offsetY;
    }

    /**
     * The mouse x coordinate of the event relative to the client window view
     */
    get clientX(){
        return this.event.clientX;
    }

    /**
     * The mouse y coordinate of the event relative to the client window view
     */
    get clientY(){
        return this.event.clientY;
    }

    /**
     * 
     * @returns {ContainerElement}
     */
    get target(){
        if (this.event && this.event.target) {
            return new ContainerElement(this.event.target);
        }
    }

    /**
     * 
     * @returns {ContainerElement}
     */
    get relatedTarget(){
        if (this.event && this.event.relatedTarget) {
            return new ContainerElement(this.event.relatedTarget);
        }
        return null;
    }

    /**
     * 
     * @returns {string}
     */
     getRelatedTargetAttribute(attributeName){
        if (this.event.relatedTarget) {
            return new ContainerElement(this.event.relatedTarget).getAttributeValue(attributeName);
        }
        return null;
    }

    get targetValue(){
        if(this.target) { 
            return this.target.value;
        }
        return null;
    }

    get keyCode() {
        return this.event.keyCode;
    }

    isKeyCode(code) {
        return this.event.keyCode === code;
    }

}

class ContainerElement {
 
    /**
     * 
     * @param {HTMLElement} element
     */
    constructor(element) {

        /** @type {HTMLElement} */
        this.element = element;
    }
    
    /**
     * Checks if the current element contains the specified child element.
     * @param {ContainerElement} childElement 
     * @returns {boolean}
     */
    contains(childElement) {
        return this.element.contains(childElement.element);
    }

    /**
     * Gets the value of the specified attribute from the element.
     * @param {string} attributeKey 
     * @returns {string}
     */
    getAttributeValue(attributeKey) {
        return this.element.getAttribute(attributeKey);
    }

    /**
     * Sets the value of the specified attribute on the element.
     * @param {string} attributeKey 
     * @param {string} attributeValue 
     */
    setAttributeValue(attributeKey, attributeValue) {
        this.element.setAttribute(attributeKey, attributeValue);
    }

    removeAttribute(attributeKey) {
        this.element.removeAttribute(attributeKey);
    }

    hasAttribute(attributeKey) {
        return this.element.hasAttribute(attributeKey);
    }

    get id() {
        return this.getAttributeValue("id");
    }

    get className() {
        return this.getAttributeValue("class");
    }

    get innerText() {
        return this.element.innerText;
    }

    set innerText(value) {
        this.element.innerText = value;
    }

    get innerHTML() {
        return this.element.innerHTML;
    }

    set innerHTML(value) {
        this.element.innerHTML = value;
    }

    get value() {
        return this.element.value;
    }

    set value(value) {
        this.element.value = value;
    }

    get disabled() {
        return this.element.disabled;
    }

    set disabled(value) {
        this.element.disabled = value;
    }

    get style() {
        return this.element.style;
    }

    set style(value) {
        this.element.style = value;
    }

    get isConnected() {
        return this.element.isConnected;
    }

    /**
     * 
     * @param {string} eventType 
     * @param {Method} listener 
     * @param {boolean} capture 
     */
    addEventListener(eventType, listener, capture) {
        const convertToContainerEventListener = (event) => {
            listener.call(new ContainerEvent(event));
        };
        this.element.addEventListener(eventType, convertToContainerEventListener, capture);
    }

    get name() {
        return this.element.name;
    }

    set name(value) {
        this.element.name = value;
    }

    get type() {
        return this.element.type;
    }

    set type(value) {
        this.element.type = value;
    }

    get text() {
        return this.element.text;
    }

    set text(value) {
        this.element.text = value;
    }

    get tagName() {
        return this.element.tagName;
    }

    get offsetWidth() {
        return this.element.offsetWidth;
    }

    get offsetHeight() {
        return this.element.offsetHeight;
    }

    get boundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    /**
     * 
     * @returns {ContainerElement}
     */
    get parentNode() {
        if(this.element.parentNode) {
            return new ContainerElement(this.element.parentNode);
        }
        return null;
    }

    /**
     * 
     * @param {ContainerElement} childElement 
     */
    appendChild(childElement) {
        if (childElement instanceof ContainerElement) {
            this.element.appendChild(childElement.element);
        }
        if (childElement instanceof ContainerText) {
            this.element.appendChild(childElement.text);
        }
    }

    /**
     * 
     * @param {ContainerElement} childElement 
     */
    removeChild(childElement) {
        this.element.removeChild(childElement.element);
    }

    /**
     * 
     * @param {ContainerElement} replacement
     * @param {ContainerElement} toReplace
     */
    replaceChild(replacement, toReplace) {
        this.element.replaceChild(replacement.element, toReplace.element);
    }


    get firstChild() {
        if(this.element.firstChild) {
            return new ContainerElement(this.element.firstChild);
        }
        return null;
    }

    get lastChild() {
        if(this.element.lastChild) {
            return new ContainerElement(this.element.lastChild);
        }
        return null;
    }

    focus() {
        this.element.focus();
    }

    select() {
        if(this.element.select) {
            this.element.select();
        }
    }

    get checked() {
        return this.element.checked;
    }

    set checked(value) {
        this.element.checked = value;
    }

    submit() {
        if(this.element.submit) {
            return this.element.submit();
        }
    }

    click() {
        this.element.click();
    }

    dispatchEvent(event) {
        return this.element.dispatchEvent(new InputEvent(event));
    }

    playMuted() {
        if (this.element.play) {
            this.element.muted = true;
            return this.element.play();
        }
        return null;
    }

    mute() {
        if(this.element.mute) {
            this.element.muted = true;
        }
    }

    unmute() {
        if(this.element.unmute) {
            this.element.muted = false;
        }
    }

    play() {
        if (this.element.play) {
            return this.element.play();
        }
        return null;
    }

    pause() {
        if(this.element.pause) {
            return this.element.pause();
        }
        return null;
    }
}

class ContainerHttpResponse {
    
    /**
     * @param {Function} jsonFunction
     * @param {Function} textFunction
     * @param {Number} status
     * @param {String} statusText
     * @param {Map<String, String>} headers
     * @param {Boolean} ok
     * @param {Response} response
     */
    constructor(jsonFunction, textFunction, status, statusText, headers, ok) {

        /** @type {Function} */
        this.jsonFunction = jsonFunction;

        /** @type {Function} */
        this.textFunction = textFunction;

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
        return new ContainerHttpResponse(
            jsonPromise,
            textPromise,
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
        return new ContainerHttpResponse(jsonPromiseFunction, textPromiseFunction, xhr.status, xhr.statusText, headers, xhr.status >= 200 && xhr.status < 300);
    }
}

class ContainerUploadData {

    /**
     * 
     */
    constructor() {
        /** @type {Map<String, ContainerFileData>} */
        this.filesMap = new Map();

        /** @type {Map<String, String>} */
        this.parameterMap = new Map();
    }

    /**
     * 
     * @param {ContainerFileData[]} files 
     * @returns {ContainerUploadData}
     */
    static fromFiles(files) {
        const uploadData = new ContainerUploadData();
        for (const file of files) {
            uploadData.withFile(file.name, file);
        }
        return uploadData;
    }

    /**
     * 
     * @param {String} name 
     * @param {ContainerFileData} fileData 
     * @return {ContainerUploadData}
     */
    withFile(name, fileData) {
        this.filesMap.set(name, fileData);
        return this;
    }

    withParameter(name, value) {
        this.parameterMap.set(name, value);
        return this;
    }

    _asFormData() {
        const formData = new FormData();
        for (const file of this.filesMap.values()) {
            formData.append('file', file.file, file.name);
        }
        if (this.parameterMap.size > 0) {
            for (const key of this.parameterMap.keys()) {
                formData.append(key, this.parameterMap.get(key));
            }
        }
        return formData;
    }

    /**
     * 
     * @returns {ContainerFileData[]}
     */
    get files() {
        return Array.from(this.filesMap.values());
    }
}

new coreutil_v1.Logger("ContainerHttpClient");

class ContainerHttpClient {

    /**
     * 
     * @param {String} url 
     * @param {Object} params 
     * @param {Number} timeout
     * @return {Promise<ContainerHttpResponse>}
     */
    static async fetch(url, params, timeout = 4000) {
        const responsePromise = fetch(url, params);
        return ContainerHttpResponse._fromResponse(responsePromise, timeout);
    }

    /**
     * 
     * @param {String} method
     * @param {String} url 
     * @param {ContainerUploadData} containerUploadData 
     * @param {Method} progressCallbackMethod 
     * @param {Number} timeout 
     * @returns 
     */
    static async xhr(method, url, containerUploadData, authentication = null, progressCallbackMethod = null, timeout = 4000) {

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = timeout;
        xhr.setRequestHeader("Accept", "application/json");
        if (authentication) {
            xhr.setRequestHeader("Authorization", authentication);
        }
        xhr.onprogress = (event) => {
            progressCallbackMethod.call([Math.round((event.loaded / event.total) * 100)]);
        };
        xhr.ontimeout = () => {
            return Promise.reject("Request timed out");
        };

        const formData = containerUploadData._asFormData();
        xhr.send(formData);
        return ContainerHttpResponse._fromXhr(xhr, progressCallbackMethod);
    }

    /**
     * 
     * @param {Method} progressCallbackMethod 
     * @param {Number} loaded 
     * @param {Number} total 
     */
    callProgressCallbackMethod(progressCallbackMethod, loaded, total) {
        if (progressCallbackMethod) {
            progressCallbackMethod.call(loaded, total);
        }
    }
}

class ContainerLocalStorage {

    static setLocalAttribute(key, value) {
        window.localStorage.setItem(key,value);
    }

    static removeLocalAttribute(key) {
        window.localStorage.removeItem(key);
    }

    static hasLocalAttribute(key) {
        return window.localStorage.getItem(key) !== null;
    }

    static getLocalAttribute(key) {
        return window.localStorage.getItem(key);
    }


}

new coreutil_v1.Logger("ContainerSessionStorage");

class ContainerSessionStorage {

    static setSessionAttribute(key, value) {
        window.sessionStorage.setItem(key,value);
    }

    static removeSessionAttribute(key) {
        window.sessionStorage.removeItem(key);
    }

    static getSessionAttribute(key) {
        return window.sessionStorage.getItem(key);
    }

    static hasSessionAttribute(key) {
        return window.sessionStorage.getItem(key) !== null;
    }

    static setLocalAttribute(key, value) {
        window.localStorage.setItem(key,value);
    }


}

class ContainerWindow {

    /**
     * 
     * @param {String} type 
     * @param {Method} listener 
     * @return {Method} destroy function
     */    
    static addEventListener(type, method) {
        const func = (event) => {
            method.call(new ContainerEvent(event));
        };
        window.addEventListener(type, func);
        return () => { window.removeEventListener(type, func); }
    }
    
}

new coreutil_v1.Logger("ContainerUrl");

class ContainerUrl {

    /**
     * 
     * @param {String} urlString 
     */
    static go(urlString) {
        window.location = urlString;
    }

    static back() {
        window.history.back();
    }


     /**
     * 
     * @param {Object} stateObject 
     * @param {String} title 
     * @param {String} urlString 
     */
    static replaceUrl(urlString, title, stateObject) {
        window.history.replaceState(stateObject, title, urlString);
    }

    /**
     * 
     * @param {Object} stateObject 
     * @param {String} title 
     * @param {String} urlString 
     */
    static pushUrl(urlString, title, stateObject) {
        window.history.pushState(stateObject, title, urlString);
    }

    /**
     * @returns {String}
     */
    static currentUrl() {
        return window.location.href;
    }

    /**
     * 
     * @param {Method} method
     */
    static addUserNavigateListener(method) {
        ContainerWindow.addEventListener("popstate", method);
    }
}

exports.ContainerAsync = ContainerAsync;
exports.ContainerCredentialsStorage = ContainerCredentialsStorage;
exports.ContainerDatabaseStorage = ContainerDatabaseStorage;
exports.ContainerElement = ContainerElement;
exports.ContainerElementUtils = ContainerElementUtils;
exports.ContainerEvent = ContainerEvent;
exports.ContainerFileData = ContainerFileData;
exports.ContainerHttpClient = ContainerHttpClient;
exports.ContainerHttpResponse = ContainerHttpResponse;
exports.ContainerLocalStorage = ContainerLocalStorage;
exports.ContainerSessionStorage = ContainerSessionStorage;
exports.ContainerText = ContainerText;
exports.ContainerUploadData = ContainerUploadData;
exports.ContainerUrl = ContainerUrl;
exports.ContainerWindow = ContainerWindow;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckFzeW5jLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJDcmVkZW50aWFsc1N0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckRhdGFiYXNlU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyVGV4dC5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRmlsZURhdGEuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnRVdGlscy5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRXZlbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckh0dHBSZXNwb25zZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyVXBsb2FkRGF0YS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVySHR0cENsaWVudC5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyTG9jYWxTdG9yYWdlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJTZXNzaW9uU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyV2luZG93LmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJVcmwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENvbnRhaW5lckFzeW5jIHtcblxuICAgIC8qKlxuICAgICAqIEB0ZW1wbGF0ZSBUXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge1Byb21pc2U8VD59IHByb21pc2UgXG4gICAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAgICovXG4gICAgc3RhdGljIHRpbWVvdXQobWlsbGlzZWNvbmRzLCBwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInRpbWVvdXRcIikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsYXkobWlsbGlzZWNvbmRzLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2xvbmd9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdoZW4gbWlsbGlzZWNvbmRzIGhhdmUgcGFzc2VkXG4gICAgICovXG4gICAgc3RhdGljIHBhdXNlKG1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyQ3JlZGVudGlhbHNTdG9yYWdlIHtcblxuICAgIHN0YXRpYyBhc3luYyBzdG9yZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5QYXNzd29yZENyZWRlbnRpYWwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkQ3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuXHRcdFx0XHRpZDogdXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vY29uc3QgcGFzc3dvcmRDcmVkZW50aWFsc0RhdGEgPSBuZXcgQ3JlZGVudGlhbENyZWF0aW9uT3B0aW9ucygpO1xuXHRcdFx0Y29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShwYXNzd29yZENyZWRlbnRpYWwpO1xuICAgICAgICAgICAgTE9HLmluZm8oY3JlZGVudGlhbCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyRGF0YWJhc2VTdG9yYWdlIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYk5hbWUgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb25cbiAgICAgKiBAcmV0dXJucyB7SURCT3BlbkRCUmVxdWVzdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgb3BlbihkYk5hbWUsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBDb250YWluZXJUZXh0IHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VGV4dH0gdGV4dCBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0KSB7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtUZXh0fSAqL1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5ub2RlVmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudGV4dC5ub2RlVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lckZpbGVEYXRhIHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0ZpbGV9IGZpbGUgXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZmlsZSkge1xuICAgICAgICB0aGlzLmZpbGUgPSBmaWxlO1xuICAgICAgICB0aGlzLnVwbG9hZFBlcmNlbnRhZ2UgPSAwO1xuICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGUubmFtZTtcbiAgICB9XG5cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZS5zaXplO1xuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlLnR5cGU7XG4gICAgfVxuXG4gICAgZ2V0IGxhc3RNb2RpZmllZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMge1Byb21pc2U8QXJyYXlCdWZmZXI+fVxuICAgICAqL1xuICAgIGFzeW5jIHRvQXJyYXlCdWZmZXIoKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmZpbGUuYXJyYXlCdWZmZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxuICAgICAqL1xuICAgIGFzeW5jIHRvQmFzZTY0KCkge1xuICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHRoaXMudG9BcnJheUJ1ZmZlcigpO1xuICAgICAgICByZXR1cm4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSkpO1xuICAgIH0gICBcbn0iLCJpbXBvcnQgeyBMb2dnZXIsIFRpbWVQcm9taXNlIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJFbGVtZW50IH0gZnJvbSBcIi4vY29udGFpbmVyRWxlbWVudFwiO1xuaW1wb3J0IHsgQ29udGFpbmVyVGV4dCB9IGZyb20gXCIuL2NvbnRhaW5lclRleHRcIjtcbmltcG9ydCB7IENvbnRhaW5lckZpbGVEYXRhIH0gZnJvbSBcIi4vY29udGFpbmVyRmlsZURhdGFcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lckVsZW1lbnRcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFbGVtZW50VXRpbHMge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbGVtZW50QnlJZChpZCkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsZXUgXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZVRleHROb2RlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyVGV4dChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVtb3ZlRWxlbWVudChpZCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVTcGFjZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudE5TKG5hbWVTcGFjZSwgbmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVTcGFjZSwgbmFtZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcbiAgICAgKi9cbiAgICBzdGF0aWMgYXBwZW5kUm9vdFVpQ2hpbGQoY29udGFpbmVyRWxlbWVudCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtZW50LmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxuICAgICAqL1xuICAgICBzdGF0aWMgYXBwZW5kUm9vdE1ldGFDaGlsZChjb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lckVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICogQHBhcmFtIHthbnl9IGF0dHJpYnV0ZVZhbHVlIFxuICAgICAqL1xuICAgIHN0YXRpYyBzZXRBdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICovXG4gICAgIHN0YXRpYyBnZXRBdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IHBhcmVudEVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgc3RhdGljIGNvbnRhaW5zKHBhcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gcGFyZW50RWxlbWVudC5jb250YWlucyhjaGlsZEVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gZWxlbWVudCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBzdGF0aWMgaXNDb25uZWN0ZWQoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5pc0Nvbm5lY3RlZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNVSUVsZW1lbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IGVsZW1lbnQgdG8gc2Nyb2xsIGxvY2tcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCB4IGNvb3JkaW5hdGUgdG8gbG9jayB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IHkgY29vcmRpbmF0ZSB0byBsb2NrIHRvXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIG1pbGxpc2Vjb25kc1xuICAgICAqL1xuICAgIHN0YXRpYyBzY3JvbGxMb2NrVG8oZWxlbWVudCwgeCwgeSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG8gPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zY3JvbGxUbyh4LHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBzY3JvbGxUbyk7XG4gICAgICAgIFRpbWVQcm9taXNlLmFzUHJvbWlzZShkdXJhdGlvbiwgKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNjcm9sbFRvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHRvRmlsZURhdGFBcnJheShmaWxlTGlzdCkge1xuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZUxpc3QpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IENvbnRhaW5lckZpbGVEYXRhKGZpbGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGFpbmVyRWxlbWVudCB9IGZyb20gXCIuL2NvbnRhaW5lckVsZW1lbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lckVsZW1lbnRVdGlscyB9IGZyb20gXCIuL2NvbnRhaW5lckVsZW1lbnRVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyRXZlbnQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZXZlbnQpe1xuXG4gICAgICAgIC8qKiBAdHlwZSB7RXZlbnR9ICovXG4gICAgICAgIHRoaXMuZXZlbnQgPSBldmVudDtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQudHlwZS50b0xvd2VyQ2FzZSgpID09IFwiZHJhZ3N0YXJ0XCIpe1xuICAgICAgICAgICAgdGhpcy5ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9wbGFpbicsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcFByb3BhZ2F0aW9uKCl7XG4gICAgICAgIHRoaXMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgcHJldmVudERlZmF1bHQoKXtcbiAgICAgICAgdGhpcy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJGaWxlRGF0YVtdfVxuICAgICAqL1xuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQudGFyZ2V0ICYmIHRoaXMuZXZlbnQudGFyZ2V0LmZpbGVzKSB7XG4gICAgICAgICAgICAvKiogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9ICovXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHJldHVybiBDb250YWluZXJFbGVtZW50VXRpbHMudG9GaWxlRGF0YUFycmF5KHRhcmdldC5maWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgICAgICAvKiogQHR5cGUge0RhdGFUcmFuc2Zlcn0gKi9cbiAgICAgICAgICAgIGNvbnN0IGRhdGFUcmFuc2ZlciA9IHRoaXMuZXZlbnQuZGF0YVRyYW5zZmVyO1xuICAgICAgICAgICAgaWYgKGRhdGFUcmFuc2Zlci5maWxlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb250YWluZXJFbGVtZW50VXRpbHMudG9GaWxlRGF0YUFycmF5KGRhdGFUcmFuc2Zlci5maWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBldmVudCBhbmQgdGhlIGVkZ2UgeCBjb29yZGluYXRlIG9mIHRoZSBjb250YWluaW5nIG9iamVjdFxuICAgICAqL1xuICAgIGdldCBvZmZzZXRYKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50Lm9mZnNldFg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGV2ZW50IGFuZCB0aGUgZWRnZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNvbnRhaW5pbmcgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0IG9mZnNldFkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQub2Zmc2V0WTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbW91c2UgeCBjb29yZGluYXRlIG9mIHRoZSBldmVudCByZWxhdGl2ZSB0byB0aGUgY2xpZW50IHdpbmRvdyB2aWV3XG4gICAgICovXG4gICAgZ2V0IGNsaWVudFgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQuY2xpZW50WDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbW91c2UgeSBjb29yZGluYXRlIG9mIHRoZSBldmVudCByZWxhdGl2ZSB0byB0aGUgY2xpZW50IHdpbmRvdyB2aWV3XG4gICAgICovXG4gICAgZ2V0IGNsaWVudFkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQuY2xpZW50WTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgdGFyZ2V0KCl7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQodGhpcy5ldmVudC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMge0NvbnRhaW5lckVsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0IHJlbGF0ZWRUYXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC5yZWxhdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQodGhpcy5ldmVudC5yZWxhdGVkVGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgICBnZXRSZWxhdGVkVGFyZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpe1xuICAgICAgICBpZiAodGhpcy5ldmVudC5yZWxhdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQodGhpcy5ldmVudC5yZWxhdGVkVGFyZ2V0KS5nZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgdGFyZ2V0VmFsdWUoKXtcbiAgICAgICAgaWYodGhpcy50YXJnZXQpIHsgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGtleUNvZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50LmtleUNvZGU7XG4gICAgfVxuXG4gICAgaXNLZXlDb2RlKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQua2V5Q29kZSA9PT0gY29kZTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyRXZlbnQgfSBmcm9tIFwiLi9jb250YWluZXJFdmVudFwiO1xuaW1wb3J0IHsgQ29udGFpbmVyVGV4dCB9IGZyb20gXCIuL2NvbnRhaW5lclRleHRcIjtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckVsZW1lbnQge1xuIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IGVsZW1lbnQgY29udGFpbnMgdGhlIHNwZWNpZmllZCBjaGlsZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gY2hpbGRFbGVtZW50IFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNvbnRhaW5zKGNoaWxkRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNvbnRhaW5zKGNoaWxkRWxlbWVudC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlS2V5IFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVWYWx1ZSBcbiAgICAgKi9cbiAgICBzZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSk7XG4gICAgfVxuXG4gICAgaGFzQXR0cmlidXRlKGF0dHJpYnV0ZUtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIGdldCBpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlVmFsdWUoXCJpZFwiKTtcbiAgICB9XG5cbiAgICBnZXQgY2xhc3NOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGVWYWx1ZShcImNsYXNzXCIpO1xuICAgIH1cblxuICAgIGdldCBpbm5lclRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaW5uZXJUZXh0O1xuICAgIH1cblxuICAgIHNldCBpbm5lclRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBpbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHNldCBpbm5lckhUTUwodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRpc2FibGVkO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgc3R5bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuc3R5bGU7XG4gICAgfVxuXG4gICAgc2V0IHN0eWxlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pc0Nvbm5lY3RlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBsaXN0ZW5lciBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNhcHR1cmUgXG4gICAgICovXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnRUb0NvbnRhaW5lckV2ZW50TGlzdGVuZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwobmV3IENvbnRhaW5lckV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjb252ZXJ0VG9Db250YWluZXJFdmVudExpc3RlbmVyLCBjYXB0dXJlKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYW1lO1xuICAgIH1cblxuICAgIHNldCBuYW1lKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5uYW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudHlwZTtcbiAgICB9XG5cbiAgICBzZXQgdHlwZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQudHlwZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB0ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnRleHQ7XG4gICAgfVxuXG4gICAgc2V0IHRleHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGFnTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50YWdOYW1lO1xuICAgIH1cblxuICAgIGdldCBvZmZzZXRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBnZXQgb2Zmc2V0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9XG5cbiAgICBnZXQgYm91bmRpbmdDbGllbnRSZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCBwYXJlbnROb2RlKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KHRoaXMuZWxlbWVudC5wYXJlbnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICBhcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkRWxlbWVudCBpbnN0YW5jZW9mIENvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoaWxkRWxlbWVudCBpbnN0YW5jZW9mIENvbnRhaW5lclRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQudGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZChjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkRWxlbWVudC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IHJlcGxhY2VtZW50XG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSB0b1JlcGxhY2VcbiAgICAgKi9cbiAgICByZXBsYWNlQ2hpbGQocmVwbGFjZW1lbnQsIHRvUmVwbGFjZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LmVsZW1lbnQsIHRvUmVwbGFjZS5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIGdldCBmaXJzdENoaWxkKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KHRoaXMuZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgbGFzdENoaWxkKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQubGFzdENoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQodGhpcy5lbGVtZW50Lmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIHNlbGVjdCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnNlbGVjdCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGNoZWNrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2hlY2tlZDtcbiAgICB9XG5cbiAgICBzZXQgY2hlY2tlZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2hlY2tlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnN1Ym1pdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5zdWJtaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsaWNrKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xpY2soKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgSW5wdXRFdmVudChldmVudCkpO1xuICAgIH1cblxuICAgIHBsYXlNdXRlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5wbGF5KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbXV0ZSgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50Lm11dGUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5tdXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bm11dGUoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC51bm11dGUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5wbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnBhdXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufSIsImltcG9ydCB7IENvbnRhaW5lckFzeW5jIH0gZnJvbSBcIi4vY29udGFpbmVyQXN5bmNcIjtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckh0dHBSZXNwb25zZSB7XG4gICAgXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0ganNvbkZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGV4dEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0dXNUZXh0XG4gICAgICogQHBhcmFtIHtNYXA8U3RyaW5nLCBTdHJpbmc+fSBoZWFkZXJzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBva1xuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoanNvbkZ1bmN0aW9uLCB0ZXh0RnVuY3Rpb24sIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgb2spIHtcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLmpzb25GdW5jdGlvbiA9IGpzb25GdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xuICAgICAgICB0aGlzLnRleHRGdW5jdGlvbiA9IHRleHRGdW5jdGlvbjtcblxuICAgICAgICAvKiogQHR5cGUge051bWJlcn0gKi9cbiAgICAgICAgdGhpcy5zdGF0dXNWYWx1ZSA9IHN0YXR1cztcblxuICAgICAgICAvKiogQHR5cGUge1N0cmluZ30gKi9cbiAgICAgICAgdGhpcy5zdGF0dXNUZXh0VmFsdWUgPSBzdGF0dXNUZXh0O1xuXG4gICAgICAgIC8qKiBAdHlwZSB7TWFwPFN0cmluZywgU3RyaW5nPn0gKi9cbiAgICAgICAgdGhpcy5oZWFkZXJzVmFsdWUgPSBoZWFkZXJzO1xuXG4gICAgICAgIC8qKiBAdHlwZSB7Qm9vbGVhbn0gKi9cbiAgICAgICAgdGhpcy5va1ZhbHVlID0gb2s7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn1cbiAgICAgKi9cbiAgICBhc3luYyBqc29uKCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5qc29uRnVuY3Rpb24uY2FsbCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59XG4gICAgICovXG4gICAgYXN5bmMgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMudGV4dEZ1bmN0aW9uLmNhbGwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1c1ZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0YXR1c1RleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1c1RleHRWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7TWFwPFN0cmluZywgU3RyaW5nPn1cbiAgICAgKi9cbiAgICBnZXQgaGVhZGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyc1ZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGdldCBvaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2tWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Byb21pc2U8UmVzcG9uc2U+fSByZXNwb25zZVByb21pc2VcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVySHR0cFJlc3BvbnNlfVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBfZnJvbVJlc3BvbnNlKHJlc3BvbnNlUHJvbWlzZSkge1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2VQcm9taXNlO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcmVzcG9uc2UuaGVhZGVycy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KHBhaXJbMF0sIHBhaXJbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGpzb25Qcm9taXNlID0gKCkgPT4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBjb25zdCB0ZXh0UHJvbWlzZSA9ICgpID0+IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJIdHRwUmVzcG9uc2UoXG4gICAgICAgICAgICBqc29uUHJvbWlzZSxcbiAgICAgICAgICAgIHRleHRQcm9taXNlLFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICByZXNwb25zZS5va1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhociBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gcHJvZ3Jlc3NDYWxsYmFja01ldGhvZFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJIdHRwUmVzcG9uc2V9XG4gICAgICogXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIF9mcm9tWGhyKHhociwgcHJvZ3Jlc3NDYWxsYmFja01ldGhvZCkge1xuICAgICAgICBjb25zdCB1cGxvYWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLmNhbGwoWzEwMF0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBqc29uUHJvbWlzZUZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBjb25zdCB0ZXh0UHJvbWlzZUZ1bmN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICBpZiAocmVzcG9uc2VIZWFkZXJzU3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJQYWlycyA9IHJlc3BvbnNlSGVhZGVyc1N0cmluZy5zcGxpdChcIlxcdTAwMGRcXHUwMDBhXCIpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBoZWFkZXJQYWlyIG9mIGhlYWRlclBhaXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBoZWFkZXJQYWlyLmluZGV4T2YoXCJcXHUwMDNhXFx1MDAyMFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGhlYWRlclBhaXIuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBoZWFkZXJQYWlyLnN1YnN0cmluZyhpbmRleCArIDIpO1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdXBsb2FkUHJvbWlzZTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJIdHRwUmVzcG9uc2UoanNvblByb21pc2VGdW5jdGlvbiwgdGV4dFByb21pc2VGdW5jdGlvbiwgeGhyLnN0YXR1cywgeGhyLnN0YXR1c1RleHQsIGhlYWRlcnMsIHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDb250YWluZXJGaWxlRGF0YSB9IGZyb20gXCIuL2NvbnRhaW5lckZpbGVEYXRhLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJVcGxvYWREYXRhIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiogQHR5cGUge01hcDxTdHJpbmcsIENvbnRhaW5lckZpbGVEYXRhPn0gKi9cbiAgICAgICAgdGhpcy5maWxlc01hcCA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKiogQHR5cGUge01hcDxTdHJpbmcsIFN0cmluZz59ICovXG4gICAgICAgIHRoaXMucGFyYW1ldGVyTWFwID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRmlsZURhdGFbXX0gZmlsZXMgXG4gICAgICogQHJldHVybnMge0NvbnRhaW5lclVwbG9hZERhdGF9XG4gICAgICovXG4gICAgc3RhdGljIGZyb21GaWxlcyhmaWxlcykge1xuICAgICAgICBjb25zdCB1cGxvYWREYXRhID0gbmV3IENvbnRhaW5lclVwbG9hZERhdGEoKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICB1cGxvYWREYXRhLndpdGhGaWxlKGZpbGUubmFtZSwgZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVwbG9hZERhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgXG4gICAgICogQHBhcmFtIHtDb250YWluZXJGaWxlRGF0YX0gZmlsZURhdGEgXG4gICAgICogQHJldHVybiB7Q29udGFpbmVyVXBsb2FkRGF0YX1cbiAgICAgKi9cbiAgICB3aXRoRmlsZShuYW1lLCBmaWxlRGF0YSkge1xuICAgICAgICB0aGlzLmZpbGVzTWFwLnNldChuYW1lLCBmaWxlRGF0YSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdpdGhQYXJhbWV0ZXIobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJNYXAuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2FzRm9ybURhdGEoKSB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiB0aGlzLmZpbGVzTWFwLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlLmZpbGUsIGZpbGUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFyYW1ldGVyTWFwLnNpemUgPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLnBhcmFtZXRlck1hcC5rZXlzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoa2V5LCB0aGlzLnBhcmFtZXRlck1hcC5nZXQoa2V5KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1EYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJGaWxlRGF0YVtdfVxuICAgICAqL1xuICAgIGdldCBmaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5maWxlc01hcC52YWx1ZXMoKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckh0dHBSZXNwb25zZSB9IGZyb20gXCIuL2NvbnRhaW5lckh0dHBSZXNwb25zZVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyVXBsb2FkRGF0YSB9IGZyb20gXCIuL2NvbnRhaW5lclVwbG9hZERhdGFcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lckh0dHBDbGllbnRcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJIdHRwQ2xpZW50IHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZW91dFxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8Q29udGFpbmVySHR0cFJlc3BvbnNlPn1cbiAgICAgKi9cbiAgICBzdGF0aWMgYXN5bmMgZmV0Y2godXJsLCBwYXJhbXMsIHRpbWVvdXQgPSA0MDAwKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlUHJvbWlzZSA9IGZldGNoKHVybCwgcGFyYW1zKVxuICAgICAgICByZXR1cm4gQ29udGFpbmVySHR0cFJlc3BvbnNlLl9mcm9tUmVzcG9uc2UocmVzcG9uc2VQcm9taXNlLCB0aW1lb3V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lclVwbG9hZERhdGF9IGNvbnRhaW5lclVwbG9hZERhdGEgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIHhocihtZXRob2QsIHVybCwgY29udGFpbmVyVXBsb2FkRGF0YSwgYXV0aGVudGljYXRpb24gPSBudWxsLCBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kID0gbnVsbCwgdGltZW91dCA9IDQwMDApIHtcblxuICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgICB4aHIudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgaWYgKGF1dGhlbnRpY2F0aW9uKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgYXV0aGVudGljYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbnByb2dyZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLmNhbGwoW01hdGgucm91bmQoKGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKSAqIDEwMCldKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9udGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gY29udGFpbmVyVXBsb2FkRGF0YS5fYXNGb3JtRGF0YSgpO1xuICAgICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gICAgICAgIHJldHVybiBDb250YWluZXJIdHRwUmVzcG9uc2UuX2Zyb21YaHIoeGhyLCBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gcHJvZ3Jlc3NDYWxsYmFja01ldGhvZCBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9hZGVkIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbCBcbiAgICAgKi9cbiAgICBjYWxsUHJvZ3Jlc3NDYWxsYmFja01ldGhvZChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLCBsb2FkZWQsIHRvdGFsKSB7XG4gICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kKSB7XG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLmNhbGwobG9hZGVkLCB0b3RhbCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lckxvY2FsU3RvcmFnZSB7XG5cbiAgICBzdGF0aWMgc2V0TG9jYWxBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXNMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJTZXNzaW9uU3RvcmFnZVwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclNlc3Npb25TdG9yYWdlIHtcblxuICAgIHN0YXRpYyBzZXRTZXNzaW9uQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlU2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0U2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhc1Nlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRMb2NhbEF0dHJpYnV0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksdmFsdWUpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJFdmVudCB9IGZyb20gXCIuL2NvbnRhaW5lckV2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJXaW5kb3cge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IGxpc3RlbmVyIFxuICAgICAqIEByZXR1cm4ge01ldGhvZH0gZGVzdHJveSBmdW5jdGlvblxuICAgICAqLyAgICBcbiAgICBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBtZXRob2QpIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgbWV0aG9kLmNhbGwobmV3IENvbnRhaW5lckV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpOyB9XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJXaW5kb3cgfSBmcm9tIFwiLi9jb250YWluZXJXaW5kb3dcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lclVybFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclVybCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBnbyh1cmxTdHJpbmcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsU3RyaW5nO1xuICAgIH1cblxuICAgIHN0YXRpYyBiYWNrKCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxuXG5cbiAgICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyByZXBsYWNlVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBwdXNoVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3VycmVudFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBtZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkVXNlck5hdmlnYXRlTGlzdGVuZXIobWV0aG9kKSB7XG4gICAgICAgIENvbnRhaW5lcldpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgbWV0aG9kKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIkxvZ2dlciIsIlRpbWVQcm9taXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNLGNBQWMsQ0FBQztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRTtBQUMxQyxRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3JELFlBQVksVUFBVSxDQUFDLFdBQVc7QUFDbEMsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBQztBQUM1QyxhQUFhLEVBQUUsWUFBWSxFQUFDO0FBQzVCLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUMsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFO0FBQ3pDLFFBQVEsT0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLFlBQVksRUFBRTtBQUMvQixRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxP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RTtBQUN6QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxHQUFHO0FBQ3BCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN6QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ2hCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksUUFBUSxHQUFHO0FBQ25CLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN4QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ2hCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksV0FBVyxHQUFHO0FBQ3RCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUN4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TSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQ2xELFFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxHQUFHO0FBQ3hCLFFBQVEsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNwQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUU7QUFDM0MsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdELEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
