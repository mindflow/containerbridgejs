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

new coreutil_v1.Logger("ContainerElement");

class ContainerElementUtils {


    /**
     * 
     * @param {string} id 
     */
    static getElementById(id) {
        return document.getElementById(id);
    }

    /**
     * 
     * @param {string} valeu 
     */
    static createTextNode(value) {
        return document.createTextNode(value)
    }

    /**
     * 
     * @param {string} name 
     */
    static createElement(name) {
        return document.createElement(name)
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
        return document.createElementNS(nameSpace, name);
    }

    /**
     * 
     * @param {Element} element 
     */
    static appendRootUiChild(element) {
        const header = document.getElementsByTagName("body")[0];
        header.appendChild(element);
    }


    /**
     * 
     * @param {Element} element 
     */
     static appendRootMetaChild(element) {
        const header = document.getElementsByTagName("head")[0];
        header.appendChild(element);
    }

    /**
     * 
     * @param {Element} parentElement 
     * @param {Element} childElement 
     */
     static prependChild(parentElement, childElement) {
        parentElement.prepend(childElement);
    }


    /**
     * 
     * @param {Element} parentElement 
     * @param {Element} childElement 
     */
    static appendChild(parentElement, childElement) {
        parentElement.appendChild(childElement);
    }

    /**
     * 
     * @param {Element} element 
     * @param {String} eventType 
     * @param {Function} listener 
     * @param {boolean} capture 
     */
    static addEventListener(element, eventType, listener, capture) {
        element.addEventListener(eventType, listener, capture);
    }

    /**
     * 
     * @param {Element} element 
     * @param {String} attributeKey 
     * @param {any} attributeValue 
     */
    static setAttribute(element, attributeKey, attributeValue) {
        element.setAttribute(attributeKey, attributeValue);
    }

    /**
     * 
     * @param {Element} element 
     * @param {String} attributeKey 
     */
     static getAttribute(element, attributeKey) {
        return element.getAttribute(attributeKey);
    }

    /**
     * 
     * @param {Element} prentElement 
     * @param {Element} childElement 
     */
    static contains(prentElement, childElement) {
        return prentElement.contains(childElement);
    }

    static isConnected(element) {
        return element.isConnected;
    }

    static isUIElement(value) {
        return value instanceof HTMLElement;
    }

    /**
     * 
     * @param {Element} element element to scroll lock
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
            return this.event.target.files;
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
     * @returns {SimpleElement}
     */
    get target(){
        if (this.event && this.event.target) {
            return ConfiguredFunction.execute("mapElement", this.event.target);
        }
    }

    /**
     * 
     * @returns {SimpleElement}
     */
    get relatedTarget(){
        if (this.event && this.event.relatedTarget) {
            return ConfiguredFunction.execute("mapElement", this.event.relatedTarget);
        }
        return null;
    }

