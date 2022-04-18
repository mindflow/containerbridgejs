import { Method } from "coreutil_v1";

export class ContainerWindow {

    /**
     * 
     * @param {String} type 
     * @param {Method} listener 
     * @param {any} eventWrapperClass 
     */    
    static addEventListener(type, method, eventWrapperClass) {
        window.addEventListener(type, (event) => {
            method.call(new eventWrapperClass(event));
        });
    }
    
}