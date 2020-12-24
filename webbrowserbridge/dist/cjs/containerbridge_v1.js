'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var coreutil_v1 = require('coreutil_v1');

const LOG = new coreutil_v1.Logger("ContainerFunctions");

class ContainerFunctions {

    /**
     * 
     * @param {String} urlString 
     */
    static loadUrl(urlString) {
        window.location = urlString;
    }

     /**
     * 
     * @param {Object} stateObject 
     * @param {String} title 
     * @param {String} urlString 
     */
    static replaceUrl(urlString, title, stateObject) {
        window.history.replaceState(stateObject, title, urlString);
    }

    /**
     * 
     * @param {Object} stateObject 
     * @param {String} title 
     * @param {String} urlString 
     */
    static pushUrl(urlString, title, stateObject) {
        window.history.pushState(stateObject, title, urlString);
    }

    /**
     * @returns {String}
     */
    static currentUrl() {
        return window.location.href;
    }

    /**
     * 
     * @param {string} id 
     */
    static getElementById(id) {
        return document.getElementById(id);
    }

    /**
     * 
     * @param {string} valeu 
     */
    static createTextNode(value) {
        return document.createTextNode(value)
    }

    /**
     * 
     * @param {string} name 
     */
    static createElement(name) {
        return document.createElement(name)
    }

    /**
     * 
     * @param {string} nameSpace 
     * @param {string} name 
     */
    static createElementNS(nameSpace, name) {
        return document.createElementNS(nameSpace, name);
    }

    /**
     * 
     * @param {string} url 
     * @param {object} params 
     */
    static fetch(url, params, connectionTimeout = 1000, responseTimeout = 4000) {
        return ContainerBridge.timeout(connectionTimeout, window.fetch(url, params));
    }

    // Storage bridge

    static setSessionAttribute(key, value) {
        window.sessionStorage.setItem(key,value);
    }

    static removeSessionAttribute(key) {
        window.sessionStorage.removeItem(key);
    }

    static getSessionAttribute(key) {
        return window.sessionStorage.getItem(key);
    }

    static hasSessionAttribute(key) {
        return window.sessionStorage.getItem(key) !== null;
    }

    static setLocalAttribute(key, value) {
        window.localStorage.setItem(key,value);
    }

    static removeLocalAttribute(key) {
        window.localStorage.removeItem(key);
    }

    static hasLocalAttribute(key) {
        return window.localStorage.getItem(key) !== null;
    }

    static getLocalAttribute(key) {
        return window.localStorage.getItem(key);
    }

    static removeElement(id) {
        const element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }

    static addHeaderElement(element) {
        const header = document.getElementsByTagName("head")[0];
        header.append(element);
    }

    static addBodyElement(element) {
        const body = document.getElementsByTagName("body")[0];
        body.append(element);
    }

    static prependHeaderElement(element) {
        const header = document.getElementsByTagName("head")[0];
        header.prepend(element);
    }

    static prependBodyElement(element) {
        const body = document.getElementsByTagName("body")[0];
        body.prepend(element);
    }

    static timeout(milliseconds, promise) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            reject(new Error("timeout"));
          }, milliseconds);
          promise.then(resolve, reject);
        });
      }

}

exports.ContainerFunctions = ContainerFunctions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyYnJpZGdlX3YxLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYnJpZGdlL2NvbnRhaW5lckZ1bmN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiY29yZXV0aWxfdjFcIjtcclxuXHJcbmNvbnN0IExPRyA9IG5ldyBMb2dnZXIoXCJDb250YWluZXJGdW5jdGlvbnNcIik7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyRnVuY3Rpb25zIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFN0cmluZyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvYWRVcmwodXJsU3RyaW5nKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsU3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0IFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFN0cmluZyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlcGxhY2VVcmwodXJsU3RyaW5nLCB0aXRsZSwgc3RhdGVPYmplY3QpIHtcclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGVPYmplY3QsIHRpdGxlLCB1cmxTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsU3RyaW5nIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcHVzaFVybCh1cmxTdHJpbmcsIHRpdGxlLCBzdGF0ZU9iamVjdCkge1xyXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iamVjdCwgdGl0bGUsIHVybFN0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3VycmVudFVybCgpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldEVsZW1lbnRCeUlkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGV1IFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlVGV4dE5vZGUodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudChuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVTcGFjZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudE5TKG5hbWVTcGFjZSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZVNwYWNlLCBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmZXRjaCh1cmwsIHBhcmFtcywgY29ubmVjdGlvblRpbWVvdXQgPSAxMDAwLCByZXNwb25zZVRpbWVvdXQgPSA0MDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lckJyaWRnZS50aW1lb3V0KGNvbm5lY3Rpb25UaW1lb3V0LCB3aW5kb3cuZmV0Y2godXJsLCBwYXJhbXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdG9yYWdlIGJyaWRnZVxyXG5cclxuICAgIHN0YXRpYyBzZXRTZXNzaW9uQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcclxuICAgICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZW1vdmVTZXNzaW9uQXR0cmlidXRlKGtleSkge1xyXG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhhc1Nlc3Npb25BdHRyaWJ1dGUoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldExvY2FsQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlTG9jYWxBdHRyaWJ1dGUoa2V5KSB7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhhc0xvY2FsQXR0cmlidXRlKGtleSkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0TG9jYWxBdHRyaWJ1dGUoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZW1vdmVFbGVtZW50KGlkKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFkZEhlYWRlckVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuICAgICAgICBoZWFkZXIuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhZGRCb2R5RWxlbWVudChlbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcclxuICAgICAgICBib2R5LmFwcGVuZChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJlcGVuZEhlYWRlckVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuICAgICAgICBoZWFkZXIucHJlcGVuZChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJlcGVuZEJvZHlFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xyXG4gICAgICAgIGJvZHkucHJlcGVuZChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdGltZW91dChtaWxsaXNlY29uZHMsIHByb21pc2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidGltZW91dFwiKSlcclxuICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcylcclxuICAgICAgICAgIHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbn0iXSwibmFtZXMiOlsiTG9nZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxNQUFNLEdBQUcsR0FBRyxJQUFJQSxrQkFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDN0M7QUFDTyxNQUFNLGtCQUFrQixDQUFDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRTtBQUM5QixRQUFRLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQ3BDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7QUFDckQsUUFBUSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FB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