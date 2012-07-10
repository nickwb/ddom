/*
 *  DynamicDOM - jQuery Adapter
 *  Copyright (c) 2012 Nick Young.
 *
 *  This is free software, licensed under the MIT license.
 */

var DynamicDOM = {};
 
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
            : ($.type(obj.nodeType) === 'number' && $.type(obj.nodeName) === 'string');
};

DynamicDOM.adapter = {
    each: function(list, callback) { 
        $.each(list, function(i, x){ callback(x) })
    },
    
    setCss: function (elm, properties) {
        return $(elm).css(properties)
    },
    
    setEvents: function (elm, eventMap) {
        $(elm).on(eventMap);
    },
    
    extend: function (target, source) {
        return $.extend(target, source);
    },
    
    isArray: $.isArray,
    
    isFunction: $.isFunction,
    
    isObject: $.isPlainObject,
    
    isNode: isNode,
    
    isString: function (obj) { 
        return $.type(obj) === 'string';
    }
};
    