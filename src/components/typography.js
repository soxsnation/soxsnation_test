'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Headings

alia.defineLayout({
    name: 'heading'
}, function() {
    var headerTypes = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6'
    };

    return function(options) {
        // Set default options
        alia.applyDefaults(options, {
            type: 'h1',
            visible: true
        });

        var elm = this.append('<:type alia-context></:type>', {
            type: headerTypes[options.type]
        });

        elm.bindHtml('text', options.text);
        elm.bindVisible(options.visible);

        return elm;
    };
}());

alia.defineControl({
    name: 'heading'
}, function() {
    var headerTypes = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6'
    };

    return function(options) {
        // Set default options
        alia.applyDefaults(options, {
            type: 'h1',
            visible: true
        });

        var elm = this.append('<:type alia-context></:type>', {
            type: headerTypes[options.type]
        });

        elm.bindHtml('text', options.text);
        elm.bindVisible(options.visible);

        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Link

alia.defineControl({
    name: 'link'
}, function() {
    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        var elm = this.append('<a alia-context style="cursor: pointer"></a>');

        if (typeof options.name === 'string') {
            elm.attr('name', options.name);
        }

        elm.bindHtml('text', options.text);
        elm.bindVisible(options.visible);

        return elm
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Text

alia.defineControl({
    name: 'text',
}, function() {

    var weights = {
        'italics': '<em>:text</em>',
        'bold': '<strong>:text</strong>'
    };
    var sizes = {
        'small': '<small>:text</small>'
    };

    var styles = {
        muted: 'text-muted',
        primary: 'text-primary',
        success: 'text-success',
        info: 'text-info',
        warning: 'text-warning',
        danger: 'text-danger'
    };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        var cls = [];
        if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
            cls.push(styles[options.style]);
        }

        var span = this.append('<span alia-context class=":class"></span>', {
            class: cls.join(' ')
        });

        function render(str) {
            span.empty();
            //var str = alia.get(options.text);
            if (str === undefined) return;
            if (typeof options.filter === 'function') {
                str = options.filter(str);
            }
            if (typeof options.weight === 'string' && weights.hasOwnProperty(options.weight)) {
                str = weights[options.weight].replace(':text', str);
            }
            if (typeof options.size === 'string' && sizes.hasOwnProperty(options.size)) {
                str = sizes[options.size].replace(':text', str);
            }
            span.html(str);
        }

        if (alia.isAccessor(options.text)) {
            options.text.observe(function(value) {
                render(value);
            }, function() {
                render();
            });
        } else {
            render(options.text);
        }

        span.bindVisible(options.visible);

        return span;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Break

alia.defineControl({
    name: 'break',
}, function(options) {
    return this.append('<br />');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Paragraph

alia.defineControl({
    name: 'paragraph',
}, function() {

    var styles = {
        'lead': 'lead'
    };

    var alignments = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right',
        'justify': 'text-justify'
    };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Determine class
        var cls = [];
        if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
            cls.push(styles[options.style]);
        }
        if (typeof options.alignment === 'string' && alignments.hasOwnProperty(options.alignment)) {
            cls.push(alignments[options.alignment]);
        }

        // Append button element
        var elm = this.append('<p alia-context class=":class">:text</p>', {
            class: cls.join(' '),
            text: alia.getString(options.text)
        });

        // Create bindings
        elm.bindHtml('text', options.text);
        elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Blockquote

alia.defineControl({
    name: 'blockquote'
}, function() {

    var styles = {
        'default': null,
        'reverse': 'blockquote-reverse'
    }

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true,
            style: 'default'
        }, {
            style: styles
        });

        // Append element
        var content =
            '<blockquote alia-context class=":class">' +
            '  <p alia-context="quote"></p>' +
            '</blockquote>';
        var elm = this.append(content, {
            class: _.compact([
                styles[options.style]
            ]).join('')
        });

        // Add footer
        if (options.footer) {
            var foot = elm.append('<footer alia-context></footer>');
            var footer = foot.bindHtml('footer', options.footer);
            elm.defineProperty('footer', footer);
        }

        // Bind html
        elm.bindHtml('quote', 'text', options.text);

        // Return element
        return elm;
    };
}());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markdown

alia.defineControl({
    name: 'markdown',
}, function() {

    // var styles = {
    //     'lead': 'lead'
    // };

    // var alignments = {
    //     'left': 'text-left',
    //     'center': 'text-center',
    //     'right': 'text-right',
    //     'justify': 'text-justify'
    // };

    return function(options) {

        // Set default options
        alia.applyDefaults(options, {
            visible: true
        });

        // Get markdown converter
        var converter = Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, {
            highlighter: "highlight",
            table_class: "table table-striped"
        });

        // Append button element
        var elm = this.append('<div alia-context></div>');

        // Generate markdown
        var j = $('#' + elm.id());
        var text = elm.defineProperty('text', options.text)
        text.onResolve(function(value) {
            j.empty();
            var html = converter.makeHtml(value);
            j.append(html);
            $('code').each(function(i, e) {
                hljs.highlightBlock(e);
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, elm.id()]);
        });

        // Create bindings
        elm.bindVisible(options.visible);

        // Return component
        return elm;
    };
}());

alia.defineControl({
    name: 'horizontalRule'
}, function(options) {
    return this.append('<hr />')
});