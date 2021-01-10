import { Logger } from "coreutil_v1";

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
     * @param {String} parentElementTagName 
     * @param {Element} element 
     */
    static addElement(parentElementTagName, element) {
        const header = document.getElementsByTagName(parentElementTagName)[0];
        header.append(element);
    }

    /**
     * 
     * @param {String} parentElementTagName 
     * @param {Element} element 
     */
    static preprendElement(parentElementTagName, element) {
        const body = document.getElementsByTagName(parentElementTagName)[0];
        body.prepend(element);
    }

}