import { Logger } from "coreutil_v1";

const LOG = new Logger("ContainerFunctions");

export class ContainerFunctions {

    /**
     * 
     * @param {String} urlString 
     */
    static loadUrl(urlString) {
        window.location = urlString;
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
     * @param {string} nameSpace 
     * @param {string} name 
     */
    static createElementNS(nameSpace, name) {
        return document.createElementNS(nameSpace, name);
    }

    /**
     * 
     * @param {string} url 
     * @param {object} params 
     */
    static fetch(url, params, connectionTimeout = 1000, responseTimeout = 4000) {
        return ContainerFunctions.timeout(connectionTimeout, window.fetch(url, params));
    }

    // Storage bridge

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

    static removeLocalAttribute(key) {
        window.localStorage.removeItem(key);
    }

    static hasLocalAttribute(key) {
        return window.localStorage.getItem(key) !== null;
    }

    static getLocalAttribute(key) {
        return window.localStorage.getItem(key);
    }

    static removeElement(id) {
        const element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }

    static addHeaderElement(element) {
        const header = document.getElementsByTagName("head")[0];
        header.append(element);
    }

    static addBodyElement(element) {
        const body = document.getElementsByTagName("body")[0];
        body.append(element);
    }

    static prependHeaderElement(element) {
        const header = document.getElementsByTagName("head")[0];
        header.prepend(element);
    }

    static prependBodyElement(element) {
        const body = document.getElementsByTagName("body")[0];
        body.prepend(element);
    }

    static timeout(milliseconds, promise) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            reject(new Error("timeout"))
          }, milliseconds)
          promise.then(resolve, reject)
        });
      }

}