(function(alia, undefined) {
    "use strict";

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private variables

    var providers = {};
    var services = {};

    var views = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions

    alia.applyDefaults = function(obj, defaults, options) {
        for (var p in defaults) {
            if (!obj.hasOwnProperty(p) ||
                (options && options.hasOwnProperty(p) && !options[p].hasOwnProperty(obj[p]))) {
                obj[p] = defaults[p];
            }
        }
    };

    alia.defaults = alia.applyDefaults;

    function replace(string, params) {
        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                string = string.replace(':' + p, params[p]);
            }
        }
        return string;
    }

    alia.replace = replace;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public variables

    alia.version = '0.1.0';

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Errors

    alia.error = function(message /*, [inputs]*/ ) {
        for (var i = 1; i < arguments.length; ++i) {
            message = message.replace(/\?/, "'" + arguments[i] + "'");
        }
        return new Error(message);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Events

    function Event(type) {
        this.defaultPrevented = false;
        this.result = undefined;
        this.type = type;
    }

    Event.prototype.isDefaultPrevented = function() {
        return this.defaultPrevented;
    };

    Event.prototype.preventDefault = function() {
        this.defaultPrevented = true;
    };

    var handlers = {};

    alia.on = function(type, callback) {
        var h = handlers[type];
        if (!h) {
            h = handlers[type] = [];
        }
        h.push(callback);
    };

    alia.broadcast = function(type, params) {
        var i;
        var event = new Event(type);
        var h = handlers[type];
        if (h) {
            var args = [event];
            if (arguments.length === 2) {
                args = args.concat(params);
            } else if (arguments.length > 2) {
                for (i = 1; i < arguments.length; ++i) {
                    args.push(arguments[i]);
                }
            }
            for (i = 0; i < h.length; ++i) {
                event.result = h[i].apply(null, args);
                if (event.isDefaultPrevented()) {
                    break;
                }
            }
        }
        return event;
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Url rewriting

    alia.href = function(url) {
        var $location = providers.$location;
        if (url.charAt(0) === '#') {
            return $location.path().substr(1) + url;
        } else {
            return url;
        }
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Unique identification

    var uid = ['0', '0', '0'];

    /**
     * A consistent way of creating unique IDs in alia. The ID is a sequence of alpha numeric
     * characters such as '012ABC'. The reason why we are not using simply a number counter is that
     * the number string gets longer over time, and it can also overflow, where as the nextId
     * will grow much slower, it is a string, and it will never overflow.
     *
     * @returns {string} an unique alpha-numeric string
     */
    function nextUid() {
        var index = uid.length;
        var digit;
        while (index) {
            index--;
            digit = uid[index].charCodeAt(0);
            if (digit == 57 /*'9'*/ ) {
                uid[index] = 'A';
                return uid.join('');
            }
            if (digit == 90 /*'Z'*/ ) {
                uid[index] = '0';
            } else {
                uid[index] = String.fromCharCode(digit + 1);
                return uid.join('');
            }
        }
        uid.unshift('0');
        return uid.join('');
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Current context

    var jviewport = $('body').find('[alia-viewport]').first();
    jviewport.attr('id', nextUid());
    //alia.viewport = currentContext;

    var viewport = new Context(jviewport.attr('id'));
    alia.viewport = viewport;

    var currentContext = viewport;
    var currentContextType = 'view';

    alia.currentContext = function() {
        return currentContext;
    };

    alia.currentContextType = function() {
        return currentContextType;
    };

    alia.stageMultiviewContext = function() {
        viewport.empty();
        currentContextType = 'multiview';
        currentContext = Multiview.create(viewport);
        return currentContext;
    };

    alia.stageViewContext = function() {
        viewport.empty();
        currentContextType = 'view';
        currentContext = viewport;
        return currentContext;
    };

    alia.stageWorkspaceContext = function() {
        viewport.empty();
        currentContextType = 'workspace';
        currentContext = Workspace.create(viewport);
        return currentContext;
    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Alerts

    var jalerts = $('body').find('[alia-alerts]').first();
    jalerts.attr('id', nextUid());
    alia.alerts = new Context(jalerts.attr('id'));


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Header

    var jheader = $('body').find('[alia-header]').first();
    jheader.attr('id', nextUid());
    alia.header = new Context(jheader.attr('id'));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Element functions

    function append( /* [key], content, [params] */ ) {
        var key = '';
        var content = '';
        var params = null;
        if (arguments.length === 1) {
            content = arguments[0];
        } else if (arguments.length === 2) {
            if (typeof arguments[1] === 'string') {
                key = arguments[0];
                content = arguments[1];
            } else if (typeof arguments[1] === 'object') {
                content = arguments[0];
                params = arguments[1];
            }
        } else if (arguments.length === 3) {
            key = arguments[0];
            content = arguments[1];
            params = arguments[2];
        }

        if (typeof key !== 'string') {
            throw new Error('Append only accepts string keys');
        } else if (typeof content !== 'string' || content.length === 0) {
            throw new Error('Append only accepts non-empty string html arguments');
        } else if (params && (typeof params !== 'object' || Array.isArray(params))) {
            throw new Error('Append only accepts object parameters');
        } else if (!this.ids.hasOwnProperty(key)) {
            throw new Error("Unrecognized key");
        }

        // Replace content parameters
        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                content = content.replace(new RegExp(':' + p, 'g'), params[p]);
            }
        }

        var component = new Component();

        function rewrite() {
            var j = $(this);
            var key = j.attr('alia-context');
            var id = nextUid();
            component.ids[key] = id;
            j.attr('id', id);
        }

        // Create jquery element
        var elm = $(content);
        elm.filter('[alia-context]').each(rewrite);
        elm.find('[alia-context]').each(rewrite);

        // Append to appropriate contextual element
        $('#' + this.ids[key]).append(elm);
        return component;
    }

    function empty() {
        for (var key in this.ids) {
            if (this.ids.hasOwnProperty(key)) {
                $('#' + this.ids[key]).empty();
            }
        }
    }

    function onClick(callback) {
        $('#' + this.ids['']).click(this, callback);
        return this;
    }

    function onClickScrollTo(name) {
        $('#' + this.ids['']).click(this, function() {
            $('html, body').animate({
                scrollTop: $('[name="' + name + '"]').offset().top - parseInt($('body').css('padding-top'))
            }, 300);
        });
        return this;
    }

    function onEnterKey(callback) {
        $('#' + this.id()).keypress(function(event) {
            if (event.which === 13) {
                event.preventDefault();
                callback();
            }
        });
        return this;
    }

    function onHover(callback_a, callback_b) {
        $('#' + this.ids['']).hover(callback_a, callback_b);
        return this;
    }

    function onFocusOut(callback) {
        $('#' + this.ids['']).focusout(callback);
        return this;
    }

    function onResize(callback) {
        $(window).resize(function() {
            var w = $('#' + this.ids['']).width();
            callback(w);
        }.bind(this));
        return this;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Control

    function Control(id) {
        Object.defineProperty(this, 'id', {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }

    Control.prototype.hide = function() {
        $('#' + this.id).hide();
    };

    Control.prototype.onClick = function(callback) {
        $('#' + this.id).click(this, callback);
        return this;
    };

    Control.prototype.show = function() {
        $('#' + this.id).show();
    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Context

    function Context(ids) {
        if (typeof ids === 'string') {
            this.ids = {
                '': ids
            };
        } else {
            this.ids = ids;
        }
    }

    Context.prototype.append = append;
    Context.prototype.empty = empty;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Component

    function Component() {
        this.ids = {};
    }

    Component.prototype.animateOnClick = function(button, properties, opts) {
        var self = this;
        $('#' + button.id()).click(function() {
            $('#' + self.id()).animate(properties, opts);
        });
    };

    Component.prototype.bindCheckboxField = function(key, property) {
        if (arguments.length === 1) {
            property = key;
            key = '';
        }

        // Define property and ensure we can set
        var j = $('#' + this.id(key));
        var p = this.defineProperty('checked', property);
        if (!property.isSettable()) {
            throw new Error("Attempted to bind non-settable observer to checkbox field");
        }

        var current;

        // One-way binding from property to checkbox        
        p.onResolve(function(value) {
            if (current !== value) {
                current = value;
                j.prop("checked", value);
            }
        });

        // One-way binding from checkbox to property
        j.on('change', function() {
            var value = j.prop("checked") || false;
            if (current !== value) {
                current = value;
                p.set(current);
            }
        });
    };

    Component.prototype.bindCollapse = function(key, prop) {
        var property = this.defineProperty('collapsed', prop);

        var j = $('#' + this.id(key));

        property.onResolve(function(value) {
            if (value) j.slideUp(200);
            else j.slideDown(200);
        });
    };

    Component.prototype.bindDisabled = function(key, property) {
        if (arguments.length === 1) {
            property = key;
            key = '';
        }
        var j = $('#' + this.id(key));
        this.defineProperty('disabled', property).onResolve(function(value) {
            if (value === true) {
                j.attr('disabled', 'disabled');
            } else {
                j.removeAttr('disabled');
            }
        });
        return this;
    };

    Component.prototype.bindHtml = function(key, name, property) {
        if (arguments.length === 2) {
            property = name;
            name = key;
            key = '';
        }
        var j = $('#' + this.id(key));
        this.defineProperty(name, property).onResolve(function(value) {
            j.html(value);
        });
        return this;
    };

    Component.prototype.bindDate = function(key, property) {
        switch (arguments.length) {
            case 1:
                property = key;
                key = '';
        }

        var j = $('#' + this.id(key));
        var get = function() {
            return new Date(j.val());
        };

        var p = this.defineProperty('date', property);

        var current;

        j.change(function() {
            var value = get();
            if (current !== value) {
                current = value;
                p.set(current);
            }
        });

        p.onResolve(function(value) {
            if (current !== value) {
                current = value;
                j.datepicker('setDate', current);
            }
        });
    };

    Component.prototype.bindText = function(key, name, property, type) {
        switch (arguments.length) {
            case 1:
                type = 'text';
                property = key;
                name = 'text';
                key = '';
                break;
            case 2:
                type = name;
                property = key;
                name = 'text';
                key = '';
                break;
            case 3:
                type = property;
                property = name;
                name = key;
                key = '';
                break;
        }

        // Create element binding
        var j = $('#' + this.id(key));
        var parser = this.defaultParser(type);

        var get = function() {
            var value;
            try {
                value = parser(j.val());
            } catch (e) {
                value = null;
            }
            return value;
        };

        var p = this.defineProperty(name, property);

        var current;

        j.on('input', function() {
            var value = get();
            if (current !== value) {
                current = value;
                p.set(current);
            }
        });

        p.onResolve(function(value) {
            if (current !== value) {
                current = value;
                j.val(current);
            }
        });
        p.onUnresolve(function() {
            j.val('');
        });
    };

    Component.prototype.bindSelectValue = function(key, property) {
        if (arguments.length === 1) {
            property = key;
            key = '';
        }

        // Define property and ensure we can set
        var j = $('#' + this.id(key));

        var p = this.defineProperty('selected', property);

        var current;

        j.on('change', function() {
            var value = j.val();
            if (current !== value) {
                current = value;
                p.set(current);
            }
        });

        p.onResolve(function(value) {
            if (current !== value) {
                current = value;
                j.val(current);
            }
        });
    };

    Component.prototype.bindOption = function(option, cb) {
        var j = $('#' + this.id(''));

        var value = option.then(function(value) {
            if (typeof value === 'string' || typeof value === 'number') {
                return value;
            } else {
                return value.value;
            }
        });

        var text = option.then(function(value) {
            if (typeof value === 'string' || typeof value === 'number') {
                return value;
            } else {
                return value.text;
            }
        });

        var t = this.defineProperty('text', text);
        var v = this.defineProperty('value', value);

        v.onResolve(function(value) {
            this.attr('value', value);
            if (typeof cb === 'function') cb();
        }.bind(this));

        t.onResolve(function(text) {
            this.html(text);
            if (typeof cb === 'function') cb();
        }.bind(this));
    }

    Component.prototype.bindVisible = function(key, property) {
        if (arguments.length === 1) {
            property = key;
            key = '';
        }
        var j = $('#' + this.id(key));
        this.defineProperty('visible', property).onResolve(function(value) {
            if (value === true) {
                j.show();
            } else {
                j.hide();
            }
        });
        return this;
    };

    Component.prototype.defaultParser = function(type) {
        switch (type) {
            case 'number':
                return function(text) {
                    return parseInt(text);
                };
            default:
                return function(text) {
                    return text || "";
                };
        }
    };

    Component.prototype.append = append;
    Component.prototype.empty = empty;

    Component.prototype.attr = function(name, value) {
        return this.kattr('', name, value);
    };

    Component.prototype.class = function(type, value) {
        return this.kclass('', type, value);
    };

    Component.prototype.doClick = function() {
        $('#' + this.ids['']).click();
    };

    Component.prototype.css = function(type, value) {
        return this.kcss('', type, value);
    };

    Component.prototype.defineProperty = function(name, value) {
        var property;
        if (alia.isAccessor(value)) {
            property = value;
        } else {
            property = alia.state(value);
        }
        Object.defineProperty(this, name, {
            value: property,
            writable: false,
            enumerable: true,
            configurable: false
        });
        return property;
    };

    Component.prototype.defineStatic = function(name, value) {
        Object.defineProperty(this, name, {
            value: value,
            writable: false,
            enumerable: true,
            configurable: false
        });
    };


    Component.prototype.defineEvent = function(type) {
        var self = this;
        var handlers = {};
        var on = 'on' + type.charAt(0).toUpperCase() + type.slice(1);
        var emit = 'emit' + type.charAt(0).toUpperCase() + type.slice(1);
        this[on] = function(callback) {
            var h = handlers[type];
            if (!h) {
                h = handlers[type] = [];
            }
            h.push(callback);
            return self;
        };
        this[emit] = function(params) {
            var i;
            var event = new Event(type);
            var h = handlers[type];
            if (h) {
                var args = [event];
                if (arguments.length === 1) {
                    args = args.concat(params);
                } else if (arguments.length > 1) {
                    for (i = 0; i < arguments.length; ++i) {
                        args.push(arguments[i]);
                    }
                }
                for (i = 0; i < h.length; ++i) {
                    event.result = h[i].apply(null, args);
                    if (event.isDefaultPrevented()) {
                        break;
                    }
                }
            }
            return event;
        };
    };

    Component.prototype.doFocus = function(key) {
        if (typeof key === 'undefined') key = '';
        $('#' + this.id(key)).focus();
    };

    Component.prototype.html = function(value) {
        return this.khtml('', value);
    };

    Component.prototype.id = function(key) {
        if (typeof key !== 'string') {
            return this.ids[''];
        } else {
            return this.ids[key];
        }
    };

    Component.prototype.kattr = function(key, name, value) {
        if (value) {
            $('#' + this.ids[key]).attr(name, value);
        } else {
            return $('#' + this.ids[key]).attr(name);
        }
    };

    Component.prototype.kclass = function(key, type, value) {
        if (type === 'add') {
            $('#' + this.ids[key]).addClass(value);
        } else if (type === 'remove') {
            $('#' + this.ids[key]).removeClass(value);
        } else if (type === 'toggle') {
            $('#' + this.ids[key]).toggleClass(value);
        }
        return this;
    };

    Component.prototype.kcss = function(key, type, value) {
        if (value) {
            $('#' + this.ids[key]).css(type, value);
            return this;
        } else {
            return $('#' + this.ids[key]).css(type);
        }
    };

    Component.prototype.khtml = function(key, value) {
        if (value) {
            $('#' + this.id(key)).html(value);
        } else {
            return $('#' + this.id(key)).html(value);
        }
    };

    Component.prototype.onClick = onClick;

    Component.prototype.onClickScrollTo = onClickScrollTo;

    Component.prototype.onEnterKey = onEnterKey;

    Component.prototype.onFocusOut = onFocusOut;

    Component.prototype.onHover = onHover;

    Component.prototype.onResize = onResize;

    Component.prototype.removeAttr = function(name) {
        $('#' + this.id()).removeAttr(name);
    };

    Component.prototype.slideDownOnClick = function(button, callback) {
        var self = this;
        $('#' + button.id()).click(function() {
            if (callback) {
                $('#' + self.id()).slideDown(callback);
            } else {
                $('#' + self.id()).slideDown();
            }
        });
    };

    Component.prototype.slideUpOnClick = function(button, callback) {
        var self = this;
        $('#' + button.id()).click(function() {
            if (callback) {
                $('#' + self.id()).slideUp(callback);
            } else {
                $('#' + self.id()).slideUp();
            }
        });
    };

    Component.prototype.width = function() {
        return $('#' + this.ids['']).width();
    };

    // TODO: Remove this
    // Component.prototype.tab = function(state) {
    //     console.log('tab');
    //     console.log(this);
    //     //$('#' + this.ids[''] + ' a').tab(state);
    //     // console.log('#' + this.ids[''] + ' .nav li:first' + ' a');
    //     // console.log($('#' + this.ids[''] + ' .nav li:first' + ' a'));
    //     // $('#' + this.ids[''] + ' .nav li:first' + ' a').tab('show');
    // }

    alia.multiviewSignature = function(name, args) {
        var signature = [];
        for (var p in args) {
            if (args.hasOwnProperty(p) && p !== 'view') {
                signature.push(p + '=' + args[p]);
            }
        }
        return ['view=' + name].concat(signature.sort()).join('&');
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Multiview

    /**
     * Workspace represents a set of tasks that can be composed in a single page interface.
     *
     * @constructor
     * @param {object} Options.
     */
    function Multiview(ctx) {
        var $localStorage = providers.$localStorage;
        var leftCollapsed = $localStorage.get('leftCollapsed');
        var rightCollapsed = $localStorage.get('rightCollapsed');
        if (leftCollapsed === null) {
            leftCollapsed = false;
            $localStorage.set('leftCollapsed', false);
        }
        if (rightCollapsed === null) {
            leftCollapsed = false;
            $localStorage.set('rightCollapsed', false);
        }

        // Create contexts for multiview
        this.body = ctx.append('<div alia-context class="multiview-body sticky-navigation sticky-menu"></div>');

        // Navigation
        this.nav = this.body.append('<div alia-context class="multiview-navigation"></div>').onHover(function() {
            this.body.class('add', 'peek-navigation');
        }.bind(this), function() {
            this.body.class('remove', 'peek-navigation');
        }.bind(this));

        // Menu
        this.menu = this.body.append('<div alia-context class="multiview-menu"></div>').onHover(function() {
            this.body.class('add', 'peek-menu');
        }.bind(this), function() {
            this.body.class('remove', 'peek-menu');
        }.bind(this));

        // Left Toggler
        this.body.append('<div alia-context class="multiview-navigation-draggable"></div>').onClick(function() {
            this.body.class('toggle', 'sticky-navigation');
            this.body.class('toggle', 'collapse-navigation');
            leftCollapsed = !leftCollapsed;
            $localStorage.set('leftCollapsed', leftCollapsed);
        }.bind(this)).onHover(function() {
            this.body.class('add', 'peek-navigation');
        }.bind(this), function() {
            this.body.class('remove', 'peek-navigation');
        }.bind(this));

        // Viewport
        this.viewport = this.body.append('<div alia-context class="multiview-viewport"></div>');

        // Right Toggler
        this.body.append('<div alia-context class="multiview-menu-draggable"></div>').onClick(function() {
            this.body.class('toggle', 'sticky-menu');
            this.body.class('toggle', 'collapse-menu');
            rightCollapsed = !rightCollapsed;
            $localStorage.set('rightCollapsed', rightCollapsed);
        }.bind(this)).onHover(function() {
            this.body.class('add', 'peek-menu');
        }.bind(this), function() {
            this.body.class('remove', 'peek-menu');
        }.bind(this));

        // Handle initial state of navigation and [context menus] - not handling context menus yet
        if (leftCollapsed) {
            this.body.class('add', 'collapse-navigation');
        }
        if (rightCollapsed) {
            this.body.class('add', 'collapse-menu');
        }

        var self = this;
        this.nav.push = function() {
            self.push.apply(self, arguments);
            return this;
        };

        this.viewport.push = function() {
            self.push.apply(self, arguments);
            return this;
        };

        this.views = {};
        this.default = null;
        this.active = null;
    }

    Multiview.prototype.begin = function(name, args) {
        var $location = providers.$location;
        if (!this.active && !$location.search().hasOwnProperty('view')) {
            this.push(name, args);
        }
        return this;
    };

    Multiview.create = function(ctx) {
        var multiview = new Multiview(ctx);
        // console.log(multiview);
        return {
            begin: function() {
                multiview.begin.apply(multiview, arguments);
                return this;
            },
            currentSignature: function() {
                return multiview.active ? multiview.active.signature : '';
            },
            include: function() {
                multiview.include.apply(multiview, arguments);
                return this;
            },
            navigation: function() {
                multiview.navigation.apply(multiview, arguments);
                return this;
            },
            push: function() {
                multiview.push.apply(multiview, arguments);
                return this;
            },
            signature: function() {
                multiview.signature.apply(multiview, arguments);
                return this;
            },
            view: function() {
                multiview.view.apply(multiview, arguments);
                return this;
            }
            // include: function() {
            //     workspace.include.apply(workspace, arguments);
            //     return this;
            // },
            // push: function(name, args) {
            //     console.log("external push");
            //     if (workspace.root) {
            //         workspace.push(workspace.root, name, args);
            //     } else {
            //         console.log(name);
            //         workspace.preload = {
            //             name: name,
            //             args: args
            //         };
            //     }
            // }
        };
    };

    Multiview.prototype.include = function(options) {
        if (typeof options.name !== 'string') {
            throw new Error('Missing or invalid view name during multiview definition');
        } // else if (typeof options.path !== 'string' || ) {
        //     throw new Error('Missing or invalid viewport function during multiview definition');
        // }
        // console.log(options);
        this.views[options.name] = {
            name: options.name,
            included: views[options.path]
        };
        return this;
    };

    Multiview.prototype.push = function(name, args) {
        var view = this.views[name];
        if (!view) {
            throw new Error("Unknown view: " + name);
        }
        var signature = this.signature(name, args);
        if (this.active && this.active.signature === signature) {
            return;
        }

        var vp = this.viewport;

        if (typeof view.viewport === 'function') {
            vp.empty();
            view.viewport(this.viewport, args);
        } else if (typeof view.included === 'object') {
            alia.resolve(view.included.opts.dependencies, [this.viewport], {
                $query: args
            }).onResolve(function(args) {
                vp.empty();
                view.included.ctor.apply(null, args);
            });
        }

        var aview = {
            signature: signature
        };

        this.active = aview;
        var $location = providers.$location;
        $location.search(this.active.signature);

        // Return view
        return aview;
    };

    Multiview.prototype.navigation = function(callback) {
        callback(this.nav);
        return this;
    };

    Multiview.prototype.signature = function(name, args) {
        var signature = [];
        for (var p in args) {
            if (args.hasOwnProperty(p) && p !== 'view') {
                signature.push(p + '=' + args[p]);
            }
        }
        return ['view=' + name].concat(signature.sort()).join('&');
    };

    Multiview.prototype.view = function(options) {
        if (typeof options.name !== 'string') {
            throw new Error('Missing or invalid view name during multiview definition');
        } else if (typeof options.viewport !== 'function') {
            throw new Error('Missing or invalid viewport function during multiview definition');
        }
        this.views[options.name] = {
            name: options.name,
            viewport: options.viewport
        };
        return this;
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Workspace

    /**
     * Workspace represents a set of tasks that can be composed in a single page interface.
     *
     * @constructor
     * @param {object} Options.
     */
    function Workspace(opts) {
        this.context = opts.context;
        this.control = opts.control;
        this.viewport = opts.viewport;

        this.definitions = {};
        this.singletons = {};
        this.root = null;
        this.active = null;
    }

    /** 
     * @name Workspace#activate
     * @private
     *
     * @description
     * Activates a task within the workspace.
     */
    Workspace.prototype.activate = function(task) {
        console.log(task);
        if (task.isActive()) {
            return;
        }

        // Detach current children
        if (task.child) {
            task.child.detach();
            task.child = null;
        }

        // Configure parent
        var parent = task.parent;
        if (parent) {

            // Collapse parent task
            if (parent !== this.root || !this.keepRootOpen) {
                parent.collapse();
            }

            // Handle current child of parent
            if (parent.child === task) {
                task.expand();
            } else if (parent.child !== null) {
                parent.child.detach();
            }

            // Set child
            parent.child = task;
        }

        // Render viewport
        this.viewport.empty();
        task.view(this.viewport, task.args);

        // Handle detached task
        if (task.detached) {
            $('#' + this.control.id('stack')).append(task.element);
            task.detached = false;

            $('#' + task.panel.id()).show();
            $('#' + task.body.id()).show();
            $('#' + task.id).show();
        }
    };

    /** 
     * @name Workspace#begin
     * @private
     *
     * @description
     * Begins a workspace with the given root task.
     * @param {string} The task name to serve as the root task of the workspace.
     * @param {boolean} A boolean value indicating whether or not to keep the root task open.
     */
    Workspace.prototype.begin = function(name, keepOpen) {
        this.keepRootOpen = keepOpen === true;
        this.viewport.empty();
        if (!this.active) {
            console.log("no active");
            this.push(null, name);
        }
        return this;
    };

    Workspace.create = function(ctx) {

        $('#' + viewport.ids['']).addClass('workspace');

        // Create root context for workspace
        ctx = viewport.append([
            '<div alia-context class="container-fluid">',
            '  <div alia-context="body" class="row"></div>',
            '</div>'
        ].join(''));

        // Construct workspace
        var workspace = new Workspace({
            context: ctx,
            control: ctx.append('body', [
                '<div alia-context class="col-lg-3">',
                '  <div alia-context="stack" class="panel-group"></div>',
                '</div>'
            ].join('')),
            viewport: ctx.append('body', [
                '<div alia-context class="col-lg-9"></div>'
            ].join('')),
            keepRootOpen: false
        });

        // Return workspace context
        return {
            begin: function() {
                workspace.begin.apply(workspace, arguments);
                return this;
            },
            currentSignature: function() {
                return workspace.active.signature;
            },
            define: function() {
                workspace.define.apply(workspace, arguments);
                return this;
            },
            include: function() {
                workspace.include.apply(workspace, arguments);
                return this;
            },
            push: function(name, args) {
                console.log("external push");
                if (workspace.root) {
                    workspace.push(workspace.root, name, args);
                } else {
                    console.log(name);
                    workspace.preload = {
                        name: name,
                        args: args
                    };
                }
            },
            signature: function(name, args) {
                return workspace.signature(name, args);
            }
        };
    };

    Workspace.prototype.define = function(opts) {
        if (typeof opts.name !== 'string') {
            throw new Error('Missing or invalid task name in definition');
        }
        this.definitions[opts.name] = {
            name: opts.name,
            title: opts.title,
            singleton: opts.singleton === true,
            control: opts.control,
            view: opts.view
        };
        return this;
    };

    Workspace.prototype.include = function() {
        return this;
    };

    /** 
     * Pushes a new task onto the workspace as the active child of the indicated parent.
     */
    Workspace.prototype.push = function(parent, name, args) {

        // Get task definition
        var definition = this.definitions[name];
        if (!definition) {
            throw new Error("Unknown task: " + name);
        } else if (!parent && !definition.singleton) {
            throw new Error('Attempted to add instance class with no parent');
        }

        // Find existing singleton task
        var signature = this.signature(name, args);
        //console.log("workspace.push:", parent ? parent.signature : undefined, signature);
        var task = this.singletons[signature];
        if (task) {
            this.activate(task);
        } else {

            // $('#' + this.control.id() + ' .panel .panel-body').css('height','');

            // Append panel (including header)
            var panel = this.control.append('stack', [
                '<div alia-context class="panel panel-default">',
                '  <div alia-context="header" style="cursor: pointer;" class="panel-heading">',
                '    <h4 alia-context="title" class="panel-title"></h4>',
                '  </div>',
                '</div>'
            ].join(''));

            // Append body
            var body = panel.append('<div alia-context class="panel-body"></div>');

            // Initialize and bind title
            var title = alia.state(definition.title);
            body.defineProperty('title', title);
            body.title.assign(panel, 'khtml', 'title');

            // Create and add task
            task = new Task(this, {
                id: panel.id(),
                parent: parent,
                name: name,
                signature: signature,
                args: args,
                panel: panel,
                body: body,
                control: definition.control,
                view: definition.view
            });
            if (definition.singleton) {
                this.singletons[signature] = task;
            } else {
                parent.subtasks.push(task);
            }

            // Setup context functions
            body.push = task.push.bind(task);
            this.viewport.push = task.push.bind(task);

            // Header click event handler
            var jheader = $('#' + panel.id('header'));
            jheader.click(function() {
                this.activate(task);
            }.bind(this));

            // Render and activate task
            this.render(task);
            this.activate(task);

            // var bottom = $(window).height();
            // var offset = 0;
            // $('#' + this.control.id() + ' .panel').each(function () {
            //     // console.log($(this).css("display") == 'none');
            //     console.log('here');
            //     offset += $(this).height();
            // });
            // var padding = 75;
            // var height = bottom - offset - padding;

            // console.log(bottom);
            // console.log(offset);
            // console.log(height);
            // $('#' + task.body.id()).css('height', height + 'px');
        }

        // Update visible task and location bar
        this.active = task;
        if (parent) {
            var $location = providers.$location;
            $location.search(signature);
        }

        // Return task
        return task;
    };

    Workspace.prototype.render = function(task) {
        task.control(task.body, task.args);
        this.viewport.empty();
        task.view(this.viewport, task.args);
    };

    Workspace.prototype.signature = function(name, args) {
        var signature = [];
        for (var p in args) {
            if (args.hasOwnProperty(p) && p !== 'task') {
                signature.push(p + '=' + args[p]);
            }
        }
        return ['task=' + name].concat(signature.sort()).join('&');
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Task

    /**
     * Task represents a task within a workspace.
     *
     * @constructor
     * @param {Workspace} Workspace containing this task.
     * @param {object} Options.
     */
    function Task(workspace, opts) {
        this.workspace = workspace;

        this.id = opts.id;
        this.name = opts.name;
        this.signature = opts.signature;
        this.args = opts.args || undefined;
        this.control = opts.control;
        this.view = opts.view;

        this.panel = opts.panel;
        this.body = opts.body;

        this.element = $('#' + this.id);
        this.detached = false;

        this.parent = opts.parent || null;
        this.child = null;
        this.subtasks = [];
    }

    /**
     * @name Task#collapse
     * @private
     *
     * @description
     * Collapses a task, keeping the header visible.
     */
    Task.prototype.collapse = function() {
        $('#' + this.body.id()).slideUp(200);
    };

    /**
     * @name Task#detach
     * @private
     *
     * @description
     * Detaches the task from the current visible branch, effectively hiding the task.
     */
    Task.prototype.detach = function() {
        var node = this;
        var count = 0;
        var task = this;

        function handler() {
            if (--count === 0) {
                console.log('detach');
                node.element.detach();
                node.detached = true;
            }
        }
        while (task !== null) {
            count += 2;
            $('#' + task.panel.id()).slideUp(200, handler);
            $('#' + task.id).fadeOut(200, handler);
            task = task.child;
        }
    };

    /**
     * @name Task#expand
     * @private
     *
     * @description
     * Expands a visible task, making the body visible.
     */
    Task.prototype.expand = function() {
        $('#' + this.body.id()).slideDown(200);
    };

    /** 
     * @name Task#hasSubtask
     * @private
     *
     * @description
     * Determines whether or not this task contains a given subtask.
     */
    Task.prototype.hasSubtask = function(task) {
        for (var i = 0; i < this.subtasks.length; ++i) {
            if (this.subtasks === task) {
                return true;
            }
        }
        return false;
    };

    /** 
     * @name Task#isActive
     * @private
     *
     * @description
     * Indicates whether or not this is the currently active task in the workspace. Note that
     * there can only be one active task at a time.
     */
    Task.prototype.isActive = function() {
        return this.workspace.active === this;
    };

    /** 
     * @name Task#isVisible
     * @private
     *
     * @description
     * Indicates whether or not this task is currently visible. A visible task is either the
     * currently active task on the stack, or a parent of the active task (i.e., it is visible
     * on the stack).
     */
    Task.prototype.isVisible = function() {
        var task = this.workspace.root;
        while (task !== this && task.child !== null) {
            task = task.child;
        }
        return task === this;
    };

    /** 
     * @name Task#push
     * @private
     *
     * @description
     * Pushes a task onto the stack as a child of this task.
     */
    Task.prototype.push = function(name, args) {
        return this.workspace.push(this, name, args);
    };



    // /**
    //  * Deactivates a task, causing
    //  */
    // Task.prototype.deactivate = function() {


    //     while (task !== null) {
    //         $('#' + task.id).fadeOut(200, function() {
    //             // Animation complete.
    //         });
    //         task = task.active;
    //     }
    // }


    // /** Pops this task off the stack. */
    // Task.prototype.pop = function() {

    // };



    // /** Shows a currently hidden task. */
    // Task.prototype.show = function() {
    //     var task = this;
    //     while (task !== null) {
    //         console.log("SHOW");
    //         $('#' + task.panel.id()).slideDown(200);
    //         $('#' + task.body.id()).slideDown(200);
    //         $('#' + task.id).fadeIn(200);
    //         task = task.activeChild;
    //     }
    // };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public definitions


    alia.defineControl = function(opts, ctor) {
        var name = 'do' + opts.name.charAt(0).toUpperCase() + opts.name.slice(1);
        alia[name] = function(parent, options) {
            // // ------------------------------------------------------------------
            // // Kyle modified this
            // var context = new Context(parent.id, undefined, parent.child_ids);
            // Object.defineProperty(context, 'type', {
            //     value: opts.name,
            //     writable: false,
            //     enumerable: true,
            //     configurable: false
            // });
            // // End Kyle's changes
            // // ------------------------------------------------------------------
            var component = ctor.call(parent, options);
            return component;
        };
    };

    alia.defineHeader = function(opts, ctor) {
        alia.resolve(opts.dependencies).then(function(deps) {
            alia.header.empty();
            var fcn = ctor.apply(null, deps);
            var component = fcn.call(null, alia.header);
            return component;
        });
    };

    alia.defineLayout = function(opts, ctor) {
        var name = 'layout' + opts.name.charAt(0).toUpperCase() + opts.name.slice(1);
        alia[name] = function(parent, options, callback) {


            var component = ctor.call(parent, options);
            return function() {
                callback(component);
                return component;
            }(); // <- Return with context, not component

            // // ------------------------------------------------------------------
            // // Kyle modified this
            // var context = new Context(parent.id, undefined, parent.child_ids);
            // Object.defineProperty(context, 'type', {
            //     value: opts.name,
            //     writable: false,
            //     enumerable: true,
            //     configurable: false
            // });
            // // End Kyle's changes
            // // ------------------------------------------------------------------
            // ctor.call(context, parent, options);
            // return callback(context);
        };
    };

    alia.defineModule = function() {

    };

    alia.defineMultiview = function(opts, ctor) {
        alia.defineView({
            path: opts.path,
            dependencies: opts.dependencies,
            multiview: true
        }, ctor);
    };

    alia.defineProvider = function(opts, ctor) {
        if (typeof opts.name !== 'string' || opts.name.substr(0, 1) !== '$') {
            throw new Error('Missing or invalid provider name');
        }
        var args = [];
        var deps = opts.dependencies;
        if (deps) {
            for (var i = 0; i < deps.length; ++i) {
                if (providers.hasOwnProperty(deps[i])) {
                    args.push(providers[deps[i]]);
                } else {
                    throw new Error('Unable to resolve provider dependency');
                }
            }
        }
        providers[opts.name] = ctor.apply(null, args);
    };

    alia.resolve = function(dependencies, args, data) {
        // console.log("alia.resolve:", dependencies, args, data);
        args = args || [];
        for (var i = 0; i < dependencies.length; ++i) {
            if (data && data.hasOwnProperty(dependencies[i])) {
                args.push(data[dependencies[i]]);
            } else if (providers.hasOwnProperty(dependencies[i])) {
                args.push(providers[dependencies[i]]);
            } else if (services.hasOwnProperty(dependencies[i])) {
                args.push(services[dependencies[i]].accessor);
            }
        }
        return alia.all(args);
    };


    alia.defineService = function(options, constructor) {
        console.log("--- DEFINE SERVICE:", options.name);
        services[options.name] = {
            dependencies: options.dependencies,
            constructor: constructor,
            accessor: alia.resolve(options.dependencies).then(function(deps) {
                return constructor.apply(null, deps);
            })
        };



        // service.accessor = alia.deferred(function(resolve, reject) {
        //     alia.resolve(service.dependencies).onResolve(function(args) {
        //         console.log("resolved", args);

        //         // console.log(args);
        //         var obj = constructor.apply(null, args);
        //         if (alia.isAccessor(obj)) {
        //             console.log("isAccessor");
        //             obj.onResolve(function(singleton) {
        //                 console.log("done", singleton);
        //                 resolve(singleton);
        //                 //service.observable.set(singleton);
        //             });
        //         } else {
        //             resolve(obj);
        //             // service.observable.set(obj);
        //         }
        //     });
        // });
    };



    alia.defineView = function(opts, ctor) {
        var $route = providers.$route;
        if (!$route) {
            throw new Error("Missing route provider");
        }
        views[opts.path] = {
            opts: opts,
            ctor: ctor
        };
        $route.when(opts, ctor);
        if (opts.default === true) {
            $route.otherwise(opts, ctor);
        }
    };



    alia.defineWidget = function() {

    };

    alia.defineWorkspace = function(opts, ctor) {
        alia.defineView({
            path: opts.path,
            dependencies: opts.dependencies,
            workspace: true
        }, ctor);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Utility functions

    /**
     * @name alia.int
     * @module ng
     * @function
     *
     * @description Converts the specified string to an integer.
     * @param {string} string String to be converted to an integer.
     * @returns {integer} an integer.
     */

    alia.int = function(str) {
        return parseInt(str, 10);
    };

    /**
     * @name alia.lowercase
     * @module ng
     * @function
     *
     * @description Converts the specified string to lowercase.
     * @param {string} string String to be converted to lowercase.
     * @returns {string} Lowercased string.
     */
    alia.lowercase = function(string) {
        return alia.isString(string) ? string.toLowerCase() : string;
    };

    alia.noop = function() {};

}(window.alia = window.alia || {}));