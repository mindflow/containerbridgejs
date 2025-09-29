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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckFzeW5jLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJDcmVkZW50aWFsc1N0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckRhdGFiYXNlU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRXZlbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclRleHQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnRVdGlscy5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVySHR0cFJlc3BvbnNlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJIdHRwQ2xpZW50LmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJMb2NhbFN0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclNlc3Npb25TdG9yYWdlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJXaW5kb3cuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclVybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29udGFpbmVyQXN5bmMge1xuXG4gICAgc3RhdGljIHRpbWVvdXQobWlsbGlzZWNvbmRzLCBwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInRpbWVvdXRcIikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsYXkobWlsbGlzZWNvbmRzLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2xvbmd9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdoZW4gbWlsbGlzZWNvbmRzIGhhdmUgcGFzc2VkXG4gICAgICovXG4gICAgc3RhdGljIHBhdXNlKG1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyQ3JlZGVudGlhbHNTdG9yYWdlIHtcblxuICAgIHN0YXRpYyBhc3luYyBzdG9yZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5QYXNzd29yZENyZWRlbnRpYWwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkQ3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuXHRcdFx0XHRpZDogdXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vY29uc3QgcGFzc3dvcmRDcmVkZW50aWFsc0RhdGEgPSBuZXcgQ3JlZGVudGlhbENyZWF0aW9uT3B0aW9ucygpO1xuXHRcdFx0Y29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShwYXNzd29yZENyZWRlbnRpYWwpO1xuICAgICAgICAgICAgTE9HLmluZm8oY3JlZGVudGlhbCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyRGF0YWJhc2VTdG9yYWdlIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYk5hbWUgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb25cbiAgICAgKiBAcmV0dXJucyB7SURCT3BlbkRCUmVxdWVzdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgb3BlbihkYk5hbWUsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQgfSBmcm9tIFwiLi9jb250YWluZXJFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFdmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihldmVudCl7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtFdmVudH0gKi9cbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgICAgICBpZiAodGhpcy5ldmVudC50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJkcmFnc3RhcnRcIil7XG4gICAgICAgICAgICB0aGlzLmV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wUHJvcGFnYXRpb24oKXtcbiAgICAgICAgdGhpcy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgICAgICB0aGlzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudC50YXJnZXQgJiYgdGhpcy5ldmVudC50YXJnZXQuZmlsZXMpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5maWxlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7RGF0YVRyYW5zZmVyfSAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gdGhpcy5ldmVudC5kYXRhVHJhbnNmZXI7XG4gICAgICAgICAgICBpZiAoZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGV2ZW50IGFuZCB0aGUgZWRnZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNvbnRhaW5pbmcgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0IG9mZnNldFgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQub2Zmc2V0WDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZXZlbnQgYW5kIHRoZSBlZGdlIHkgY29vcmRpbmF0ZSBvZiB0aGUgY29udGFpbmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5vZmZzZXRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRYO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCB0YXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcmVsYXRlZFRhcmdldCgpe1xuICAgICAgICBpZiAodGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgIGdldFJlbGF0ZWRUYXJnZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSl7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpLmdldEF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCB0YXJnZXRWYWx1ZSgpe1xuICAgICAgICBpZih0aGlzLnRhcmdldCkgeyBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQga2V5Q29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQua2V5Q29kZTtcbiAgICB9XG5cbiAgICBpc0tleUNvZGUoY29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5rZXlDb2RlID09PSBjb2RlO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lclRleHQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXh0fSB0ZXh0IFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcblxuICAgICAgICAvKiogQHR5cGUge1RleHR9ICovXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Lm5vZGVWYWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy50ZXh0Lm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckV2ZW50IH0gZnJvbSBcIi4vY29udGFpbmVyRXZlbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lclRleHQgfSBmcm9tIFwiLi9jb250YWluZXJUZXh0XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFbGVtZW50IHtcbiBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuXG4gICAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgY2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb250YWlucyhjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jb250YWlucyhjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlS2V5IFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlVmFsdWUgXG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIGhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZVZhbHVlKFwiaWRcIik7XG4gICAgfVxuXG4gICAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlVmFsdWUoXCJjbGFzc1wiKTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVyVGV4dDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJIVE1MKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnN0eWxlO1xuICAgIH1cblxuICAgIHNldCBzdHlsZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaXNDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gbGlzdGVuZXIgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjYXB0dXJlIFxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICAgICAgICBjb25zdCBjb252ZXJ0VG9Db250YWluZXJFdmVudExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKG5ldyBDb250YWluZXJFdmVudChldmVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY29udmVydFRvQ29udGFpbmVyRXZlbnRMaXN0ZW5lciwgY2FwdHVyZSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmFtZTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmFtZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnR5cGU7XG4gICAgfVxuXG4gICAgc2V0IHR5cGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnR5cGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50ZXh0O1xuICAgIH1cblxuICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudGFnTmFtZTtcbiAgICB9XG5cbiAgICBnZXQgb2Zmc2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IG9mZnNldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcGFyZW50Tm9kZSgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSByZXBsYWNlbWVudFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gdG9SZXBsYWNlXG4gICAgICovXG4gICAgcmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCB0b1JlcGxhY2UpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudC5lbGVtZW50LCB0b1JlcGxhY2UuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICBnZXQgZmlyc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGxhc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50Lmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KHRoaXMuZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3QoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjaGVja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNoZWNrZWQ7XG4gICAgfVxuXG4gICAgc2V0IGNoZWNrZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoZWNrZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zdWJtaXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGljaygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IElucHV0RXZlbnQoZXZlbnQpKTtcbiAgICB9XG5cbiAgICBwbGF5TXV0ZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG11dGUoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5tdXRlKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQudW5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5wYXVzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IExvZ2dlciwgVGltZVByb21pc2UgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQgfSBmcm9tIFwiLi9jb250YWluZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBDb250YWluZXJUZXh0IH0gZnJvbSBcIi4vY29udGFpbmVyVGV4dFwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVyRWxlbWVudFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckVsZW1lbnRVdGlscyB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgXG4gICAgICovXG4gICAgc3RhdGljIGdldEVsZW1lbnRCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxldSBcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlVGV4dE5vZGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJUZXh0KGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFxuICAgICAqL1xuICAgIHN0YXRpYyByZW1vdmVFbGVtZW50KGlkKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVNwYWNlIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50TlMobmFtZVNwYWNlLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZVNwYWNlLCBuYW1lKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxuICAgICAqL1xuICAgIHN0YXRpYyBhcHBlbmRSb290VWlDaGlsZChjb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lckVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXG4gICAgICovXG4gICAgIHN0YXRpYyBhcHBlbmRSb290TWV0YUNoaWxkKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWxlbWVudC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKiBAcGFyYW0ge2FueX0gYXR0cmlidXRlVmFsdWUgXG4gICAgICovXG4gICAgc3RhdGljIHNldEF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKi9cbiAgICAgc3RhdGljIGdldEF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZUtleSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gcGFyZW50RWxlbWVudCBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICBzdGF0aWMgY29udGFpbnMocGFyZW50RWxlbWVudCwgY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJlbnRFbGVtZW50LmNvbnRhaW5zKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHN0YXRpYyBpc0Nvbm5lY3RlZChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmlzQ29ubmVjdGVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc1VJRWxlbWVudCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgZWxlbWVudCB0byBzY3JvbGwgbG9ja1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IHggY29vcmRpbmF0ZSB0byBsb2NrIHRvXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgeSBjb29yZGluYXRlIHRvIGxvY2sgdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gbWlsbGlzZWNvbmRzXG4gICAgICovXG4gICAgc3RhdGljIHNjcm9sbExvY2tUbyhlbGVtZW50LCB4LCB5LCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBzY3JvbGxUbyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNjcm9sbFRvKHgseSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNjcm9sbFRvKTtcbiAgICAgICAgVGltZVByb21pc2UuYXNQcm9taXNlKGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2Nyb2xsVG8pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250YWluZXJBc3luYyB9IGZyb20gXCIuL2NvbnRhaW5lckFzeW5jXCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJIdHRwUmVzcG9uc2Uge1xuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59XG4gICAgICovXG4gICAgYXN5bmMganNvbigpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVzcG9uc2UuanNvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XG4gICAgICovXG4gICAgYXN5bmMgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVzcG9uc2UudGV4dCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHN0YXR1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzcG9uc2Uuc3RhdHVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0YXR1c1RleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgfVxuXG4gICAgZ2V0IGhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLmhlYWRlcnM7XG4gICAgfVxuXG4gICAgZ2V0IG9rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5vaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJIdHRwUmVzcG9uc2V9XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGZyb20ocmVzcG9uc2UsIHRpbWVvdXQgPSAxMDAwKSB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXRSZXNwb25zZSA9IGF3YWl0IENvbnRhaW5lckFzeW5jLnRpbWVvdXQodGltZW91dCwgcmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckh0dHBSZXNwb25zZSh0aW1lb3V0UmVzcG9uc2UpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVySHR0cFJlc3BvbnNlIH0gZnJvbSBcIi4vY29udGFpbmVySHR0cFJlc3BvbnNlXCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJIdHRwQ2xpZW50XCIpO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySHR0cENsaWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbnRhaW5lckh0dHBSZXNwb25zZT59XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGZldGNoKHVybCwgcGFyYW1zLCB0aW1lb3V0ID0gNDAwMCkge1xuICAgICAgICBjb25zdCByZXNwb25zZVByb21pc2UgPSBmZXRjaCh1cmwsIHBhcmFtcylcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lckh0dHBSZXNwb25zZS5mcm9tKHJlc3BvbnNlUHJvbWlzZSwgdGltZW91dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIHVwbG9hZCh1cmwsIGZpbGVzLCBhdXRoZW50aWNhdGlvbiA9IG51bGwsIHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgPSBudWxsLCB0aW1lb3V0ID0gNDAwMCkge1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCk7XG4gICAgICAgIHhoci50aW1lb3V0ID0gdGltZW91dDtcblxuICAgICAgICBpZiAoYXV0aGVudGljYXRpb24pIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIGF1dGhlbnRpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxQcm9ncmVzc0NhbGxiYWNrTWV0aG9kKHByb2dyZXNzQ2FsbGJhY2tNZXRob2QsIGV2ZW50LmxvYWRlZCwgZXZlbnQudG90YWwpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVwbG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgICAgICByZXR1cm4gdXBsb2FkUHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gcHJvZ3Jlc3NDYWxsYmFja01ldGhvZCBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9hZGVkIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbCBcbiAgICAgKi9cbiAgICBjYWxsUHJvZ3Jlc3NDYWxsYmFja01ldGhvZChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLCBsb2FkZWQsIHRvdGFsKSB7XG4gICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kKSB7XG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLmNhbGwobG9hZGVkLCB0b3RhbCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lckxvY2FsU3RvcmFnZSB7XG5cbiAgICBzdGF0aWMgc2V0TG9jYWxBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXNMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJTZXNzaW9uU3RvcmFnZVwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclNlc3Npb25TdG9yYWdlIHtcblxuICAgIHN0YXRpYyBzZXRTZXNzaW9uQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlU2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0U2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhc1Nlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRMb2NhbEF0dHJpYnV0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksdmFsdWUpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJFdmVudCB9IGZyb20gXCIuL2NvbnRhaW5lckV2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJXaW5kb3cge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IGxpc3RlbmVyIFxuICAgICAqIEByZXR1cm4ge01ldGhvZH0gZGVzdHJveSBmdW5jdGlvblxuICAgICAqLyAgICBcbiAgICBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBtZXRob2QpIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgbWV0aG9kLmNhbGwobmV3IENvbnRhaW5lckV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpOyB9XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJXaW5kb3cgfSBmcm9tIFwiLi9jb250YWluZXJXaW5kb3dcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lclVybFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclVybCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBnbyh1cmxTdHJpbmcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsU3RyaW5nO1xuICAgIH1cblxuICAgIHN0YXRpYyBiYWNrKCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxuXG5cbiAgICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyByZXBsYWNlVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBwdXNoVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3VycmVudFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBtZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkVXNlck5hdmlnYXRlTGlzdGVuZXIobWV0aG9kKSB7XG4gICAgICAgIENvbnRhaW5lcldpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgbWV0aG9kKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIkxvZ2dlciIsIlRpbWVQcm9taXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNLGNBQWMsQ0FBQztBQUM1QjtBQUNBLElBQUksT0FBTyxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRTtBQUMxQyxRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3JELFlBQVksVUFBVSxDQUFDLFdBQVc7QUFDbEMsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBQztBQUM1QyxhQUFhLEVBQUUsWUFBWSxFQUFDO0FBQzVCLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUMsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFO0FBQ3pDLFFBQVEsT0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLFlBQVksRUFBRTtBQUMvQixRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUs7QUFDeEMsWUFBWSxVQUFVLENBQUMsTUFBTTtBQUM3QixnQkFBZ0IsT0FBTyxFQUFFLENBQUM7QUFDMUIsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzdCLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMOztBQ2hDTyxNQUFNLDJCQUEyQixDQUFDO0FBQ3pDO0FBQ0EsSUFBSSxhQUFhLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzNDLFFBQVEsSUFBSSxNQUFNLENBQUMsa0JBQWtCLEVBQUU7QUFDdkMsR0FBRyxNQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUM7QUFDckQsSUFBSSxFQUFFLEVBQUUsUUFBUTtBQUNoQixJQUFJLFFBQVEsRUFBRSxRQUFRO0FBQ3RCLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQTtBQUNBLEdBQUcsTUFBTSxVQUFVLEdBQUcsTUFBTSxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVFLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxZQUFZLE9BQU8sVUFBVSxDQUFDO0FBQzlCLFNBQVM7QUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBOztBQ2pCTyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ2pDLFFBQVEsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEQsS0FBSztBQUNMO0FBQ0E7O0FDVk8sTUFBTSxjQUFjLENBQUM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQztBQUN0QjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMzQixRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksV0FBVyxDQUFDO0FBQ3pELFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoRSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxlQUFlLEVBQUU7QUFDckIsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3JDLEtBQUs7QUFDTDtBQUNBLElBQUksY0FBYyxFQUFFO0FBQ3BCLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ2hCLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDMUQ7QUFDQSxZQUFZLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzdDLFlBQVksT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFNBQVM7QUFDVCxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7QUFDckM7QUFDQSxZQUFZLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQ3pELFlBQVksSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFO0FBQ3BDLGdCQUFnQixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDMUMsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDakIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDakIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDakIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDakIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUNoQixRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUM3QyxZQUFZLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNELFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxhQUFhLEVBQUU7QUFDdkIsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7QUFDcEQsWUFBWSxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNsRSxTQUFTO0FBQ1QsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUsseUJBQXlCLENBQUMsYUFBYSxDQUFDO0FBQzdDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtBQUN0QyxZQUFZLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25HLFNBQVM7QUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxXQUFXLEVBQUU7QUFDckIsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDeEIsWUFBWSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3JDLFNBQVM7QUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxPQUFPLEdBQUc7QUFDbEIsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtBQUNwQixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO0FBQzNDLEtBQUs7QUFDTDtBQUNBOztBQ3BITyxNQUFNLGFBQWEsQ0FBQztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3RCO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDaEIsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLEtBQUs7QUFDTDs7QUNmTyxNQUFNLGdCQUFnQixDQUFDO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7QUFDekI7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRTtBQUMzQixRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGlCQUFpQixDQUFDLFlBQVksRUFBRTtBQUNwQyxRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksaUJBQWlCLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRTtBQUNwRCxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNoRSxLQUFLO0FBQ0w7QUFDQSxJQUFJLGVBQWUsQ0FBQyxZQUFZLEVBQUU7QUFDbEMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUU7QUFDL0IsUUFBUSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixRQUFRLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxTQUFTLEdBQUc7QUFDcEIsUUFBUSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxHQUFHO0FBQ3BCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN6QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxHQUFHO0FBQ3BCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN6QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ2hCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksUUFBUSxHQUFHO0FBQ25CLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN4QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ2hCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksV0FBVyxH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
