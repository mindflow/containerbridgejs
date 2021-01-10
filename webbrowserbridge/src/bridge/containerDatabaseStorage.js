export class ContainerDatabaseStorage {

    /**
     * 
     * @param {String} dbName 
     * @param {Number} version
     * @returns {IDBOpenDBRequest}
     */
    static open(dbName, version) {
        return window.indexedDB.open(dbName, version);
    }

}