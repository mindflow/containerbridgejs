import { Logger, TimePromise } from "coreutil_v1";

const LOG = new Logger("ContainerElement");

export class ContainerElement {


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
        }
        element.addEventListener("scroll", scrollTo);
        TimePromise.asPromise(duration, () => {
            element.removeEventListener("scroll", scrollTo);
        });
    }

}