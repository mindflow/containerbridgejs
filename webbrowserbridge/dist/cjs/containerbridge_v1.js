'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var coreutil_v1 = require('coreutil_v1');

class ContainerAsync {

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

    get files() {
        if (this.event.target && this.event.target.files) {
            /** @type {HTMLInputElement} */
            const target = this.event.target;
            return target.files;
        }
        if (this.event.dataTransfer) {
            /** @type {DataTransfer} */
            const dataTransfer = this.event.dataTransfer;
            if (dataTransfer.files) {
                return dataTransfer.files;
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
     * @param {ContainerElement} parentElement 
     * @param {ContainerElement} childElement 
     */
     static prependChild(parentElement, childElement) {
        parentElement.prepend(childElement);
    }


    /**
     * 
     * @param {ContainerElement} parentElement 
     * @param {ContainerElement} childElement 
     */
    static appendChild(parentElement, childElement) {
        parentElement.appendChild(childElement);
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

}

class ContainerHttpResponse {
    
    /**
     * 
     * @param {Response} response
     */
    constructor(response) {
        this.response = response;
    }

    /**
     * 
     * @returns {Promise<Object>}
     */
    async json() {
        return await this.response.json();
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    async text() {
        return await this.response.text();
    }

    /**
     * 
     * @returns {number}
     */
    get status() {
        return this.response.status;
    }

    /**
     * 
     * @returns {string}
     */
    get statusText() {
        return this.response.statusText;
    }

    get headers() {
        return this.response.headers;
    }

    get ok() {
        return this.response.ok;
    }

    /**
     * 
     * @param {Response} response
     * @returns {ContainerHttpResponse}
     */
    static async from(response, timeout = 1000) {
        const timeoutResponse = await ContainerAsync.timeout(timeout, response);
        return new ContainerHttpResponse(timeoutResponse);
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
        return ContainerHttpResponse.from(responsePromise, timeout);
    }

    /**
     * 
     * @param {string} url 
     * @param {File[]} files 
     * @param {Method} progressCallbackMethod 
     * @param {Number} timeout 
     * @returns 
     */
    static async upload(url, files, authentication = null, progressCallbackMethod = null, timeout = 4000) {
        const formData = new FormData();
        for (const file of files) {
            formData.append("file", file);
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.timeout = timeout;

        if (authentication) {
            xhr.setRequestHeader("Authorization", "Bearer " + authentication);
        }
        
        xhr.onprogress = (event) => {
            callProgressCallbackMethod(progressCallbackMethod, event.loaded, event.total);
        };
        xhr.ontimeout = () => {
            return Promise.reject("Request timed out");
        };
        const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.ontimeout = () => {
                reject("Request timed out");
            };
        });
        xhr.send(formData);
        return uploadPromise;
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
exports.ContainerHttpClient = ContainerHttpClient;
exports.ContainerHttpResponse = ContainerHttpResponse;
exports.ContainerLocalStorage = ContainerLocalStorage;
exports.ContainerSessionStorage = ContainerSessionStorage;
exports.ContainerText = ContainerText;
exports.ContainerUrl = ContainerUrl;
exports.ContainerWindow = ContainerWindow;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckFzeW5jLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJDcmVkZW50aWFsc1N0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckRhdGFiYXNlU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRXZlbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclRleHQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnRVdGlscy5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVySHR0cFJlc3BvbnNlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJIdHRwQ2xpZW50LmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJMb2NhbFN0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclNlc3Npb25TdG9yYWdlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJXaW5kb3cuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclVybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29udGFpbmVyQXN5bmMge1xuXG4gICAgc3RhdGljIHRpbWVvdXQobWlsbGlzZWNvbmRzLCBwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInRpbWVvdXRcIikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsYXkobWlsbGlzZWNvbmRzLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2xvbmd9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdoZW4gbWlsbGlzZWNvbmRzIGhhdmUgcGFzc2VkXG4gICAgICovXG4gICAgc3RhdGljIHBhdXNlKG1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyQ3JlZGVudGlhbHNTdG9yYWdlIHtcblxuICAgIHN0YXRpYyBhc3luYyBzdG9yZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5QYXNzd29yZENyZWRlbnRpYWwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkQ3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuXHRcdFx0XHRpZDogdXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vY29uc3QgcGFzc3dvcmRDcmVkZW50aWFsc0RhdGEgPSBuZXcgQ3JlZGVudGlhbENyZWF0aW9uT3B0aW9ucygpO1xuXHRcdFx0Y29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShwYXNzd29yZENyZWRlbnRpYWwpO1xuICAgICAgICAgICAgTE9HLmluZm8oY3JlZGVudGlhbCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyRGF0YWJhc2VTdG9yYWdlIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYk5hbWUgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb25cbiAgICAgKiBAcmV0dXJucyB7SURCT3BlbkRCUmVxdWVzdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgb3BlbihkYk5hbWUsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQgfSBmcm9tIFwiLi9jb250YWluZXJFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFdmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihldmVudCl7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtFdmVudH0gKi9cbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgICAgICBpZiAodGhpcy5ldmVudC50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJkcmFnc3RhcnRcIil7XG4gICAgICAgICAgICB0aGlzLmV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wUHJvcGFnYXRpb24oKXtcbiAgICAgICAgdGhpcy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgICAgICB0aGlzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudC50YXJnZXQgJiYgdGhpcy5ldmVudC50YXJnZXQuZmlsZXMpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5maWxlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7RGF0YVRyYW5zZmVyfSAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gdGhpcy5ldmVudC5kYXRhVHJhbnNmZXI7XG4gICAgICAgICAgICBpZiAoZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGV2ZW50IGFuZCB0aGUgZWRnZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNvbnRhaW5pbmcgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0IG9mZnNldFgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQub2Zmc2V0WDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZXZlbnQgYW5kIHRoZSBlZGdlIHkgY29vcmRpbmF0ZSBvZiB0aGUgY29udGFpbmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5vZmZzZXRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRYO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCB0YXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcmVsYXRlZFRhcmdldCgpe1xuICAgICAgICBpZiAodGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgIGdldFJlbGF0ZWRUYXJnZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSl7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpLmdldEF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCB0YXJnZXRWYWx1ZSgpe1xuICAgICAgICBpZih0aGlzLnRhcmdldCkgeyBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQga2V5Q29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQua2V5Q29kZTtcbiAgICB9XG5cbiAgICBpc0tleUNvZGUoY29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5rZXlDb2RlID09PSBjb2RlO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lclRleHQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXh0fSB0ZXh0IFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcblxuICAgICAgICAvKiogQHR5cGUge1RleHR9ICovXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Lm5vZGVWYWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy50ZXh0Lm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckV2ZW50IH0gZnJvbSBcIi4vY29udGFpbmVyRXZlbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lclRleHQgfSBmcm9tIFwiLi9jb250YWluZXJUZXh0XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFbGVtZW50IHtcbiBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuXG4gICAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgY2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb250YWlucyhjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jb250YWlucyhjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlS2V5IFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlVmFsdWUgXG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIGhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZVZhbHVlKFwiaWRcIik7XG4gICAgfVxuXG4gICAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlVmFsdWUoXCJjbGFzc1wiKTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVyVGV4dDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJIVE1MKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnN0eWxlO1xuICAgIH1cblxuICAgIHNldCBzdHlsZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaXNDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gbGlzdGVuZXIgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjYXB0dXJlIFxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICAgICAgICBjb25zdCBjb252ZXJ0VG9Db250YWluZXJFdmVudExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKG5ldyBDb250YWluZXJFdmVudChldmVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY29udmVydFRvQ29udGFpbmVyRXZlbnRMaXN0ZW5lciwgY2FwdHVyZSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmFtZTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmFtZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnR5cGU7XG4gICAgfVxuXG4gICAgc2V0IHR5cGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnR5cGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50ZXh0O1xuICAgIH1cblxuICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudGFnTmFtZTtcbiAgICB9XG5cbiAgICBnZXQgb2Zmc2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IG9mZnNldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcGFyZW50Tm9kZSgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSByZXBsYWNlbWVudFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gdG9SZXBsYWNlXG4gICAgICovXG4gICAgcmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCB0b1JlcGxhY2UpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudC5lbGVtZW50LCB0b1JlcGxhY2UuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICBnZXQgZmlyc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGxhc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50Lmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KHRoaXMuZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3QoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjaGVja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNoZWNrZWQ7XG4gICAgfVxuXG4gICAgc2V0IGNoZWNrZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoZWNrZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zdWJtaXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGljaygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IElucHV0RXZlbnQoZXZlbnQpKTtcbiAgICB9XG5cbiAgICBwbGF5TXV0ZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG11dGUoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5tdXRlKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQudW5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5wYXVzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kLCBUaW1lUHJvbWlzZSB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyRXZlbnQgfSBmcm9tIFwiLi9jb250YWluZXJFdmVudFwiO1xuaW1wb3J0IHsgQ29udGFpbmVyRWxlbWVudCB9IGZyb20gXCIuL2NvbnRhaW5lckVsZW1lbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lclRleHQgfSBmcm9tIFwiLi9jb250YWluZXJUZXh0XCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJFbGVtZW50XCIpO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyRWxlbWVudFV0aWxzIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0RWxlbWVudEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGV1IFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVUZXh0Tm9kZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lclRleHQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgXG4gICAgICovXG4gICAgc3RhdGljIHJlbW92ZUVsZW1lbnQoaWQpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lU3BhY2UgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnROUyhuYW1lU3BhY2UsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lU3BhY2UsIG5hbWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXG4gICAgICovXG4gICAgc3RhdGljIGFwcGVuZFJvb3RVaUNoaWxkKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWxlbWVudC5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcbiAgICAgKi9cbiAgICAgc3RhdGljIGFwcGVuZFJvb3RNZXRhQ2hpbGQoY29udGFpbmVyRWxlbWVudCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtZW50LmVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gcGFyZW50RWxlbWVudCBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICAgc3RhdGljIHByZXBlbmRDaGlsZChwYXJlbnRFbGVtZW50LCBjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5wcmVwZW5kKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IHBhcmVudEVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgc3RhdGljIGFwcGVuZENoaWxkKHBhcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCkge1xuICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICogQHBhcmFtIHthbnl9IGF0dHJpYnV0ZVZhbHVlIFxuICAgICAqL1xuICAgIHN0YXRpYyBzZXRBdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICovXG4gICAgIHN0YXRpYyBnZXRBdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IHBhcmVudEVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgc3RhdGljIGNvbnRhaW5zKHBhcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gcGFyZW50RWxlbWVudC5jb250YWlucyhjaGlsZEVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gZWxlbWVudCBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBzdGF0aWMgaXNDb25uZWN0ZWQoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5pc0Nvbm5lY3RlZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNVSUVsZW1lbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IGVsZW1lbnQgdG8gc2Nyb2xsIGxvY2tcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCB4IGNvb3JkaW5hdGUgdG8gbG9jayB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IHkgY29vcmRpbmF0ZSB0byBsb2NrIHRvXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIG1pbGxpc2Vjb25kc1xuICAgICAqL1xuICAgIHN0YXRpYyBzY3JvbGxMb2NrVG8oZWxlbWVudCwgeCwgeSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG8gPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zY3JvbGxUbyh4LHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBzY3JvbGxUbyk7XG4gICAgICAgIFRpbWVQcm9taXNlLmFzUHJvbWlzZShkdXJhdGlvbiwgKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNjcm9sbFRvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGFpbmVyQXN5bmMgfSBmcm9tIFwiLi9jb250YWluZXJBc3luY1wiO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySHR0cFJlc3BvbnNlIHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGFzeW5jIGpzb24oKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlc3BvbnNlLmpzb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxuICAgICAqL1xuICAgIGFzeW5jIHRleHQoKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlc3BvbnNlLnRleHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLnN0YXR1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBzdGF0dXNUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIH1cblxuICAgIGdldCBoZWFkZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5oZWFkZXJzO1xuICAgIH1cblxuICAgIGdldCBvaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzcG9uc2Uub2s7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVySHR0cFJlc3BvbnNlfVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBmcm9tKHJlc3BvbnNlLCB0aW1lb3V0ID0gMTAwMCkge1xuICAgICAgICBjb25zdCB0aW1lb3V0UmVzcG9uc2UgPSBhd2FpdCBDb250YWluZXJBc3luYy50aW1lb3V0KHRpbWVvdXQsIHJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJIdHRwUmVzcG9uc2UodGltZW91dFJlc3BvbnNlKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTG9nZ2VyLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckh0dHBSZXNwb25zZSB9IGZyb20gXCIuL2NvbnRhaW5lckh0dHBSZXNwb25zZVwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVySHR0cENsaWVudFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckh0dHBDbGllbnQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gICAgICogQHJldHVybiB7UHJvbWlzZTxDb250YWluZXJIdHRwUmVzcG9uc2U+fVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBmZXRjaCh1cmwsIHBhcmFtcywgdGltZW91dCA9IDQwMDApIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VQcm9taXNlID0gZmV0Y2godXJsLCBwYXJhbXMpXG4gICAgICAgIHJldHVybiBDb250YWluZXJIdHRwUmVzcG9uc2UuZnJvbShyZXNwb25zZVByb21pc2UsIHRpbWVvdXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXG4gICAgICogQHBhcmFtIHtGaWxlW119IGZpbGVzIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyB1cGxvYWQodXJsLCBmaWxlcywgYXV0aGVudGljYXRpb24gPSBudWxsLCBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kID0gbnVsbCwgdGltZW91dCA9IDQwMDApIHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwpO1xuICAgICAgICB4aHIudGltZW91dCA9IHRpbWVvdXQ7XG5cbiAgICAgICAgaWYgKGF1dGhlbnRpY2F0aW9uKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBhdXRoZW50aWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHhoci5vbnByb2dyZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsUHJvZ3Jlc3NDYWxsYmFja01ldGhvZChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLCBldmVudC5sb2FkZWQsIGV2ZW50LnRvdGFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9udGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1cGxvYWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICAgICAgcmV0dXJuIHVwbG9hZFByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtNZXRob2R9IHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxvYWRlZCBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG90YWwgXG4gICAgICovXG4gICAgY2FsbFByb2dyZXNzQ2FsbGJhY2tNZXRob2QocHJvZ3Jlc3NDYWxsYmFja01ldGhvZCwgbG9hZGVkLCB0b3RhbCkge1xuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFja01ldGhvZCkge1xuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFja01ldGhvZC5jYWxsKGxvYWRlZCwgdG90YWwpO1xuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBDb250YWluZXJMb2NhbFN0b3JhZ2Uge1xuXG4gICAgc3RhdGljIHNldExvY2FsQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSx2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUxvY2FsQXR0cmlidXRlKGtleSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaGFzTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cblxufSIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVyU2Vzc2lvblN0b3JhZ2VcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJTZXNzaW9uU3RvcmFnZSB7XG5cbiAgICBzdGF0aWMgc2V0U2Vzc2lvbkF0dHJpYnV0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSx2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZVNlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXNTZXNzaW9uQXR0cmlidXRlKGtleSkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0TG9jYWxBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cblxufSIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyRXZlbnQgfSBmcm9tIFwiLi9jb250YWluZXJFdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyV2luZG93IHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBsaXN0ZW5lciBcbiAgICAgKiBAcmV0dXJuIHtNZXRob2R9IGRlc3Ryb3kgZnVuY3Rpb25cbiAgICAgKi8gICAgXG4gICAgc3RhdGljIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbWV0aG9kKSB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIG1ldGhvZC5jYWxsKG5ldyBDb250YWluZXJFdmVudChldmVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTsgfVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyV2luZG93IH0gZnJvbSBcIi4vY29udGFpbmVyV2luZG93XCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJVcmxcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJVcmwge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFN0cmluZyBcbiAgICAgKi9cbiAgICBzdGF0aWMgZ28odXJsU3RyaW5nKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybFN0cmluZztcbiAgICB9XG5cbiAgICBzdGF0aWMgYmFjaygpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgIH1cblxuXG4gICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdCBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFN0cmluZyBcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVwbGFjZVVybCh1cmxTdHJpbmcsIHRpdGxlLCBzdGF0ZU9iamVjdCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGVPYmplY3QsIHRpdGxlLCB1cmxTdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdCBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFN0cmluZyBcbiAgICAgKi9cbiAgICBzdGF0aWMgcHVzaFVybCh1cmxTdHJpbmcsIHRpdGxlLCBzdGF0ZU9iamVjdCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGVPYmplY3QsIHRpdGxlLCB1cmxTdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGN1cnJlbnRVcmwoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gbWV0aG9kXG4gICAgICovXG4gICAgc3RhdGljIGFkZFVzZXJOYXZpZ2F0ZUxpc3RlbmVyKG1ldGhvZCkge1xuICAgICAgICBDb250YWluZXJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIG1ldGhvZCk7XG4gICAgfVxufSJdLCJuYW1lcyI6WyJMb2dnZXIiLCJUaW1lUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sTUFBTSxjQUFjLENBQUM7QUFDNUI7QUFD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
