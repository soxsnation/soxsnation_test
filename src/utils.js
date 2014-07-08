'use strict';

(function(Bacon, alia, undefined) {



    /**
     * @name alia.isArray
     * @module alia
     * @function
     *
     * @description
     * Determines if a reference is an `Array`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Array`.
     */
    alia.isArray = function(value) {
        return toString.call(value) === '[object Array]';
    }

    alia.isArrayLike = function(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return alia.isString(obj) || alia.isArray(obj) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
    }

    /**
     * @ngdoc function
     * @name angular.isDefined
     * @module ng
     * @function
     *
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    alia.isDefined = function(value) {
        return typeof value !== 'undefined';
    }

    alia.isNull = function(value) {
        return value === null;
    }

    alia.isNotNull = function(value) {
        return value !== null;
    }

    /**
     * @name alia.isObject
     * @function
     *
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    alia.isObject = function(value) {
        return value != null && typeof value === 'object';
    }

    alia.isProperty = function(value) {
        return value instanceof Bacon.Property;
    };

    // alia.isObservable = function(value) {
    //     return value instanceof Bacon.Property || value instanceof Bacon.EventStream;
    // };

    // alia.isObserver = function(value) {
    //     return value instanceof Bacon.Property && typeof value.set === 'function';
    // };

    alia.isString = function(value) {
        return typeof value === 'string';
    }

    alia.isEmptyString = function(value) {
        return typeof value !== 'string' || value.length === 0;
    };

    alia.isNotEmptyString = function(value) {
        return typeof value === 'string' && value.length > 0;
    };

    /**
     * @name alia.isUndefined
     * @module ng
     * @function
     *
     * @description
     * Determines if a reference is undefined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined.
     */
    alia.isUndefined = function(value) {
        return typeof value === 'undefined';
    }

    alia.isNotUndefined = function(value) {
        return typeof value !== 'undefined';
    }

    alia.isWindow = function(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }


}(Bacon, window.alia = window.alia || {}));