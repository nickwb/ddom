/*
 *  DynamicDOM
 *  Copyright (c) 2012 Nick Young.
 *
 *  This is free software, licensed under the MIT license.
 */
(function ($, window, document, undefined) {
    // Is the object of the specified type?
    // Types: Boolean Number String Function Array Date RegExp Object
    var isType = function (obj, type) {
        return $.type(obj) === $.trim(type.toLowerCase());
    };

    var isArray = $.isArray;
    var isFunction = $.isFunction;

    // Does this browser recognise instances of Node?
    var nodeCheck = (document.createTextNode('a') instanceof Node);

    // Is the specified object a DOM node?
    var isNode = function (o) {
        return nodeCheck ? o instanceof Node : isType(o.nodeType, 'number') && isType(o.nodeName, 'string');
    };

    /*
     *  _dd.create - Create a DOM node
     *  ----------------------------------------------------------------------
     *  _dd.create(spec);
     *      Creates a DOM node with the specified specification.
     *      When spec is:
     *          + A DOM node
     *              create will return that node unmodified.
     *          + A plain value (string, number, boolean, date)
     *              create will return a text node containing that value.
     *          + An object
     *              create will return a DOM element configured according to
     *              the properties of spec.
     *
     *              The following special properties can be present on spec:
     *                  % tag       - The type/tag of the DOM element
     *                  % classes   - (a) a css class name string,
     *                                (b) an array of css class names,
     *                                (c) a function returning (a) or (b)
     *                   
     *                      When classes is a function it can optionally
     *                      accept a parameter, element, referencing the DOM
     *                      element being created.
     *
     *                  % content   - The inner content of the DOM Element.
     *                                (see attatch)
     *
     *              Using the content property it is possible to generate a
     *              complete DOM tree with any number of nested elements.
     *
     *              All other properties of spec will be deep-copied to the
     *              DOM element.
     *          
     *
     *  _dd.create(tag, spec);
     *      An alternative invocation where tag is specified as the first
     *      parameter rather than as a property of spec.
     */
    var create = function (tag, spec) {
        // Variables
        var elm, classes;

        // Tag passed as an attribute?
        if (spec === undefined) {
            spec = tag;
            tag = spec.tag;
            delete spec.tag;
        }

        // Return existing DOM nodes immediately
        if (isNode(spec)) {
            return spec;
        }

        if (isType(spec, 'string')) {
            // Create a text node if it's a string
            return document.createTextNode(spec);
        } else if (isType(spec, 'number') || isType(spec, 'boolean')) {
            // Convert to string
            return document.createTextNode(spec.toString());
        } else if (isType(spec, 'date')) {
            // Convert to text
            return document.createTextNode(spec.toLocaleDateString() + " " + spec.toLocaleTimeString());
        } else if (isType(spec, 'object')) {
            // Create the element
            elm = document.createElement(tag);

            // Create its children
            if (undefined !== spec.content) {
                attach(elm, spec.content);
                delete spec.content;
            }

            // Class name shorthand?
            classes = spec.classes;
            if (undefined !== classes) {
                // Get classes from function
                if (isFunction(classes)) {
                    classes = classes(elm);
                }

                // Flatten an array
                if (isArray(classes)) {
                    classes = classes.join(' ');
                }

                elm.className = classes;
                delete spec.classes;
            }

            // Merge in any other properties
            return $.extend(true, elm, spec);
        }
    };

    /*
     *  _dd.attach - Attach content to an existing DOM element
     *  ----------------------------------------------------------------------
     *  _dd.attach(parent, content);
     *      Attaches new child content to the specified parent element.
     *      Where content can be:
     *          (a) a spec parameter as defined by _dd.create(spec),
     *            (b) null or undefined, causing no content to be attached,
     *          (c) an array comprising elements of (a), (b), (c) or (d),
     *          (d) a function returning either (a), (b), (c) or (d)
     *
     *      When content is a function, that function can optionally accept
     *      a single paramter, parent, a reference to the DOM element to which
     *      content will be attached.
     */
    var attach = function (parent, content) {
        if (content === null || content === undefined) {
            // Nothing to do
        } else if (isArray(content)) {
            // Handle an array of children
            $.each(content, function (i, c) { attach(parent, c); });
        } else if (isFunction(content)) {
            // Handle a function returning children
            attach(parent, content(parent));
        } else {
            // A simple child
            parent.appendChild(create(content));
        }

        return parent;
    };

    // Export
    window._dd = {
        create: create,
        attach: attach
    };

})(jQuery, this, this.document);
