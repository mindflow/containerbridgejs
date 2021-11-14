import { ObjectFunction } from "coreutil_v1";

export class ContainerWindow {

    /**
     * 
     * @param {String} type 
     * @param {ObjectFunction} listener 
     * @param {any} eventWrapperClass 
     */    
    static addEventListener(type, objectFunction, eventWrapperClass) {
        window.addEventListener(type, (event) => {
            objectFunction.call(new eventWrapperClass(event));
        });
    }
    
}