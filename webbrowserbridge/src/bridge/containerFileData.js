export class ContainerFileData {
    
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        this.name = file.name;
        this.type = file.type;
        this.size = file.size;
        this.lastModified = file.lastModified;
        this.file = file;
    }
}