angular.module('templateCreator', []);

angular.module('templateCreator', ['snDraggable']).directive('snTemplates', function($http, $compile) {



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
                $http.get('/directives/templateCreator/templates/template_elements.json').
                    // $http.get('/directives/layoutCreater/templates/layout_elements.json').
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

            function load_data() {
                get_json(function(template) {
                    scope.tags = template;
                });
            }

            function init() {

                load_data();

                // var center_viewport = element.find('center-viewport');
                // var center_viewport = element.find('canvas'); //.parent();
                // center_viewport.html('<p>This is the added content</p>')
                // $compile(center_viewport.contents())(scope);

                // build_view();
            };

            scope.item_dropped = function(item, parent) {
                for (var i = 0; i < scope.tags.length; ++i) {
                    if (scope.tags[i].name == item) {
                        scope.options = scope.tags[i].options;
                        var center_viewport = element.find('canvas').parent();
                        // center_viewport.append("<p>" + item + "</p>");
                        center_viewport.append(scope.tags[i].html);
                        $compile(center_viewport.contents())(scope);
                    }
                }
            }

            scope.item_selected = function(item) {
                for (var i = 0; i < scope.tags.length; ++i) {
                    if (scope.tags[i].name == item) {
                        scope.options = scope.tags[i].options;
                        // var center_viewport = element.find('canvas').parent();
                        // center_viewport.append("<p>" + item + "</p>");
                        // center_viewport.append(scope.tags[i].html);
                        // $compile(center_viewport.contents())(scope);
                    }
                }
                console.log(scope.options);
                scope.$apply();
            }


            init();

        }

        return {
            restrict: 'E',
            link: link,
            transclude: 'true',
            templateUrl: '/directives/templateCreator/templates/templateCreator.html',
            controller: function($scope) {
                console.log('templateCreator');

                $scope.sidebar_left_state = "expanded-left";
                $scope.sidebar_left_collapsed = "";
                $scope.sidebar_right_state = "expanded-right";
                $scope.sidebar_right_collapsed = "";

                $scope.id_one = "First";
                $scope.id2 = "Second";
                $scope.id3 = "Third";


                $scope.sidebar_collapser_left_click = function() {
                    console.log('sidebar_collapser_left_click');
                    if ($scope.sidebar_left_collapsed == "collapsed") {
                        $scope.sidebar_left_state = "expanded-left";
                        $scope.sidebar_left_collapsed = "";
                    } else {
                        $scope.sidebar_left_state = "collapsed-left";
                        $scope.sidebar_left_collapsed = "collapsed";
                    }
                }

                $scope.sidebar_collapser_right_click = function() {
                    console.log('sidebar_collapser_right_click');
                    if ($scope.sidebar_right_collapsed == "collapsed") {
                        $scope.sidebar_right_state = "expanded-right";
                        $scope.sidebar_right_collapsed = "";
                    } else {
                        $scope.sidebar_right_state = "collapsed-right";
                        $scope.sidebar_right_collapsed = "collapsed";
                    }
                }

                $scope.onDropComplete1 = function(data, evt, id) {
                    console.log("Drop1: " + JSON.stringify(data));
                    console.log("Drop1: " + JSON.stringify(id));
                    $scope.item_dropped(data, id);
                }

                $scope.onItemClick = function(item_id) {
                    console.log("onItemClick: " + item_id);
                    $scope.item_selected(item_id);
                    // for (var i = 0; i < $scope.tags.length; ++i) {
                    //     if ($scope.tags[i].name == item_id) {
                    //         console.log('Found item_id: ' + item_id);
                    //         $scope.options = $scope.tags[i].options;
                    //     }
                    // }
                }
            }
        };
    })
    // .directive('snDroppable', function($document) {
    //     return {
    //         require: '^snTemplates',
    //         restrict: 'EA',
    //         // transclude: true,
    //         scope: {
    //             dropOptions: '=ngDroppable'
    //         },
    //         link: function(scope, elem, attr, layoutCtrl) {
    //             $(elem).droppable({
    //                 helper: 'clone',
    //                 drop: function(event, ui) {
    //                     // layoutCtrl.item_dropped($(ui.draggable).html(), elem);
    //                     // console.log('ngDroppable::DROPPED: ' + JSON.stringify(scope.dropOptions));
    //                     console.log('elem.html()');
    //                     console.log(elem.html());

//                     // $compile($(this).html(schema));
//                     // var schema = '<p>Item Dropped: ' + $(ui.draggable).html() + '</p>';

//                 },
//                 over: function(event, ui) {
//                     console.log('ngDroppable::over: ' + elem.html());
//                     layoutCtrl.container_over(elem.html());
//                 },
//                 out: function(event, ui) {
//                     console.log('ngDroppable::out: ' + $(ui.draggable).html());
//                     layoutCtrl.container_out(elem.html());

//                 },
//                 // accept: '#grid'
//                 accept: function(dragEl) {
//                     // console.log('Accept Drop: ' + layoutCtrl.accept_drop());
//                     // console.log($(this).html());
//                     return layoutCtrl.accept_drop();

//                 }
//             });
//         }
//     }
// })
