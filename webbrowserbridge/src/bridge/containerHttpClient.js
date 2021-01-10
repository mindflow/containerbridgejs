import { Logger } from "coreutil_v1";
import { ContainerAsync } from "./containerAsync";

const LOG = new Logger("ContainerHttpClient");

export class ContainerHttpClient {

        /**
     * 
     * @param {String} url 
     * @param {Object} params 
     * @param {Number} connectionTimeout
     * @param {Number} responseTimeout
     */
    static fetch(url, params, connectionTimeout = 1000, responseTimeout = 4000) {
        return ContainerAsync.timeout(connectionTimeout, window.fetch(url, params));
    }

}