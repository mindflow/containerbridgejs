import { Logger, Method } from "coreutil_v1";
import { ContainerHttpResponse } from "./containerHttpResponse";
import { ContainerUploadData } from "./containerUploadData";
import { ContainerDownload } from "./containerDownload";

const LOG = new Logger("ContainerHttpClient");

export class ContainerHttpClient {

    /**
     * @param {String} url 
     * @param {Object} params 
     * @param {Number} timeout
     * @return {Promise<ContainerHttpResponse>}
     */
    static async fetch(url, params, timeout = 4000) {
        try {
            const response = await fetch(url, params);
            return ContainerHttpResponse._fromResponse(response);
        } catch (error) {
            // If error from fetch is a timeout
            if (error.name && error.name.toLowerCase() === "aborterror") {
                LOG.error("Fetch call to " + url + " timed out after " + timeout + "ms");
                throw { "message": "Request timed out", "group": -1, "code" : -11 };
            }
            // If error from fetch is a network error
            if (error.message && error.message.toLowerCase() === "failed to fetch") {
                LOG.error("Network error during fetch call to " + url + ": " + error);
                throw { "message": "Network error", "group": -1, "code"  : -12 };
            }
            LOG.error("Unknown error during fetch call to " + url + ": " + error);
            throw { "message": "Unknown error", "group": -1, "code" : -10 };
        }
    }

    /**
     * @param {String} method
     * @param {String} url 
     * @param {ContainerUploadData} containerUploadData 
     * @param {Method} progressCallbackMethod 
     * @param {Number} timeout 
     * @returns {Promise<ContainerHttpResponse>}
     */
    static async upload(method, url, containerUploadData, authentication = null, progressCallbackMethod = null, timeout = 4000) {

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = timeout;
        xhr.setRequestHeader("Accept", "application/json");
        if (authentication) {
            xhr.setRequestHeader("Authorization", authentication);
        }
        xhr.onprogress = (event) => {
            progressCallbackMethod.call([Math.round((event.loaded / event.total) * 100)]);
        };
        xhr.ontimeout = () => {
            throw { "message": "Request timed out", "group": -1, "code"  : -11 };
        };
        xhr.onerror = () => {
            throw { "message": "Request failed", "group": -1, "code"  : -12 };
        }

        const formData = containerUploadData._asFormData();

        xhr.send(formData);
        return ContainerHttpResponse._fromXhr(xhr, progressCallbackMethod);
        
    }

    /**
     * @param {String} url 
     * @param {Object} params 
     * @param {Number} timeout
     * @returns {Promise<ContainerDownload>}
     */
    static async download(url, params, timeout = 4000) {
        const response = await fetch(url, params);
        const blob = await response.blob();
        const fileName = response.headers.get("X-File-Name") || "download";
        const status = response.status;
        const containerDownload = new ContainerDownload(blob, fileName, status);
        return containerDownload;
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