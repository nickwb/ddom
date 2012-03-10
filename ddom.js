/*
 *  DynamicDOM
 *  Copyright (c) 2012 Nick Young.
 *
 *  This is free software, licensed under the MIT license.
 */
(function (window, document, undefined) {
    // Get the dd namespace
    var _dd = window._dd, adapter = _dd.adapter;

    // Grab utility functions from the adapter
    var each            = adapter[0],
        setCss          = adapter[1],
        setEvents       = adapter[2],
        extend          = adapter[3],
        isArray         = adapter[4],
        isFunction      = adapter[5],
        isObject        = adapter[6],
        isNode          = adapter[7],
        isString        = adapter[8];

    /*
     *  _dd.create - Create a DOM node
     *  ----------------------------------------------------------------------
     *  _dd.create(spec);
     *      Creates a DOM node with the specified specification.
     *      When spec is:
     *          + A DOM node
     *              create will return that node unmodified.
     *          + A string
     *              create will return a text node containing that value.
     *          + An object
     *              create will return a DOM element configured according to
     *              the properties of spec.
     *
     *              The following special properties can be present on spec:
     *                  % tag       - The type/tag of the DOM element
     *                  % classes   - (a) a string with 1 or more space
     *                                    seperated class names,
     *                                (b) an array of css class names,
     *                                (c) a function returning (a) or (b)
     *                   
     *                      When classes is a function it can optionally
     *                      accept a parameter, element, referencing the DOM
     *                      element being created.
     *
     *                  % css       - A map of css properties and values to
     *                                apply to the element.
     *
     *                  % events    - A map of events to bind to the element.
     *                                This map should contains one or more
     *                                space separated event names as keys and
     *                                a handler function as a value.
     *
     *                  % content   - The inner content of the DOM Element.
     *                                (see attatch for valid values)
     *
     *              Using the content property it is possible to generate a
     *              complete DOM tree with any number of nested elements.
     *
     *              All other properties of spec will be deep-copied to the
     *              DOM element.
     *          + Anything else
     *              create will return a text node containing spec.toString()
     *          
     *
     *  _dd.create(tag, spec);
     *      An alternative invocation where tag is specified as the first
     *      parameter rather than as a property of the spec object.
     *
     *      Valid only when both parameters are passed and spec is an object.
     *  
     *  _dd.create(tag, content);
     *      An alternative invocation where the child content is passed as
     *      the second parameter rather than a spec object.
     *
     *      Allows simple elements to be created easily:
     *          _dd.create('h1', 'A title!');
     *
     *      Valid only when both parameters are passed and spec is not an
     *      object.
     *      
     */
    var create = function (tag, spec) {
        // Variables
        var elm, classes, css, events;

        if (spec === undefined) {
            // Only a single parameter was passed
            spec = tag;
            tag = spec.tag;
            if(tag !== undefined) { delete spec.tag };
        } else if (!isObject(spec)) {
            // Simple element shorthand when both parameters are defined
            // but spec is not an object
            return create(tag, { content: spec });
        }
        
        // No content?
        if(undefined === spec || null === spec) {
            return null;
        }

        if (isNode(spec)) {
            // Anything that's already a DOM Node is returned immediately
            return spec;
        } else if (isString(spec)) {
            // Create a text node if it's a string
            return document.createTextNode(spec);
        } else if (isObject(spec)) {
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
            
            // Inline styles?
            css = spec.css;
            if(undefined !== css) {
                setCss(elm, css);
                delete spec.css;
            }
            
            // Bind events
            events = spec.events;
            if(undefined !== events) {
                setEvents(elm, events);
                delete spec.events;
            }
            
            // Merge in any other properties
            return extend(elm, spec);
        } else {
            // Assume evertything else is just a text node
            return document.createTextNode(spec.toString());
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
            each(content, function (c) { attach(parent, c); });
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
    _dd.create = create;
    _dd.attach = attach;

})(this, this.document);
