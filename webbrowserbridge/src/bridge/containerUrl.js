import { Logger, ObjectFunction } from "coreutil_v1";
import { ContainerWindow } from "./containerWindow";

const LOG = new Logger("ContainerUrl");

export class ContainerUrl {

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
     * @param {ObjectFunction} objectFunction
     * @param {any} eventWrapperClass
     */
    static addUserNavigateListener(objectFunction, eventWrapperClass) {
        ContainerWindow.addEventListener("popstate", objectFunction, eventWrapperClass);
    }
}