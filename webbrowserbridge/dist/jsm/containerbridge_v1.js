import { Logger, TimePromise } from './coreutil_v1.js';

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

new Logger("ContainerElement");

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
        TimePromise.asPromise(duration, () => {
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

new Logger("ContainerHttpClient");

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

new Logger("ContainerSessionStorage");

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

new Logger("ContainerUrl");

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

export { ContainerAsync, ContainerCredentialsStorage, ContainerDatabaseStorage, ContainerElement, ContainerElementUtils, ContainerEvent, ContainerHttpClient, ContainerHttpResponse, ContainerLocalStorage, ContainerSessionStorage, ContainerText, ContainerUrl, ContainerWindow };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckFzeW5jLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJDcmVkZW50aWFsc1N0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckRhdGFiYXNlU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRXZlbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclRleHQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnQuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckVsZW1lbnRVdGlscy5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVySHR0cFJlc3BvbnNlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJIdHRwQ2xpZW50LmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJMb2NhbFN0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclNlc3Npb25TdG9yYWdlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJXaW5kb3cuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclVybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29udGFpbmVyQXN5bmMge1xuXG4gICAgc3RhdGljIHRpbWVvdXQobWlsbGlzZWNvbmRzLCBwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInRpbWVvdXRcIikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsYXkobWlsbGlzZWNvbmRzLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2xvbmd9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdoZW4gbWlsbGlzZWNvbmRzIGhhdmUgcGFzc2VkXG4gICAgICovXG4gICAgc3RhdGljIHBhdXNlKG1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyQ3JlZGVudGlhbHNTdG9yYWdlIHtcblxuICAgIHN0YXRpYyBhc3luYyBzdG9yZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5QYXNzd29yZENyZWRlbnRpYWwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkQ3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuXHRcdFx0XHRpZDogdXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vY29uc3QgcGFzc3dvcmRDcmVkZW50aWFsc0RhdGEgPSBuZXcgQ3JlZGVudGlhbENyZWF0aW9uT3B0aW9ucygpO1xuXHRcdFx0Y29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShwYXNzd29yZENyZWRlbnRpYWwpO1xuICAgICAgICAgICAgTE9HLmluZm8oY3JlZGVudGlhbCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyRGF0YWJhc2VTdG9yYWdlIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYk5hbWUgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb25cbiAgICAgKiBAcmV0dXJucyB7SURCT3BlbkRCUmVxdWVzdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgb3BlbihkYk5hbWUsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQgfSBmcm9tIFwiLi9jb250YWluZXJFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFdmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihldmVudCl7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtFdmVudH0gKi9cbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgICAgICBpZiAodGhpcy5ldmVudC50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJkcmFnc3RhcnRcIil7XG4gICAgICAgICAgICB0aGlzLmV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wUHJvcGFnYXRpb24oKXtcbiAgICAgICAgdGhpcy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgICAgICB0aGlzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudC50YXJnZXQgJiYgdGhpcy5ldmVudC50YXJnZXQuZmlsZXMpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5maWxlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7RGF0YVRyYW5zZmVyfSAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gdGhpcy5ldmVudC5kYXRhVHJhbnNmZXI7XG4gICAgICAgICAgICBpZiAoZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGV2ZW50IGFuZCB0aGUgZWRnZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNvbnRhaW5pbmcgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0IG9mZnNldFgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQub2Zmc2V0WDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZXZlbnQgYW5kIHRoZSBlZGdlIHkgY29vcmRpbmF0ZSBvZiB0aGUgY29udGFpbmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5vZmZzZXRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRYO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCB0YXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcmVsYXRlZFRhcmdldCgpe1xuICAgICAgICBpZiAodGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgIGdldFJlbGF0ZWRUYXJnZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSl7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpLmdldEF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCB0YXJnZXRWYWx1ZSgpe1xuICAgICAgICBpZih0aGlzLnRhcmdldCkgeyBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQga2V5Q29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQua2V5Q29kZTtcbiAgICB9XG5cbiAgICBpc0tleUNvZGUoY29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5rZXlDb2RlID09PSBjb2RlO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lclRleHQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtUZXh0fSB0ZXh0IFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcblxuICAgICAgICAvKiogQHR5cGUge1RleHR9ICovXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Lm5vZGVWYWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy50ZXh0Lm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckV2ZW50IH0gZnJvbSBcIi4vY29udGFpbmVyRXZlbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lclRleHQgfSBmcm9tIFwiLi9jb250YWluZXJUZXh0XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFbGVtZW50IHtcbiBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuXG4gICAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgY2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb250YWlucyhjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jb250YWlucyhjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlS2V5IFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlVmFsdWUgXG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlVmFsdWUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIGhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KTtcbiAgICB9XG5cbiAgICBnZXQgaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZVZhbHVlKFwiaWRcIik7XG4gICAgfVxuXG4gICAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlVmFsdWUoXCJjbGFzc1wiKTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVyVGV4dDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJUZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBzZXQgaW5uZXJIVE1MKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnN0eWxlO1xuICAgIH1cblxuICAgIHNldCBzdHlsZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaXNDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gbGlzdGVuZXIgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjYXB0dXJlIFxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICAgICAgICBjb25zdCBjb252ZXJ0VG9Db250YWluZXJFdmVudExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKG5ldyBDb250YWluZXJFdmVudChldmVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY29udmVydFRvQ29udGFpbmVyRXZlbnRMaXN0ZW5lciwgY2FwdHVyZSk7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmFtZTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmFtZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnR5cGU7XG4gICAgfVxuXG4gICAgc2V0IHR5cGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnR5cGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50ZXh0O1xuICAgIH1cblxuICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC50ZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQudGFnTmFtZTtcbiAgICB9XG5cbiAgICBnZXQgb2Zmc2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IG9mZnNldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVyRWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXQgcGFyZW50Tm9kZSgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGlsZEVsZW1lbnQgaW5zdGFuY2VvZiBDb250YWluZXJUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZEVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSByZXBsYWNlbWVudFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gdG9SZXBsYWNlXG4gICAgICovXG4gICAgcmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCB0b1JlcGxhY2UpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudC5lbGVtZW50LCB0b1JlcGxhY2UuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICBnZXQgZmlyc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudCh0aGlzLmVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGxhc3RDaGlsZCgpIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50Lmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJFbGVtZW50KHRoaXMuZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3QoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjaGVja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNoZWNrZWQ7XG4gICAgfVxuXG4gICAgc2V0IGNoZWNrZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNoZWNrZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5zdWJtaXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGljaygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2hFdmVudChldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IElucHV0RXZlbnQoZXZlbnQpKTtcbiAgICB9XG5cbiAgICBwbGF5TXV0ZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG11dGUoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5tdXRlKCkge1xuICAgICAgICBpZih0aGlzLmVsZW1lbnQudW5tdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQucGxheSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmKHRoaXMuZWxlbWVudC5wYXVzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IExvZ2dlciwgVGltZVByb21pc2UgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQgfSBmcm9tIFwiLi9jb250YWluZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBDb250YWluZXJUZXh0IH0gZnJvbSBcIi4vY29udGFpbmVyVGV4dFwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVyRWxlbWVudFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckVsZW1lbnRVdGlscyB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgXG4gICAgICovXG4gICAgc3RhdGljIGdldEVsZW1lbnRCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxldSBcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlVGV4dE5vZGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJUZXh0KGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFxuICAgICAqL1xuICAgIHN0YXRpYyByZW1vdmVFbGVtZW50KGlkKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVNwYWNlIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50TlMobmFtZVNwYWNlLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udGFpbmVyRWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZVNwYWNlLCBuYW1lKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxuICAgICAqL1xuICAgIHN0YXRpYyBhcHBlbmRSb290VWlDaGlsZChjb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lckVsZW1lbnQuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXG4gICAgICovXG4gICAgIHN0YXRpYyBhcHBlbmRSb290TWV0YUNoaWxkKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWxlbWVudC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKiBAcGFyYW0ge2FueX0gYXR0cmlidXRlVmFsdWUgXG4gICAgICovXG4gICAgc3RhdGljIHNldEF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZUtleSBcbiAgICAgKi9cbiAgICAgc3RhdGljIGdldEF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZUtleSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyRWxlbWVudH0gcGFyZW50RWxlbWVudCBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICBzdGF0aWMgY29udGFpbnMocGFyZW50RWxlbWVudCwgY2hpbGRFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJlbnRFbGVtZW50LmNvbnRhaW5zKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtDb250YWluZXJFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHN0YXRpYyBpc0Nvbm5lY3RlZChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmlzQ29ubmVjdGVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc1VJRWxlbWVudCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lckVsZW1lbnR9IGVsZW1lbnQgZWxlbWVudCB0byBzY3JvbGwgbG9ja1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IHggY29vcmRpbmF0ZSB0byBsb2NrIHRvXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgeSBjb29yZGluYXRlIHRvIGxvY2sgdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gbWlsbGlzZWNvbmRzXG4gICAgICovXG4gICAgc3RhdGljIHNjcm9sbExvY2tUbyhlbGVtZW50LCB4LCB5LCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBzY3JvbGxUbyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNjcm9sbFRvKHgseSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNjcm9sbFRvKTtcbiAgICAgICAgVGltZVByb21pc2UuYXNQcm9taXNlKGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2Nyb2xsVG8pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250YWluZXJBc3luYyB9IGZyb20gXCIuL2NvbnRhaW5lckFzeW5jXCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJIdHRwUmVzcG9uc2Uge1xuICAgIFxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59XG4gICAgICovXG4gICAgYXN5bmMganNvbigpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVzcG9uc2UuanNvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XG4gICAgICovXG4gICAgYXN5bmMgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVzcG9uc2UudGV4dCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHN0YXR1cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzcG9uc2Uuc3RhdHVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0YXR1c1RleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgfVxuXG4gICAgZ2V0IGhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLmhlYWRlcnM7XG4gICAgfVxuXG4gICAgZ2V0IG9rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5vaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqIEByZXR1cm5zIHtDb250YWluZXJIdHRwUmVzcG9uc2V9XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGZyb20ocmVzcG9uc2UsIHRpbWVvdXQgPSAxMDAwKSB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXRSZXNwb25zZSA9IGF3YWl0IENvbnRhaW5lckFzeW5jLnRpbWVvdXQodGltZW91dCwgcmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5lckh0dHBSZXNwb25zZSh0aW1lb3V0UmVzcG9uc2UpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBMb2dnZXIsIE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuaW1wb3J0IHsgQ29udGFpbmVySHR0cFJlc3BvbnNlIH0gZnJvbSBcIi4vY29udGFpbmVySHR0cFJlc3BvbnNlXCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJIdHRwQ2xpZW50XCIpO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySHR0cENsaWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbnRhaW5lckh0dHBSZXNwb25zZT59XG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGZldGNoKHVybCwgcGFyYW1zLCB0aW1lb3V0ID0gNDAwMCkge1xuICAgICAgICBjb25zdCByZXNwb25zZVByb21pc2UgPSBmZXRjaCh1cmwsIHBhcmFtcylcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lckh0dHBSZXNwb25zZS5mcm9tKHJlc3BvbnNlUHJvbWlzZSwgdGltZW91dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIHVwbG9hZCh1cmwsIGZpbGVzLCBhdXRoZW50aWNhdGlvbiA9IG51bGwsIHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgPSBudWxsLCB0aW1lb3V0ID0gNDAwMCkge1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCk7XG4gICAgICAgIHhoci50aW1lb3V0ID0gdGltZW91dDtcblxuICAgICAgICBpZiAoYXV0aGVudGljYXRpb24pIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIGF1dGhlbnRpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxQcm9ncmVzc0NhbGxiYWNrTWV0aG9kKHByb2dyZXNzQ2FsbGJhY2tNZXRob2QsIGV2ZW50LmxvYWRlZCwgZXZlbnQudG90YWwpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVwbG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgICAgICByZXR1cm4gdXBsb2FkUHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge01ldGhvZH0gcHJvZ3Jlc3NDYWxsYmFja01ldGhvZCBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9hZGVkIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbCBcbiAgICAgKi9cbiAgICBjYWxsUHJvZ3Jlc3NDYWxsYmFja01ldGhvZChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLCBsb2FkZWQsIHRvdGFsKSB7XG4gICAgICAgIGlmIChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kKSB7XG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLmNhbGwobG9hZGVkLCB0b3RhbCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbnRhaW5lckxvY2FsU3RvcmFnZSB7XG5cbiAgICBzdGF0aWMgc2V0TG9jYWxBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXNMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMb2NhbEF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5cbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJTZXNzaW9uU3RvcmFnZVwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclNlc3Npb25TdG9yYWdlIHtcblxuICAgIHN0YXRpYyBzZXRTZXNzaW9uQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlU2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0U2Vzc2lvbkF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhc1Nlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRMb2NhbEF0dHJpYnV0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksdmFsdWUpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJFdmVudCB9IGZyb20gXCIuL2NvbnRhaW5lckV2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJXaW5kb3cge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgXG4gICAgICogQHBhcmFtIHtNZXRob2R9IGxpc3RlbmVyIFxuICAgICAqIEByZXR1cm4ge01ldGhvZH0gZGVzdHJveSBmdW5jdGlvblxuICAgICAqLyAgICBcbiAgICBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBtZXRob2QpIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgbWV0aG9kLmNhbGwobmV3IENvbnRhaW5lckV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpOyB9XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJXaW5kb3cgfSBmcm9tIFwiLi9jb250YWluZXJXaW5kb3dcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lclVybFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclVybCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBnbyh1cmxTdHJpbmcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsU3RyaW5nO1xuICAgIH1cblxuICAgIHN0YXRpYyBiYWNrKCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxuXG5cbiAgICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyByZXBsYWNlVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBwdXNoVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3VycmVudFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBtZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkVXNlck5hdmlnYXRlTGlzdGVuZXIobWV0aG9kKSB7XG4gICAgICAgIENvbnRhaW5lcldpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgbWV0aG9kKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sY0FBYyxDQUFDLENBQUE7QUFDNUI7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxPQUFPLENBQUUsQ0FBQSxDQUFBO0FBQzFDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLElBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLFNBQVMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsTUFBTSxDQUFFLENBQUEsQ0FBQTtBQUNyRCxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFVLENBQUMsQ0FBVyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDbEMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsTUFBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksS0FBSyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLENBQUMsQ0FBQyxDQUFBO0FBQzVDLENBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLFlBQVksQ0FBQyxDQUFBO0FBQzVCLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFDO0FBQzFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLENBQUMsQ0FBQztBQUNYLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxPQUFPLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxRQUFRLENBQUUsQ0FBQSxDQUFBO0FBQ3pDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQVUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxRQUFRLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFDLENBQUM7QUFDbEQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUUsQ0FBQSxDQUFBO0FBQy9CLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUMsT0FBTyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUN4QyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFVLENBQUMsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUM3QixDQUFnQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLEVBQUUsQ0FBQztBQUMxQixDQUFhLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDN0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVMsQ0FBQyxDQUFDO0FBQ1gsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0wsQ0FBQTs7QUNoQ08sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sMkJBQTJCLENBQUMsQ0FBQTtBQUN6QztBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksYUFBYSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLFFBQVEsQ0FBRSxDQUFBLENBQUE7QUFDM0MsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBa0IsQ0FBRSxDQUFBLENBQUE7QUFDdkMsQ0FBQSxDQUFBLENBQUcsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWtCLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksa0JBQWtCLENBQUMsQ0FBQTtBQUNyRCxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxFQUFFLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ2hCLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLEVBQUUsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ3RCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFHLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVUsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFXLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFrQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQzVFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLEdBQUcsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVSxDQUFDLENBQUM7QUFDakMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxVQUFVLENBQUM7QUFDOUIsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBOztBQ2pCTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSx3QkFBd0IsQ0FBQyxDQUFBO0FBQ3RDO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxPQUFPLENBQUUsQ0FBQSxDQUFBO0FBQ2pDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ3RELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQTs7QUNWTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxjQUFjLENBQUMsQ0FBQTtBQUM1QjtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUE7QUFDdEI7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsS0FBSyxDQUFDO0FBQzNCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBVyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUE7QUFDekQsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUNoRSxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxlQUFlLENBQUUsQ0FBQSxDQUFBO0FBQ3JCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWUsRUFBRSxDQUFDO0FBQ3JDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxjQUFjLENBQUUsQ0FBQSxDQUFBO0FBQ3BCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFjLEVBQUUsQ0FBQztBQUNwQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxLQUFLLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDaEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsS0FBSyxDQUFFLENBQUEsQ0FBQTtBQUMxRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sTUFBTSxDQUFHLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxDQUFDO0FBQzdDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBQztBQUNoQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxZQUFZLENBQUUsQ0FBQSxDQUFBO0FBQ3JDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sWUFBWSxDQUFHLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFDO0FBQ3pELENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDcEMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDO0FBQzFDLENBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDYixDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLEVBQUUsQ0FBQztBQUNsQixDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxPQUFPLENBQUUsQ0FBQSxDQUFBO0FBQ2pCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUM7QUFDbEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFFLENBQUEsQ0FBQTtBQUNqQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDO0FBQ2xDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFFLENBQUEsQ0FBQTtBQUNqQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDO0FBQ2xDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFFLENBQUEsQ0FBQTtBQUNqQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDO0FBQ2xDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxNQUFNLENBQUUsQ0FBQSxDQUFBO0FBQ2hCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBRSxDQUFBLENBQUE7QUFDN0MsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWdCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUMzRCxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxhQUFhLENBQUUsQ0FBQSxDQUFBO0FBQ3ZCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYSxDQUFFLENBQUEsQ0FBQTtBQUNwRCxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBYSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDbEUsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUF5QixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQyxDQUFBO0FBQzdDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxhQUFhLENBQUUsQ0FBQSxDQUFBO0FBQ3RDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFnQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFhLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWlCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYSxDQUFDLENBQUM7QUFDbkcsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksV0FBVyxDQUFFLENBQUEsQ0FBQTtBQUNyQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUUsQ0FBQSxDQUFBLENBQUE7QUFDeEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxLQUFLLENBQUM7QUFDckMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2xCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUM7QUFDbEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFFLENBQUEsQ0FBQTtBQUNwQixDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssSUFBSSxDQUFDO0FBQzNDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQTs7QUNwSE8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sYUFBYSxDQUFDLENBQUE7QUFDM0I7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBRSxDQUFBLENBQUE7QUFDdEI7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxJQUFJLENBQUM7QUFDekIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksS0FBSyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2hCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsU0FBUyxDQUFDO0FBQ25DLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFFLENBQUEsQ0FBQTtBQUNyQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxLQUFLLENBQUM7QUFDcEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0wsQ0FBQTs7QUNmTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlCLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBRSxDQUFBLENBQUE7QUFDekI7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLE9BQU8sQ0FBQztBQUMvQixDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTCxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBRSxDQUFBLENBQUE7QUFDM0IsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQzNELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBaUIsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFFLENBQUEsQ0FBQTtBQUNwQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ3ZELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQWlCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsY0FBYyxDQUFFLENBQUEsQ0FBQTtBQUNwRCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFjLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ2hFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUUsQ0FBQSxDQUFBO0FBQ2xDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLGVBQWUsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFDLENBQUM7QUFDbkQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBRSxDQUFBLENBQUE7QUFDL0IsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUN2RCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxFQUFFLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDYixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsaUJBQWlCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUM7QUFDNUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksU0FBUyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3BCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBQztBQUMvQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxTQUFTLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDcEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxTQUFTLENBQUM7QUFDdEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVMsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDekIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsS0FBSyxDQUFDO0FBQ3ZDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLFNBQVMsQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNwQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLFNBQVMsQ0FBQztBQUN0QyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFFLENBQUEsQ0FBQTtBQUN6QixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxLQUFLLENBQUM7QUFDdkMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksS0FBSyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2hCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsS0FBSyxDQUFDO0FBQ2xDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFFLENBQUEsQ0FBQTtBQUNyQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsS0FBSyxDQUFDO0FBQ25DLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLFFBQVEsQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNuQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLFFBQVEsQ0FBQztBQUNyQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDeEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLEtBQUssQ0FBQztBQUN0QyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxLQUFLLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDaEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxLQUFLLENBQUM7QUFDbEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUUsQ0FBQSxDQUFBO0FBQ3JCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxLQUFLLENBQUM7QUFDbkMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksV0FBVyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3RCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsV0FBVyxDQUFDO0FBQ3hDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLGdCQUFnQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLEVBQUUsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxPQUFPLENBQUUsQ0FBQSxDQUFBO0FBQ25ELENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUErQixDQUFHLENBQUEsQ0FBQSxDQUFDLEtBQUssQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDM0QsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksY0FBYyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBZ0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBK0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQzNGLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLElBQUksQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNmLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxDQUFDO0FBQ2pDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDcEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxLQUFLLENBQUM7QUFDbEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksSUFBSSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2YsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxJQUFJLENBQUM7QUFDakMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFFLENBQUEsQ0FBQTtBQUNwQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLEtBQUssQ0FBQztBQUNsQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxJQUFJLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDZixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLElBQUksQ0FBQztBQUNqQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUUsQ0FBQSxDQUFBO0FBQ3BCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsS0FBSyxDQUFDO0FBQ2xDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNsQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLE9BQU8sQ0FBQztBQUNwQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxXQUFXLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDdEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxXQUFXLENBQUM7QUFDeEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksWUFBWSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3ZCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFDO0FBQ3pDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLGtCQUFrQixDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQzdCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQXFCLEVBQUUsQ0FBQztBQUNwRCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksVUFBVSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3JCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxHQUFHLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsVUFBVSxDQUFFLENBQUEsQ0FBQTtBQUNwQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ2pFLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sSUFBSSxDQUFDO0FBQ3BCLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFXLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBRSxDQUFBLENBQUE7QUFDOUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBRSxDQUFBLENBQUE7QUFDdEQsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVcsQ0FBQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQzNELENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYSxDQUFFLENBQUEsQ0FBQTtBQUNuRCxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDeEQsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUUsQ0FBQSxDQUFBO0FBQzlCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDdkQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFXLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLFNBQVMsQ0FBRSxDQUFBLENBQUE7QUFDekMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUM7QUFDMUUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxVQUFVLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDckIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLEdBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUUsQ0FBQSxDQUFBO0FBQ3BDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFnQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBVSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDakUsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksU0FBUyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3BCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxHQUFHLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsU0FBUyxDQUFFLENBQUEsQ0FBQTtBQUNuQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUNoRSxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLElBQUksQ0FBQztBQUNwQixDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksS0FBSyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ1osQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLEVBQUUsQ0FBQztBQUM3QixDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksTUFBTSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLEdBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLENBQUUsQ0FBQSxDQUFBO0FBQ2hDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sRUFBRSxDQUFDO0FBQ2xDLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2xCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDO0FBQ3BDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDdkIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxLQUFLLENBQUM7QUFDckMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE1BQU0sQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNiLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxHQUFHLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxDQUFFLENBQUEsQ0FBQTtBQUNoQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sRUFBRSxDQUFDO0FBQ3pDLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLEtBQUssQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNaLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxFQUFFLENBQUM7QUFDN0IsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBRSxDQUFBLENBQUE7QUFDekIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFhLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFVLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxTQUFTLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDaEIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLElBQUksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxJQUFJLENBQUUsQ0FBQSxDQUFBO0FBQy9CLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLElBQUksQ0FBQztBQUN0QyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxFQUFFLENBQUM7QUFDdkMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxJQUFJLENBQUM7QUFDcEIsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLElBQUksQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNYLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxHQUFHLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsSUFBSSxDQUFFLENBQUEsQ0FBQTtBQUM5QixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxJQUFJLENBQUM7QUFDdEMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksTUFBTSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLEdBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLENBQUUsQ0FBQSxDQUFBO0FBQ2hDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLEtBQUssQ0FBQztBQUN2QyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxJQUFJLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDWCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsSUFBSSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLElBQUksQ0FBRSxDQUFBLENBQUE7QUFDL0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksRUFBRSxDQUFDO0FBQ3ZDLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sSUFBSSxDQUFDO0FBQ3BCLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxLQUFLLENBQUcsQ0FBQSxDQUFBLENBQUE7QUFDWixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsR0FBRyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLEtBQUssQ0FBRSxDQUFBLENBQUE7QUFDL0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxFQUFFLENBQUM7QUFDeEMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTCxDQUFBOztBQ2hSWSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWtCLENBQUUsQ0FBQTtBQUMzQztBQUNPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLHFCQUFxQixDQUFDLENBQUE7QUFDbkM7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFjLENBQUMsQ0FBQSxDQUFFLENBQUUsQ0FBQSxDQUFBO0FBQzlCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWMsQ0FBQyxDQUFBLENBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFjLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUUsQ0FBQSxDQUFBO0FBQ2pDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBRSxDQUFBLENBQUE7QUFDL0IsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFnQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQyxDQUFBLENBQUUsQ0FBRSxDQUFBLENBQUE7QUFDN0IsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLE9BQU8sQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBRSxDQUFBLENBQUMsQ0FBQztBQUNwRCxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQVUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxXQUFXLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUM7QUFDaEQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBZSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsSUFBSSxDQUFFLENBQUEsQ0FBQTtBQUM1QyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQWdCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBZSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztBQUMvRSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWlCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBRSxDQUFBLENBQUE7QUFDL0MsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBb0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBVyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsZ0JBQWdCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUM7QUFDckQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBRSxDQUFBLENBQUE7QUFDbEQsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBb0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBVyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsZ0JBQWdCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUM7QUFDckQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxpQkFBaUIsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLEVBQUUsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLGNBQWMsQ0FBRSxDQUFBLENBQUE7QUFDcEUsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFpQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsWUFBWSxDQUFFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFjLENBQUMsQ0FBQztBQUNoRSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLE9BQU8sQ0FBaUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLFlBQVksQ0FBRSxDQUFBLENBQUE7QUFDckQsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLGlCQUFpQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUMsQ0FBQztBQUN2RCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBYSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsWUFBWSxDQUFFLENBQUEsQ0FBQTtBQUNqRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFhLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUMsQ0FBQztBQUNwRCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFXLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFFLENBQUEsQ0FBQTtBQUNoQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFXLENBQUM7QUFDbkMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFXLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUUsQ0FBQSxDQUFBO0FBQzlCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVcsQ0FBQztBQUM1QyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBRSxDQUFBLENBQUMsQ0FBRSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFFLENBQUEsQ0FBQTtBQUNqRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUcsQ0FBQSxDQUFBLENBQUMsS0FBSyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNwQyxDQUFZLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUssQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFnQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLFFBQVEsQ0FBRSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFDLENBQUM7QUFDckQsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLFdBQVcsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxFQUFFLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDOUMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQW1CLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsUUFBUSxDQUFFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBQztBQUM1RCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxDQUFDLENBQUM7QUFDWCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUE7O0FDN0hPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLHFCQUFxQixDQUFDLENBQUE7QUFDbkMsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVcsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBRSxDQUFBLENBQUE7QUFDMUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsUUFBUSxDQUFDO0FBQ2pDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLElBQUksQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNqQixDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxNQUFNLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxFQUFFLENBQUM7QUFDMUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sSUFBSSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2pCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFJLEVBQUUsQ0FBQztBQUMxQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE1BQU0sQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUNqQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxDQUFDO0FBQ3BDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksVUFBVSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ3JCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUM7QUFDeEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2xCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxPQUFPLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxPQUFPLENBQUM7QUFDckMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksRUFBRSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLEVBQUUsQ0FBQztBQUNoQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxFQUFFLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsSUFBSSxDQUFFLENBQUEsQ0FBQTtBQUNoRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWUsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDaEYsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE9BQU8sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBcUIsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZSxDQUFDLENBQUM7QUFDMUQsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0wsQ0FBQTs7QUMxRFksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFxQixDQUFFLENBQUE7QUFDOUM7QUFDTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxtQkFBbUIsQ0FBQyxDQUFBO0FBQ2pDO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFhLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBRSxNQUFNLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBRSxDQUFBLENBQUE7QUFDcEQsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLGVBQWUsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ2xELENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLHFCQUFxQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFlLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDcEUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksYUFBYSxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLEdBQUcsQ0FBRSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxFQUFFLENBQWMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxzQkFBc0IsQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxFQUFFLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsSUFBSSxDQUFFLENBQUEsQ0FBQTtBQUMxRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsTUFBTSxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsRUFBRSxDQUFDO0FBQ3hDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLEtBQUssQ0FBRSxDQUFBLENBQUE7QUFDbEMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQztBQUMxQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNUO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLE1BQU0sQ0FBRyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWMsRUFBRSxDQUFDO0FBQ3pDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxDQUFDLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQyxNQUFNLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBRyxDQUFDLENBQUM7QUFDOUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxPQUFPLENBQUM7QUFDOUI7QUFDQSxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxjQUFjLENBQUUsQ0FBQSxDQUFBO0FBQzVCLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZSxFQUFFLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLENBQWMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDOUUsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDVCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsR0FBRyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVUsQ0FBRyxDQUFBLENBQUEsQ0FBQyxLQUFLLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ3BDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQTBCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFzQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDMUYsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVMsQ0FBQztBQUNWLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFHLENBQUEsQ0FBQSxDQUFDLENBQVMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDOUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVksT0FBTyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQUMsQ0FBQztBQUN2RCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxDQUFDO0FBQ1YsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQWEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUMvRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFHLENBQUEsQ0FBQSxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFHLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDL0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBZ0IsSUFBSSxDQUFHLENBQUEsQ0FBQSxDQUFDLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxHQUFHLENBQUUsQ0FBQSxDQUFBO0FBQ3hDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBb0IsT0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFHLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWlCLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDdkIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFvQixNQUFNLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFVLENBQUMsQ0FBQztBQUMzQyxDQUFpQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ2pCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWEsQ0FBQztBQUNkLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUcsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNsQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFnQixDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQW1CLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUM1QyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFhLENBQUM7QUFDZCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxDQUFDLENBQUM7QUFDWCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsR0FBRyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBQyxDQUFDO0FBQzNCLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLGFBQWEsQ0FBQztBQUM3QixDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksMEJBQTBCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBc0IsRUFBRSxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsS0FBSyxDQUFFLENBQUEsQ0FBQTtBQUN0RSxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxzQkFBc0IsQ0FBRSxDQUFBLENBQUE7QUFDcEMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBc0IsQ0FBQyxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUMsTUFBTSxDQUFFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFLLENBQUMsQ0FBQztBQUN2RCxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNULENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMLENBQUE7O0FDMUVPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLHFCQUFxQixDQUFDLENBQUE7QUFDbkM7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBaUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUcsQ0FBQSxDQUFBLENBQUEsQ0FBRSxLQUFLLENBQUUsQ0FBQSxDQUFBO0FBQ3pDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUMvQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQW9CLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBRSxDQUFBLENBQUE7QUFDckMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBaUIsQ0FBQyxDQUFBLENBQUEsQ0FBRyxDQUFFLENBQUEsQ0FBQTtBQUNsQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQztBQUN6RCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWlCLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBRSxDQUFBLENBQUE7QUFDbEMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sTUFBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFZLENBQUMsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUcsQ0FBQSxDQUFBLENBQUMsQ0FBQztBQUNoRCxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBO0FBQ0EsQ0FBQTs7QUNqQlksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQXlCLENBQUUsQ0FBQTtBQUNsRDtBQUNPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDckM7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFJLE9BQU8sQ0FBbUIsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFHLENBQUEsQ0FBQSxDQUFBLENBQUUsS0FBSyxDQUFFLENBQUEsQ0FBQTtBQUMzQyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWMsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLENBQUMsQ0FBRyxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ2pELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQXNCLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBRSxDQUFBLENBQUE7QUFDdkMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBYyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsVUFBVSxDQUFDLENBQUEsQ0FBQSxDQUFHLENBQUMsQ0FBQztBQUM5QyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFDLENBQUEsQ0FBQSxDQUFHLENBQUUsQ0FBQSxDQUFBO0FBQ3BDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQWMsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBRyxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ2xELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQUMsQ0FBQSxDQUFBLENBQUcsQ0FBRSxDQUFBLENBQUE7QUFDcEMsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFjLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBRyxDQUFBLENBQUEsQ0FBQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDO0FBQzNELENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxPQUFPLENBQWlCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFHLENBQUEsQ0FBQSxDQUFBLENBQUUsS0FBSyxDQUFFLENBQUEsQ0FBQTtBQUN6QyxDQUFRLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBWSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sQ0FBQyxDQUFHLENBQUEsQ0FBQSxDQUFDLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDL0MsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQTtBQUNBLENBQUE7O0FDeEJPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLGVBQWUsQ0FBQyxDQUFBO0FBQzdCO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksT0FBTyxDQUFnQixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLE1BQU0sQ0FBRSxDQUFBLENBQUE7QUFDMUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFRLENBQU0sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBRyxDQUFBLENBQUEsQ0FBQyxLQUFLLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ2hDLENBQVksQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksY0FBYyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBSyxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ1QsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBZ0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxJQUFJLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFFLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBRSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQTtBQUNoRSxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTCxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQTs7QUNoQlksQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBYyxDQUFFLENBQUE7QUFDdkM7QUFDTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxZQUFZLENBQUMsQ0FBQTtBQUMxQjtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBSSxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLENBQUUsQ0FBQSxDQUFBO0FBQ3pCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRyxTQUFTLENBQUM7QUFDcEMsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sSUFBSSxDQUFHLENBQUEsQ0FBQSxDQUFBO0FBQ2xCLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxNQUFNLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUksRUFBRSxDQUFDO0FBQzlCLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0E7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLFVBQVUsQ0FBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUyxFQUFFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsV0FBVyxDQUFFLENBQUEsQ0FBQTtBQUNyRCxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsQ0FBTSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFPLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUMsQ0FBWSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFXLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFFLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBUyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFDO0FBQ25FLENBQUssQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNMO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFJLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU8sT0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFTLEVBQUUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxXQUFXLENBQUUsQ0FBQSxDQUFBO0FBQ2xELENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBUSxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQU8sQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVcsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBRSxDQUFTLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQUM7QUFDaEUsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0w7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBSSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFPLFVBQVUsQ0FBRyxDQUFBLENBQUEsQ0FBQTtBQUN4QixDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQVEsT0FBTyxDQUFNLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLENBQVEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFDLElBQUksQ0FBQztBQUNwQyxDQUFLLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDTDtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLENBQUEsQ0FBQSxDQUFBLENBQUksQ0FBTyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQXVCLENBQUMsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQU0sQ0FBRSxDQUFBLENBQUE7QUFDM0MsQ0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFlLENBQUMsQ0FBZ0IsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQyxVQUFVLENBQUUsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBTSxDQUFDLENBQUM7QUFDN0QsQ0FBSyxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0wsQ0FBQTs7In0=
