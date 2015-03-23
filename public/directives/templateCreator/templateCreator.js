angular.module('templateCreator', []);

angular.module('templateCreator', ['snDraggable'])
.directive('snTemplates', ['$http', '$compile', 'snTemplateService', 
    function($http, $compile, snTemplateService) {



        function link(scope, element, attrs) {

            var nextId = 1;
            scope.elements = {};


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
                scope.element_list = [];//scope.snTemplateData;
                scope.selected_element_id = 'none';
                scope.selected_element = {};
                

                // load_data();

                // var markup = '';
                // var center_viewport = element.find('canvas').parent();
                // for (var i = 0; i < scope.element_list.length; ++i) {
                //     scope.elements[scope.element_list[i].id] = scope.element_list[i];
                //     markup += build_element_markup(scope.element_list[i]);
                // }
                // center_viewport.append(markup);
                // $compile(center_viewport.contents())(scope);
            };

            function build_item_markup(ele_obj) {
                console.log('build_item_markup');
                console.log(ele_obj);
                var item_markup = ele_obj.markup;

                item_markup = item_markup.replace("[id]", ele_obj.id);
                return item_markup;
            }

            function build_drop_area(ele_obj) {

                cb(drop_markup);
            }

            function build_hover_div(ele_obj) {
                console.log('build_hover_div');

                var hover_markup = "<div class='snItem {{elements." + ele_obj.id + ".css_box_class}}'>";
                hover_markup += build_item_markup(ele_obj);
                hover_markup += "</div>";
                hover_markup += '<span class="label label-info snText">' + ele_obj.id + '</span>';
                return hover_markup;
            }

            function build_click_div(ele_obj) {
                var c = "'({{selected_element_id}} == " + ele_obj.id +") ? \"snText_selected\" : \"snText_unselected\"'";
                console.log('c: ' + c);
                // var click_markup = "<div class='snText-click' ng-class=\"{true: 'snText_selected'}[selected_element_id == "+ ele_obj.id +"] \">" + ele_obj.id + " </div>";
                // var click_markup = "<div class='snText-click {{elements." + ele_obj.id + ".css_class}}'>" + ele_obj.id + "</div>";
                var click_markup = '<div class="snText_header"><span class="label label-primary {{elements.' + ele_obj.id + '.css_class}}">' + ele_obj.id + '</span></div>';
                return click_markup;
            }

            function build_outter_div(ele_obj) {

                var markup = "<div class='snOutDiv' sn-item='true' sn-item-click='onItemClick($id)'  id='" + ele_obj.id +"'>";
                markup += build_click_div(ele_obj);
                markup += build_hover_div(ele_obj);
                markup += "</div>";
                return markup;


            }

            function build_element_markup(tag_obj) {

                return snTemplateService.build_element(tag_obj);

                // console.log('build_element');
                // console.log(tag_obj);
                if (tag_obj.hasOwnProperty('markup')) {
                    return build_outter_div(tag_obj);
                }

                return '';
            }

            function build_element(tag_obj) {
                var ele_id = tag_obj.name.concat(nextId.toString());
                nextId++;

                var ele = {
                    id: ele_id,
                    name: tag_obj.name,
                    markup: tag_obj.markup.replace('[id]', ele_id),
                    properties: tag_obj.properties,
                    css_class: 'snText_unselected',
                    css_box_class: 'snText_hidebox'
                };

                return ele;
            }

            scope.item_dropped = function(item, parent) {
                for (var i = 0; i < scope.snTemplateElements.length; ++i) {
                    if (scope.snTemplateElements[i].name == item) {
                        var new_element = build_element(scope.snTemplateElements[i]);
                        scope.element_list.push(new_element);
                        scope.elements[new_element.id] = new_element;

                        scope.properties = scope.snTemplateElements[i].properties;
                        var center_viewport = element.find('canvas').parent();
                        // center_viewport.append("<p>" + item + "</p>");

                        var markup = build_element_markup(new_element);
                        // console.log('markup: ' + markup);
                        center_viewport.append(markup);
                        $compile(center_viewport.contents())(scope);
                    }
                }
            }

            function update_css_classes() {
                // console.log('update_css_classes: ' + scope.selected_element_id);
                // console.log(scope.elements);
                for (var ele in scope.elements) {
                    // console.log('Checking item: ' + ele);
                    if (ele == scope.selected_element_id) {
                        // console.log('update_css_classes[snText_selected]: ' + ele);
                        scope.elements[ele].css_class = 'snText_selected';
                        scope.elements[ele].css_box_class = 'snText_showbox';
                    }
                    else {
                        scope.elements[ele].css_class = 'snText_unselected';
                        scope.elements[ele].css_box_class = 'snText_hidebox';
                    }
                }
            }

            scope.item_selected = function(item) {
                // console.log('item_selected: ' + item);
                for (var i = 0; i < scope.element_list.length; ++i) {
                    if (scope.element_list[i].id == item) {
                        scope.properties = scope.element_list[i].properties;
                        scope.selected_element = scope.element_list[i];
                        scope.selected_element_id = scope.element_list[i].id;
                        update_css_classes();

                        // var center_viewport = element.find('canvas').parent();
                        // center_viewport.append("<p>" + item + "</p>");
                        // center_viewport.append(scope.tags[i].html);
                        // $compile(center_viewport.contents())(scope);
                    }
                }
                scope.$apply();
            }


            init();

        }

        return {
            restrict: 'E',
            link: link,
            transclude: 'true',
            templateUrl: '/directives/templateCreator/templates/templateCreator.html',
            scope: {
                snTemplateElements: '=',
                snTemplateData: '=',
                snSave: '=',
                snCancel: '='
            },
            controller: function($scope) {
                console.log('templateCreator');
                

                $scope.sidebar_left_state = "expanded-left";
                $scope.sidebar_left_collapsed = "";
                $scope.sidebar_right_state = "expanded-right";
                $scope.sidebar_right_collapsed = "";

                $scope.id_one = "First";
                $scope.id2 = "Second";
                $scope.id3 = "Third";

                $scope.apply_properties = function() {
                    console.log('apply_properties');
                    console.log(JSON.stringify($scope.properties));
                    // $scope.$apply();
                }

                $scope.get_values = function() {
                    console.log($scope.element_list[0].properties);
                }

                $scope.cancel = function() {
                    $scope.snCancel();
                }

                $scope.save_layout = function() {
                    console.log('save_layout');
                    // console.log($scope.element_list);
                    // console.log(JSON.stringify($scope.element_list));
                    // $scope.snTemplateData = $scope.element_list[i];

                    // $scope.snTemplateData = JSON.parse(JSON.stringify($scope.element_list));

                    $scope.snSave(JSON.parse(JSON.stringify($scope.element_list)));
                    
                }


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
                    // console.log("onItemClick: " + item_id);
                    $scope.item_selected(item_id);
                    // for (var i = 0; i < $scope.tags.length; ++i) {
                    //     if ($scope.tags[i].name == item_id) {
                    //         console.log('Found item_id: ' + item_id);
                    //         $scope.properties = $scope.tags[i].properties;
                    //     }
                    // }
                }
            }
        };
    }])
.directive('snElementProperty', function($document) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                snElement: '='
            },
            templateUrl: '/directives/templateCreator/templates/right_panel.html',
            controller: function($scope) {
                $scope.is_empty = true; 

                $scope.$watch('snElement', function() {
                    console.log('snElementProperty Updated');
                    console.log($scope.snElement);
                    if ($scope.snElement.hasOwnProperty('id')) {
                    $scope.is_empty = false;
                }
                })

                $scope.show_element = function() {
                    console.log('snElementProperty');
                    console.log($scope.snElement);
                }

                $scope.apply_properties = function() {
console.log($scope.snElement.properties[1].value);

                }
            }
            // link:function(scope, elem, attr) {

            // }
        }
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
