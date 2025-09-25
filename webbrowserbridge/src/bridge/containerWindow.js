import { Method } from "coreutil_v1";

export class ContainerWindow {

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
        }
        window.addEventListener(type, func);
        return () => { window.removeEventListener(type, func); }
    }
    
}