angular.module('templateCreator', []);

angular.module('templateCreator').directive('snTemplates', function($http, $compile) {



    function link(scope, element, attrs) {



        function parse_template(template, html, stack) {
console.log('template type: ' + template.type);
            if (template.type == 'div') {
                html += '<div>';
                stack.push('div');
                return parse_template(template.schema, html, stack) + '</div>';
            } else if (template.type == 'p') {
                html += template.p;
                return html;
            }


        }


        function init() {

            var html = '';
            var stack = [];

            var t = {
                schema: {
                    type: 'div',
                    // div: {
                        schema: {
                            type: 'p',
                            p: 'This is the text'
                        }
                    // }
                }
            }

            var display = parse_template(t.schema, html, stack);
            // var display = '<div><p>This is the display</p></div>';
            console.log(display);
            element.html(display);
            $compile(element.contents())(scope);

        }




        init();

    }

    return {
        restrict: 'EA',
        link: link,
        transclude: 'true',
        // templateUrl: '/directives/layoutCreater/templates/main.html',
        controller: function($scope) {



        }
    };
})
