angular.module('templateCreator', []);

angular.module('templateCreator').directive('snTemplates', function($http, $compile) {



    function link(scope, element, attrs) {

        function parse_tag(tag) {
            var html = '<' + tag.tag;

            for (var k in tag.schema) {
                html += ' ' + k + '="' + tag.schema[k] + '"';
            }
            html += '>';

            if (tag.hasOwnProperty('text')) {
                html += tag.text;
            }

            if (tag.hasOwnProperty('children')) {
                return html + parse_template2(tag.children) + '</' + tag.tag + '>';
            } else {
                return html + '</' + tag.tag + '>';
            }
        }


        function parse_template(template, html, stack) {
            console.log('template tag: ' + template.tag);
            if (template.tag == 'div') {
                html += '<div>';
                stack.push('div');
                return parse_template(template.children[0], html, stack) + '</div>';
            } else if (template.tag == 'p') {
                html += template.schema.text;
                return html;
            }
        }

        function parse_template2(template) {
            var html = '';
            for (var i = 0; i < template.length; ++i) {
                html += parse_tag(template[i]);
            }
            return html;
        }

        function get_json(cb) {
            console.log('getting json data');
            $http.get('/directives/templateCreator/templates/temp.json').
            success(function(data, status, headers, config) {
                console.log('got json data');
                cb(data);
            }).
            error(function(data, status, headers, config) {});
        }

        function get_left_panel(cb) {
            // $http.get('/directives/templateCreator/templates/left_panel.html').
            $http.get('/directives/templateCreator/templates/templateCreator.html').
            success(function(data, status, headers, config) {
                // console.log('got left panel');
                cb(data);
            }).
            error(function(data, status, headers, config) {});
        }

        function get_right_panel(cb) {
            $http.get('/directives/templateCreator/templates/right_panel.html').
            success(function(data, status, headers, config) {
                console.log('got json data');
                cb(data);
            }).
            error(function(data, status, headers, config) {});
        }

        function build_view() {
            get_json(function(template) {
                scope.tags = template;
                console.log('template');
                console.log(template);
                get_left_panel(function(template_html) {
                    var display = parse_template2(template);

                    scope.template_html = template_html.replace('[DISPLAY]', display);
                    element.html(scope.template_html);
                    $compile(element.contents())(scope);
                })

            });
        }


        function init() {

            var html = '';
            var stack = [];

build_view();
        };




        init();

    }

    return {
        restrict: 'E',
        // link: link,
        transclude: 'true',
        templateUrl: '/directives/templateCreator/templates/templateCreator.html',
        controller: function($scope) {

console.log('templateCreator');

        }
    };
})
