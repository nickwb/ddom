(function(){

// Get the adapter
var adapter = window.DynamicDOM.adapter;

test("isObject", function() {
    strictEqual(adapter.isObject(null), false);
    strictEqual(adapter.isObject(undefined), false);
    strictEqual(adapter.isObject({}), true);
    strictEqual(adapter.isObject({prop: 'prop'}), true);
    strictEqual(adapter.isObject('a string'), false);
    strictEqual(adapter.isObject([]), false);
    strictEqual(adapter.isObject(['a', 'b']), false);
    strictEqual(adapter.isObject(function() { return true }), false);
    strictEqual(adapter.isObject(adapter.isObject), false);
    strictEqual(adapter.isObject(document.createElement('h1')), false);
    strictEqual(adapter.isObject(document.createTextNode('This is text.')), false);
});

test("isNode", function() {
    strictEqual(adapter.isNode(null), false);
    strictEqual(adapter.isNode(undefined), false);
    strictEqual(adapter.isNode({}), false);
    strictEqual(adapter.isNode({prop: 'prop'}), false);
    strictEqual(adapter.isNode('a string'), false);
    strictEqual(adapter.isNode([]), false);
    strictEqual(adapter.isNode(['a', 'b']), false);
    strictEqual(adapter.isNode(function() { return true }), false);
    strictEqual(adapter.isNode(adapter.isNode), false);
    strictEqual(adapter.isNode(document.createElement('h1')), true);
    strictEqual(adapter.isNode(document.createTextNode('This is text.')), true);
});

test("isString", function() {
    strictEqual(adapter.isString(null), false);
    strictEqual(adapter.isString(undefined), false);
    strictEqual(adapter.isString({}), false);
    strictEqual(adapter.isString({prop: 'prop'}), false);
    strictEqual(adapter.isString('a string'), true);
    strictEqual(adapter.isString([]), false);
    strictEqual(adapter.isString(['a', 'b']), false);
    strictEqual(adapter.isString(function() { return true }), false);
    strictEqual(adapter.isString(adapter.isString), false);
    strictEqual(adapter.isString(document.createElement('h1')), false);
    strictEqual(adapter.isString(document.createTextNode('This is text.')), false);
});

test("isFunction", function() {
    strictEqual(adapter.isFunction(null), false);
    strictEqual(adapter.isFunction(undefined), false);
    strictEqual(adapter.isFunction({}), false);
    strictEqual(adapter.isFunction({prop: 'prop'}), false);
    strictEqual(adapter.isFunction('a string'), false);
    strictEqual(adapter.isFunction([]), false);
    strictEqual(adapter.isFunction(['a', 'b']), false);
    strictEqual(adapter.isFunction(function() { return true }), true);
    strictEqual(adapter.isFunction(adapter.isFunction), true);
    strictEqual(adapter.isFunction(document.createElement('h1')), false);
    strictEqual(adapter.isFunction(document.createTextNode('This is text.')), false);
});

test("isArray", function() {
    strictEqual(adapter.isArray(null), false);
    strictEqual(adapter.isArray(undefined), false);
    strictEqual(adapter.isArray({}), false);
    strictEqual(adapter.isArray({prop: 'prop'}), false);
    strictEqual(adapter.isArray('a string'), false);
    strictEqual(adapter.isArray([]), true);
    strictEqual(adapter.isArray(['a', 'b']), true);
    strictEqual(adapter.isArray(function() { return true }), false);
    strictEqual(adapter.isArray(adapter.isArray), false);
    strictEqual(adapter.isArray(document.createElement('h1')), false);
    strictEqual(adapter.isArray(document.createTextNode('This is text.')), false);
});

test("extend", function() {
    var e = adapter.extend({a: 'A'}, {b: 'B', c: 'C'});
    strictEqual(e.a, 'A');
    strictEqual(e.b, 'B');
    strictEqual(e.c, 'C');
    
    e = adapter.extend({a: 'A'}, {a: 'B'});
    strictEqual(e.a, 'B');
});

test("each", function() {
    var i = 0, j = 0;
    adapter.each([1, 7, 11], function(x) {
        i++;
        j+= x;
    });
    
    strictEqual(i, 3);
    strictEqual(j, 19);
});

test("setCss", function() {
   var e = document.createElement('h1');
   adapter.setCss(e, { 'font-size': '10px', 'font-weight': '800' });
   
   strictEqual(e.style.fontSize, '10px');
   strictEqual(e.style.fontWeight, '800');
});

test("setEvents", function() {
   var e = document.createElement('h1'), i = 0;
   document.getElementById('qunit-fixture').appendChild(e);
   
   adapter.setEvents(e, { 'click': function() { i++ }, 'mouseover mouseout': function() { i += 2 } });

   adapter.each('click mouseover mouseout'.split(' '), function(evt) {
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