export class ContainerDownload {

    /**
     * 
     * @param {Blob} blob 
     * @param {String} name
     */
    constructor(blob, name = "download", status = 200) {
        /** @type {Blob} */
        this.blob = blob;

        /** @type {String} */
        this.name = name;

        /** @type {Number} */
        this.status = status;
    }

    /**
     * 
     * @returns {Promise<void>}
     */
    async trigger() {
        const objectURL = window.URL.createObjectURL(this.blob);
        //window.open(objectURL);
        const downloadLink = document.createElement("a");
        downloadLink.href = objectURL;
        downloadLink.download = this.name;
        //document.body.appendChild(downloadLink); // Optional: append to body
        downloadLink.click();
        //document.body.removeChild(downloadLink); // Optional: remove after click
        
    }
}