    /**
     * 
     * @returns {string}
     */
     getRelatedTargetAttribute(attributeName){
        if (this.event.relatedTarget) {
            return ConfiguredFunction.execute("mapElement", this.event.relatedTarget).getAttributeValue(attributeName);
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
     * @param {any} eventWrapperClass 
     * @return {Method} destroy function
     */    
    static addEventListener(type, method, eventWrapperClass) {
        const func = (event) => {
            method.call(new eventWrapperClass(event));
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
     * @param {any} eventWrapperClass
     */
    static addUserNavigateListener(method, eventWrapperClass) {
        ContainerWindow.addEventListener("popstate", method, eventWrapperClass);
    }
}

exports.ContainerAsync = ContainerAsync;
exports.ContainerCredentialsStorage = ContainerCredentialsStorage;
exports.ContainerDatabaseStorage = ContainerDatabaseStorage;
exports.ContainerElementUtils = ContainerElementUtils;
exports.ContainerEvent = ContainerEvent;
exports.ContainerHttpClient = ContainerHttpClient;
exports.ContainerHttpResponse = ContainerHttpResponse;
exports.ContainerLocalStorage = ContainerLocalStorage;
exports.ContainerSessionStorage = ContainerSessionStorage;
exports.ContainerUrl = ContainerUrl;
exports.ContainerWindow = ContainerWindow;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckFzeW5jLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJDcmVkZW50aWFsc1N0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckRhdGFiYXNlU3RvcmFnZS5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVyRWxlbWVudFV0aWxzLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJFdmVudC5qcyIsIi4uLy4uL3NyYy9icmlkZ2UvY29udGFpbmVySHR0cFJlc3BvbnNlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJIdHRwQ2xpZW50LmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJMb2NhbFN0b3JhZ2UuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclNlc3Npb25TdG9yYWdlLmpzIiwiLi4vLi4vc3JjL2JyaWRnZS9jb250YWluZXJXaW5kb3cuanMiLCIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lclVybC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29udGFpbmVyQXN5bmMge1xuXG4gICAgc3RhdGljIHRpbWVvdXQobWlsbGlzZWNvbmRzLCBwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInRpbWVvdXRcIikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsYXkobWlsbGlzZWNvbmRzLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChjYWxsYmFjaywgbWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge2xvbmd9IG1pbGxpc2Vjb25kcyBcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdoZW4gbWlsbGlzZWNvbmRzIGhhdmUgcGFzc2VkXG4gICAgICovXG4gICAgc3RhdGljIHBhdXNlKG1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyQ3JlZGVudGlhbHNTdG9yYWdlIHtcblxuICAgIHN0YXRpYyBhc3luYyBzdG9yZSh1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5QYXNzd29yZENyZWRlbnRpYWwpIHtcblx0XHRcdGNvbnN0IHBhc3N3b3JkQ3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuXHRcdFx0XHRpZDogdXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vY29uc3QgcGFzc3dvcmRDcmVkZW50aWFsc0RhdGEgPSBuZXcgQ3JlZGVudGlhbENyZWF0aW9uT3B0aW9ucygpO1xuXHRcdFx0Y29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShwYXNzd29yZENyZWRlbnRpYWwpO1xuICAgICAgICAgICAgTE9HLmluZm8oY3JlZGVudGlhbCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgQ29udGFpbmVyRGF0YWJhc2VTdG9yYWdlIHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYk5hbWUgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb25cbiAgICAgKiBAcmV0dXJucyB7SURCT3BlbkRCUmVxdWVzdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgb3BlbihkYk5hbWUsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuICAgIH1cblxufSIsImltcG9ydCB7IExvZ2dlciwgVGltZVByb21pc2UgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lckVsZW1lbnRcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJFbGVtZW50VXRpbHMge1xuXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgXG4gICAgICovXG4gICAgc3RhdGljIGdldEVsZW1lbnRCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGV1IFxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVUZXh0Tm9kZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVtb3ZlRWxlbWVudChpZCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVTcGFjZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudE5TKG5hbWVTcGFjZSwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVTcGFjZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFxuICAgICAqL1xuICAgIHN0YXRpYyBhcHBlbmRSb290VWlDaGlsZChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFxuICAgICAqL1xuICAgICBzdGF0aWMgYXBwZW5kUm9vdE1ldGFDaGlsZChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50RWxlbWVudCBcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkRWxlbWVudCBcbiAgICAgKi9cbiAgICAgc3RhdGljIHByZXBlbmRDaGlsZChwYXJlbnRFbGVtZW50LCBjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5wcmVwZW5kKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudEVsZW1lbnQgXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBjaGlsZEVsZW1lbnQgXG4gICAgICovXG4gICAgc3RhdGljIGFwcGVuZENoaWxkKHBhcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCkge1xuICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGUgXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjYXB0dXJlIFxuICAgICAqL1xuICAgIHN0YXRpYyBhZGRFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0cmlidXRlS2V5IFxuICAgICAqIEBwYXJhbSB7YW55fSBhdHRyaWJ1dGVWYWx1ZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVLZXkgXG4gICAgICovXG4gICAgIHN0YXRpYyBnZXRBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlS2V5KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcHJlbnRFbGVtZW50IFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gY2hpbGRFbGVtZW50IFxuICAgICAqL1xuICAgIHN0YXRpYyBjb250YWlucyhwcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gcHJlbnRFbGVtZW50LmNvbnRhaW5zKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzQ29ubmVjdGVkKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuaXNDb25uZWN0ZWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzVUlFbGVtZW50KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBlbGVtZW50IHRvIHNjcm9sbCBsb2NrXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHggeCBjb29yZGluYXRlIHRvIGxvY2sgdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSB5IGNvb3JkaW5hdGUgdG8gbG9jayB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBtaWxsaXNlY29uZHNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2Nyb2xsTG9ja1RvKGVsZW1lbnQsIHgsIHksIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQuc2Nyb2xsVG8oeCx5KTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2Nyb2xsVG8pO1xuICAgICAgICBUaW1lUHJvbWlzZS5hc1Byb21pc2UoZHVyYXRpb24sICgpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBzY3JvbGxUbyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBDb250YWluZXJFdmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihldmVudCl7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtFdmVudH0gKi9cbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgICAgICBpZiAodGhpcy5ldmVudC50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJkcmFnc3RhcnRcIil7XG4gICAgICAgICAgICB0aGlzLmV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3BsYWluJywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wUHJvcGFnYXRpb24oKXtcbiAgICAgICAgdGhpcy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgICAgICB0aGlzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGZpbGVzKCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudC50YXJnZXQgJiYgdGhpcy5ldmVudC50YXJnZXQuZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2ZW50LnRhcmdldC5maWxlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIC8qKiBAdHlwZSB7RGF0YVRyYW5zZmVyfSAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YVRyYW5zZmVyID0gdGhpcy5ldmVudC5kYXRhVHJhbnNmZXI7XG4gICAgICAgICAgICBpZiAoZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGV2ZW50IGFuZCB0aGUgZWRnZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNvbnRhaW5pbmcgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0IG9mZnNldFgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQub2Zmc2V0WDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZXZlbnQgYW5kIHRoZSBlZGdlIHkgY29vcmRpbmF0ZSBvZiB0aGUgY29udGFpbmluZyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5vZmZzZXRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRYO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3VzZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBjbGllbnQgd2luZG93IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgY2xpZW50WSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtTaW1wbGVFbGVtZW50fVxuICAgICAqL1xuICAgIGdldCB0YXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWd1cmVkRnVuY3Rpb24uZXhlY3V0ZShcIm1hcEVsZW1lbnRcIiwgdGhpcy5ldmVudC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMge1NpbXBsZUVsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0IHJlbGF0ZWRUYXJnZXQoKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC5yZWxhdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlndXJlZEZ1bmN0aW9uLmV4ZWN1dGUoXCJtYXBFbGVtZW50XCIsIHRoaXMuZXZlbnQucmVsYXRlZFRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICAgZ2V0UmVsYXRlZFRhcmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKXtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnQucmVsYXRlZFRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZ3VyZWRGdW5jdGlvbi5leGVjdXRlKFwibWFwRWxlbWVudFwiLCB0aGlzLmV2ZW50LnJlbGF0ZWRUYXJnZXQpLmdldEF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCB0YXJnZXRWYWx1ZSgpe1xuICAgICAgICBpZih0aGlzLnRhcmdldCkgeyBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQga2V5Q29kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQua2V5Q29kZTtcbiAgICB9XG5cbiAgICBpc0tleUNvZGUoY29kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudC5rZXlDb2RlID09PSBjb2RlO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29udGFpbmVyQXN5bmMgfSBmcm9tIFwiLi9jb250YWluZXJBc3luY1wiO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySHR0cFJlc3BvbnNlIHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fVxuICAgICAqL1xuICAgIGFzeW5jIGpzb24oKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlc3BvbnNlLmpzb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxuICAgICAqL1xuICAgIGFzeW5jIHRleHQoKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlc3BvbnNlLnRleHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlLnN0YXR1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBzdGF0dXNUZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIH1cblxuICAgIGdldCBoZWFkZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNwb25zZS5oZWFkZXJzO1xuICAgIH1cblxuICAgIGdldCBvaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzcG9uc2Uub2s7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICAgKiBAcmV0dXJucyB7Q29udGFpbmVySHR0cFJlc3BvbnNlfVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBmcm9tKHJlc3BvbnNlLCB0aW1lb3V0ID0gMTAwMCkge1xuICAgICAgICBjb25zdCB0aW1lb3V0UmVzcG9uc2UgPSBhd2FpdCBDb250YWluZXJBc3luYy50aW1lb3V0KHRpbWVvdXQsIHJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWluZXJIdHRwUmVzcG9uc2UodGltZW91dFJlc3BvbnNlKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTG9nZ2VyLCBNZXRob2QgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcbmltcG9ydCB7IENvbnRhaW5lckh0dHBSZXNwb25zZSB9IGZyb20gXCIuL2NvbnRhaW5lckh0dHBSZXNwb25zZVwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVySHR0cENsaWVudFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckh0dHBDbGllbnQge1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gICAgICogQHJldHVybiB7UHJvbWlzZTxDb250YWluZXJIdHRwUmVzcG9uc2U+fVxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBmZXRjaCh1cmwsIHBhcmFtcywgdGltZW91dCA9IDQwMDApIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VQcm9taXNlID0gZmV0Y2godXJsLCBwYXJhbXMpXG4gICAgICAgIHJldHVybiBDb250YWluZXJIdHRwUmVzcG9uc2UuZnJvbShyZXNwb25zZVByb21pc2UsIHRpbWVvdXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXG4gICAgICogQHBhcmFtIHtGaWxlW119IGZpbGVzIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyB1cGxvYWQodXJsLCBmaWxlcywgYXV0aGVudGljYXRpb24gPSBudWxsLCBwcm9ncmVzc0NhbGxiYWNrTWV0aG9kID0gbnVsbCwgdGltZW91dCA9IDQwMDApIHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwpO1xuICAgICAgICB4aHIudGltZW91dCA9IHRpbWVvdXQ7XG5cbiAgICAgICAgaWYgKGF1dGhlbnRpY2F0aW9uKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBhdXRoZW50aWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHhoci5vbnByb2dyZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsUHJvZ3Jlc3NDYWxsYmFja01ldGhvZChwcm9ncmVzc0NhbGxiYWNrTWV0aG9kLCBldmVudC5sb2FkZWQsIGV2ZW50LnRvdGFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9udGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1cGxvYWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICAgICAgcmV0dXJuIHVwbG9hZFByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtNZXRob2R9IHByb2dyZXNzQ2FsbGJhY2tNZXRob2QgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxvYWRlZCBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG90YWwgXG4gICAgICovXG4gICAgY2FsbFByb2dyZXNzQ2FsbGJhY2tNZXRob2QocHJvZ3Jlc3NDYWxsYmFja01ldGhvZCwgbG9hZGVkLCB0b3RhbCkge1xuICAgICAgICBpZiAocHJvZ3Jlc3NDYWxsYmFja01ldGhvZCkge1xuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFja01ldGhvZC5jYWxsKGxvYWRlZCwgdG90YWwpO1xuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBDb250YWluZXJMb2NhbFN0b3JhZ2Uge1xuXG4gICAgc3RhdGljIHNldExvY2FsQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSx2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZUxvY2FsQXR0cmlidXRlKGtleSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaGFzTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TG9jYWxBdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cblxufSIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuXG5jb25zdCBMT0cgPSBuZXcgTG9nZ2VyKFwiQ29udGFpbmVyU2Vzc2lvblN0b3JhZ2VcIik7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJTZXNzaW9uU3RvcmFnZSB7XG5cbiAgICBzdGF0aWMgc2V0U2Vzc2lvbkF0dHJpYnV0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSx2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZVNlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXNTZXNzaW9uQXR0cmlidXRlKGtleSkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0TG9jYWxBdHRyaWJ1dGUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcbiAgICB9XG5cblxufSIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCJjb3JldXRpbF92MVwiO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyV2luZG93IHtcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBsaXN0ZW5lciBcbiAgICAgKiBAcGFyYW0ge2FueX0gZXZlbnRXcmFwcGVyQ2xhc3MgXG4gICAgICogQHJldHVybiB7TWV0aG9kfSBkZXN0cm95IGZ1bmN0aW9uXG4gICAgICovICAgIFxuICAgIHN0YXRpYyBhZGRFdmVudExpc3RlbmVyKHR5cGUsIG1ldGhvZCwgZXZlbnRXcmFwcGVyQ2xhc3MpIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgbWV0aG9kLmNhbGwobmV3IGV2ZW50V3JhcHBlckNsYXNzKGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpOyB9XG4gICAgfVxuICAgIFxufSIsImltcG9ydCB7IExvZ2dlciwgTWV0aG9kIH0gZnJvbSBcImNvcmV1dGlsX3YxXCI7XG5pbXBvcnQgeyBDb250YWluZXJXaW5kb3cgfSBmcm9tIFwiLi9jb250YWluZXJXaW5kb3dcIjtcblxuY29uc3QgTE9HID0gbmV3IExvZ2dlcihcIkNvbnRhaW5lclVybFwiKTtcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lclVybCB7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBnbyh1cmxTdHJpbmcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsU3RyaW5nO1xuICAgIH1cblxuICAgIHN0YXRpYyBiYWNrKCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxuXG5cbiAgICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyByZXBsYWNlVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxuICAgICAqL1xuICAgIHN0YXRpYyBwdXNoVXJsKHVybFN0cmluZywgdGl0bGUsIHN0YXRlT2JqZWN0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3VycmVudFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TWV0aG9kfSBtZXRob2RcbiAgICAgKiBAcGFyYW0ge2FueX0gZXZlbnRXcmFwcGVyQ2xhc3NcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkVXNlck5hdmlnYXRlTGlzdGVuZXIobWV0aG9kLCBldmVudFdyYXBwZXJDbGFzcykge1xuICAgICAgICBDb250YWluZXJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIG1ldGhvZCwgZXZlbnRXcmFwcGVyQ2xhc3MpO1xuICAgIH1cbn0iXSwibmFtZXMiOlsiTG9nZ2VyIiwiVGltZVByb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFPLE1BQU0sY0FBYyxDQUFDO0FBQzVCO0FBQ0EsSUFBSSxPQUFPLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFO0FBQzFDLFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDckQsWUFBWSxVQUFVLENBQUMsV0FBVztBQUNsQyxnQkFBZ0IsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFDO0FBQzVDLGFBQWEsRUFBRSxZQUFZLEVBQUM7QUFDNUIsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxQyxTQUFTLENBQUMsQ0FBQztBQUNYLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxD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
