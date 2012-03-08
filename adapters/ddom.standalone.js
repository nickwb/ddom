/*
 *  DynamicDOM - Standalone Adapter
 *  Copyright (c) 2012 Nick Young.
 *
 *  This is free software, licensed under the MIT license.
 */
(function(window, document, undefined){
    
    var each = function(list, callback) { 
        var i = 0, length = list.length;
        for ( ; i < length; ) {
            if ( callback( list[ i++ ] ) === false ) {
                break;
            }
        }
    };
    
    var extend = function (target, source) { 
        var x;
        for(x in source) { target[x] = source[x]; }
        return target;
    };
    
    // isType, code borrowed from http://bonsaiden.github.com/JavaScript-Garden/
    var isType = function(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    };
    
    // isObject, code borrowed largely from jQuery.isPlainObject.
    var isObject = function (obj) {
        var hasOwn = Object.prototype.hasOwnProperty;
        
        if ( !obj || !isType('Object', obj) || obj.nodeType) {
            return false;
        }

        try {
            if ( obj.constructor &&
                !hasOwn.call(obj, 'constructor') &&
                !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf') ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }

        var key;
        for ( key in obj ) {}

        return key === undefined || hasOwn.call( obj, key );
    };
    
    // setCss, code borrowed from jQuery.camelCase
    var setCss = function (elm, properties) {
        var rdashAlpha = /-([a-z]|[0-9])/ig,
            rmsPrefix = /^-ms-/,
            ccReplace = function( all, letter ) {
                return ( letter + "" ).toUpperCase();
            },
            camelCase = function( string ) {
                return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, ccReplace );
            },
            props = {},
            p;
        
        for(p in properties) {
            props[camelCase(p)] = properties[p];
        }
        
        extend(elm.style, props);
    };
    
    var setEvents = function(elm, eventMap) {
        var p;
        for(p in eventMap) {
            each(p.split(' '), function(e) {
                if(elm.addEventListener) {
                    elm.addEventListener(e, eventMap[p], false);
                } else {
                    elm['on' + e] = eventMap[p];
                }
            });
        }
    };
    
    var isNode = function (obj) {
        if(obj === null || obj === undefined) {
            return false;
        }
        
        if(isNode.tst === undefined) {
            isNode.tst = false;
            try { isNode.tst = (document.createTextNode('a') instanceof Node); } catch(e) { }
        }
        
        return isNode.tst 
                ? (obj instanceof Node)
                : (isType('Number', obj.nodeType) && isType('String', obj.nodeName));
    };
    
    window._dd = { adapter: [
        // each
        each,
        
        // setCss
        setCss,
        
        // setEvents
        setEvents,
        
        // extend
        extend,
        
        // isArray
        function (obj) { return isType('Array', obj) },
        
        // isFunction
        function (obj) { return isType('Function', obj) },
        
        // isObject
        isObject,
        
        // isNode
        isNode,
        
        // isString
        function (obj) { return isType('String', obj) }
    ] };
    
})(this, this.document);