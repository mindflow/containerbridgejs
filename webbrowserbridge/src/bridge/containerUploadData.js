import { ContainerFileData } from "./containerFileData.js";

export class ContainerUploadData {

    /**
     * 
     */
    constructor() {
        /** @type {Map<String, ContainerFileData>} */
        this.filesMap = new Map();
    }

    /**
     * 
     * @param {ContainerFileData[]} files 
     * @returns {ContainerUploadData}
     */
    static fromFiles(files) {
        const uploadData = new ContainerUploadData();
        for (const file of files) {
            uploadData.set(file.name, file);
        }
        return uploadData;
    }

    /**
     * 
     * @param {String} name 
     * @param {ContainerFileData} fileData 
     * @return {ContainerUploadData}
     */
    set(name, fileData) {
        this.filesMap.set(name, fileData);
        return this;
    }

    _asFormData() {
        const formData = new FormData();
        for (const file of this.files) {
            formData.append('files', file.file, file.name);
        }
        return formData;
    }

    /**
     * 
     * @returns {ContainerFileData[]}
     */
    get files() {
        return Array.from(this.filesMap.values());
    }
}