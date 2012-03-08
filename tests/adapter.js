(function(){

// Get the adapter
var adapter = window._dd.adapter;

// Grab functions from the adapter
var each            = adapter[0],
    setCss          = adapter[1],
    setEvents       = adapter[2],
    extend          = adapter[3],
    isArray         = adapter[4],
    isFunction      = adapter[5],
    isObject        = adapter[6],
    isNode          = adapter[7],
    isString        = adapter[8];

test("isObject", function() {
    strictEqual(isObject(null), false);
    strictEqual(isObject(undefined), false);
    strictEqual(isObject({}), true);
    strictEqual(isObject({prop: 'prop'}), true);
    strictEqual(isObject('a string'), false);
    strictEqual(isObject([]), false);
    strictEqual(isObject(['a', 'b']), false);
    strictEqual(isObject(function() { return true }), false);
    strictEqual(isObject(isObject), false);
    strictEqual(isObject(document.createElement('h1')), false);
    strictEqual(isObject(document.createTextNode('This is text.')), false);
});

test("isNode", function() {
    strictEqual(isNode(null), false);
    strictEqual(isNode(undefined), false);
    strictEqual(isNode({}), false);
    strictEqual(isNode({prop: 'prop'}), false);
    strictEqual(isNode('a string'), false);
    strictEqual(isNode([]), false);
    strictEqual(isNode(['a', 'b']), false);
    strictEqual(isNode(function() { return true }), false);
    strictEqual(isNode(isNode), false);
    strictEqual(isNode(document.createElement('h1')), true);
    strictEqual(isNode(document.createTextNode('This is text.')), true);
});

test("isString", function() {
    strictEqual(isString(null), false);
    strictEqual(isString(undefined), false);
    strictEqual(isString({}), false);
    strictEqual(isString({prop: 'prop'}), false);
    strictEqual(isString('a string'), true);
    strictEqual(isString([]), false);
    strictEqual(isString(['a', 'b']), false);
    strictEqual(isString(function() { return true }), false);
    strictEqual(isString(isString), false);
    strictEqual(isString(document.createElement('h1')), false);
    strictEqual(isString(document.createTextNode('This is text.')), false);
});

test("isFunction", function() {
    strictEqual(isFunction(null), false);
    strictEqual(isFunction(undefined), false);
    strictEqual(isFunction({}), false);
    strictEqual(isFunction({prop: 'prop'}), false);
    strictEqual(isFunction('a string'), false);
    strictEqual(isFunction([]), false);
    strictEqual(isFunction(['a', 'b']), false);
    strictEqual(isFunction(function() { return true }), true);
    strictEqual(isFunction(isFunction), true);
    strictEqual(isFunction(document.createElement('h1')), false);
    strictEqual(isFunction(document.createTextNode('This is text.')), false);
});

test("isArray", function() {
    strictEqual(isArray(null), false);
    strictEqual(isArray(undefined), false);
    strictEqual(isArray({}), false);
    strictEqual(isArray({prop: 'prop'}), false);
    strictEqual(isArray('a string'), false);
    strictEqual(isArray([]), true);
    strictEqual(isArray(['a', 'b']), true);
    strictEqual(isArray(function() { return true }), false);
    strictEqual(isArray(isArray), false);
    strictEqual(isArray(document.createElement('h1')), false);
    strictEqual(isArray(document.createTextNode('This is text.')), false);
});

test("extend", function() {
    var e = extend({a: 'A'}, {b: 'B', c: 'C'});
    strictEqual(e.a, 'A');
    strictEqual(e.b, 'B');
    strictEqual(e.c, 'C');
    
    e = extend({a: 'A'}, {a: 'B'});
    strictEqual(e.a, 'B');
});

test("each", function() {
    var i = 0, j = 0;
    each([1, 7, 11], function(x) {
        i++;
        j+= x;
    });
    
    strictEqual(i, 3);
    strictEqual(j, 19);
});

test("setCss", function() {
   var e = document.createElement('h1');
   setCss(e, { 'font-size': '10px', 'font-weight': '800' });
   
   strictEqual(e.style.fontSize, '10px');
   strictEqual(e.style.fontWeight, '800');
});

test("setEvents", function() {
   var e = document.createElement('h1'), i = 0;
   document.getElementById('qunit-fixture').appendChild(e);
   
   setEvents(e, { 'click': function() { i++ }, 'mouseover mouseout': function() { i += 2 } });

   each('click mouseover mouseout'.split(' '), function(evt) {
        if(!e.dispatchEvent && e.fireEvent) {
            e.fireEvent('on' + evt);
        } else {
            var x = document.createEvent('MouseEvents');
            x.initMouseEvent(evt, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            e.dispatchEvent(x);
        }
   });
   
   strictEqual(i, 5);
});

})();