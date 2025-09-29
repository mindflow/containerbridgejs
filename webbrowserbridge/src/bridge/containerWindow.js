import { Method } from "coreutil_v1";
import { ContainerEvent } from "./containerEvent";

export class ContainerWindow {

    /**
     * 
     * @param {String} type 
     * @param {Method} listener 
     * @return {Method} destroy function
     */    
    static addEventListener(type, method) {
        const func = (event) => {
            method.call(new ContainerEvent(event));
        }
        window.addEventListener(type, func);
        return () => { window.removeEventListener(type, func); }
    }
    
}