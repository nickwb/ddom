(function($){

var _dd = window._dd;

test("_dd is defined, with methods.", function() {
    ok( _dd !== undefined );
    ok( $.isFunction(_dd.create) );
    ok( $.isFunction(_dd.attach) );
});

test("Simple element syntax", function() {
    var s = _dd.create('h1', 'Title Text');

    equal(s.tagName.toLowerCase(), 'h1');
    equal($(s).text(), 'Title Text');
    equal(s.childNodes.length, 1);
});

test("Simple element, single parameter syntax", function() {
    var s = _dd.create({ tag: 'h1', content: 'Title Text' });

    equal(s.tagName.toLowerCase(), 'h1');
    equal($(s).text(), 'Title Text');
    equal(s.childNodes.length, 1);
});

test("Set arbitrary properties", function() {
    var s = _dd.create({ tag: 'a', id: 'myLinkId', content: 'Link' });

    equal(s.tagName.toLowerCase(), 'a');
    equal(s.id, 'myLinkId');
    equal($(s).text(), 'Link');
    equal(s.childNodes.length, 1);
});

})(jQuery);