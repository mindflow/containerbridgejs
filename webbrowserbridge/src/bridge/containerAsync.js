export class ContainerAsync {

    static timeout(milliseconds, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, milliseconds)
            promise.then(resolve, reject);
        });
    }


}