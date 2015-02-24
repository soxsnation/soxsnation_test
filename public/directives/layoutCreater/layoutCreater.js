/* layout.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/20/2015
 *
 */


/**
 * Main module
 */
angular.module('layoutCreater', []);



/**
 * Main directive
 */

// angular.module('layoutCreater').directive('snLayoutElements', function($http) {
//     return {
//         restrict: 'EA',
//         templateUrl: '/directives/layoutCreater/templates/main.html'
//     };
// })

angular.module('layoutCreater').directive('snLayout', function($http, $compile, $rootElement, $window, $timeout, $sce) {

    var layout_elements = [];

    var panel_all = '<div class="container"><div class="rowclearfix"><div class="col-md-2 column"><div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements">{{layout_element.name}}</div><p>Left Panel</p></div><divclass="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2">Right Panel</div></div></div>';
    var panel = '<div style="display:block;"><input type="button" data-ng-click="debug()" value="debug" ></div><div class="container"><div class="row clearfix">[LEFT][RIGHT]</div></div>'
    var panel_left = '<div class="col-md-2 column">LEFT DIV<div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements"><div class="layout_item" ng-draggable="dragOptions">{{layout_element.name}}</div></div></div>';
    var panel_right = '<div class="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2"><div id="drop_div" uid="GEN_UID">[CHILDREN]</div></div>';

    var layout_schema = {
        root: {
            id: '',
            name: 'ROOT',
            children: []
        }

    };

    function get_uid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function get_layout_item(uid, schema) {
        if (schema.root.uid === uid) {
            return name;
        } else {
            for (var i = 0; i < schema.children.length; ++i) {
                return name + '.';
            }
        }
    }

    function generate_item_schema(schema_name, item_uid) {
        var new_html = '';
        for (var i = 0; i < layout_elements.length; ++i) {
            if (layout_elements[i].name == schema_name) {
                new_html = layout_elements[i].schema;
                if (layout_elements[i].options.hasOwnProperty('children')) {
                    if (layout_elements[i].options.children) {
                        new_html = new_html.replace('[OPTIONS]', '<div id="drop_div" uid="' + item_uid + '"></div>');
                    } else {
                        new_html = new_html.replace('[OPTIONS]', '');
                    }
                } else {
                    new_html = new_html.replace('[OPTIONS]', '');
                }
                break;
            }
        }
        return new_html;
    }

    function link(scope, element, attrs) {

        init();

        function construct_item_layout(item_schema) {
            var new_html = '';
            // console.log('item_schema');
            // console.log(item_schema);
            for (var i = 0; i < layout_elements.length; ++i) {
                if (layout_elements[i].name == item_schema.name) {
                    new_html = layout_elements[i].schema;
                    if (layout_elements[i].options.hasOwnProperty('children')) {
                        if (layout_elements[i].options.children) {
                            new_html = new_html.replace('[OPTIONS]', '<div id="drop_div" uid="' + item_schema.id + '">[CHILDREN]</div>');
                            // console.log('New HTML Constructed:');
                            // console.log(new_html);
                            for (var i = 0; i < item_schema.children.length; ++i) {
                                new_html = add_child_layout(new_html, construct_item_layout(item_schema.children[i]));
                            }
                        } else {
                            new_html = new_html.replace('[OPTIONS]', '<div id="drop_div" uid="' + item_schema.id + '"></div>');
                        }
                    } else {
                        new_html = new_html.replace('[OPTIONS]', '<div id="drop_div" uid="' + item_schema.id + '"></div>');
                    }
                    break;
                }
            }
            new_html = new_html.replace('[CHILDREN]', '');
            // console.log('Child HTML');
            // console.log(new_html)
            return new_html;
        }

        function add_child_layout(html, child_html) {
            child_html = child_html.replace('[CHILDREN]', '');
            return html.replace('[CHILDREN]', child_html + '[CHILDREN]');
        }

        function construct_generated_layout() {
            var display_panel = panel_right.replace('GEN_UID', layout_schema.root.id);

            for (var i = 0; i < layout_schema.root.children.length; ++i) {
                display_panel = add_child_layout(display_panel, construct_item_layout(layout_schema.root.children[i]))
            }

            // console.log('display_panel');
            // console.log(display_panel);
            element.html(display_panel);
            $compile(element.contents())(scope);
        }

        function add_child_schema(schema, uid, child_schema) {
            if (uid == schema.id) {
                schema.children.push(child_schema);
                return schema;
            } else {
                for (var i = 0; i < schema.children.length; ++i) {
                    return add_child_schema(schema.children[i], uid, child_schema);
                    // if (item_uid == schema.children[i].id) {
                    //     schema.children[i].children.push(item);
                    // } 
                }
            }
        }

        scope.updateLayout = function(layout, item_uid) {
            scope.layout_elements = layout_elements;
            console.log('Update layout: ' + layout);
            console.log(layout);
            // console.log(container_item.html());

            // var start = container_item.html().indexOf("uid=") + 5;
            // var item_uid = container_item.html().substring(start, start + 36);
            // console.log('UID:' + item_uid);

            var item = {
                id: get_uid(),
                name: layout,
                children: []
            };

            // if (item_uid == layout_schema.root.id) {
            //     layout_schema.root.children.push(item);
            // } else {
            //     for (var i = 0; i < layout_schema.root.children.length; ++i) {
            //         console.log()
            //         if (item_uid == layout_schema.root.children[i].id) {
            //             layout_schema.root.children[i].children.push(item);
            //         }
            //     }
            // }
            add_child_schema(layout_schema.root, item_uid, item);

            console.log('Current Layout Schema')
            console.log(JSON.stringify(layout_schema));

            construct_generated_layout();

            // var new_html = container_item.html();
            // var item_html = generate_item_schema(layout, item.id);
            // console.log('item_html');
            // console.log(item_html);
            // new_html = new_html.replace('<div id="drop_div" uid="' + item_uid + '"></div>', '<div id="drop_div" uid="' + item_uid + '">' + item_html + '</div>');


            // // console.log(element.html());
            // // var new_html = element.html().replace(container_item, layout);
            // // console.log('new_html');
            // // console.log(new_html);
            // container_item.html(new_html);
            // $compile(container_item.contents())(scope);

            // // console.log(element.html());

        }

        function init() {

            $http.get('/directives/layoutCreater/templates/layout_elements.json').
            success(function(data, status, headers, config) {
                layout_elements = data;
                console.log('layout_elements');
                console.log(layout_elements);
                scope.layout_elements = layout_elements;

                create_elements_panel();
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });


        }

        function create_elements_panel() {
            // var container = $templateCache.get('angularChartsTemplate_' + config.legend.position);
            // var container = '<p>This is a paragraph</p>';
            var uid = get_uid();
            layout_schema.root.id = uid;
            // var display_panel = panel.replace('[LEFT]', panel_left).replace('[RIGHT]', panel_right).replace('GEN_UID', uid);
            // console.log('display_panel: ' + display_panel)
            // element.html(display_panel);
            // $compile(element.contents())(scope);
            construct_generated_layout();
        }
    }





    return {
        require: '^snLayout',
        restrict: 'EA',
        link: link,
        transclude: 'true',
        scope: {
            snLayout: '=',
            snData: '=',
            snElements: '='
        },
        controller: function($scope) {

            $scope.dropped = true;
            $scope.hover_items = [];

            $scope.debug = function() {
                console.log('DEBUG');
            }

            this.item_dropped = function(dropped_item, container_item) {
                // $scope.updateLayout(dropped_item, container_item);
                $scope.updateLayout(dropped_item, $scope.hover_items.pop());
                $scope.hover_items = [];
                // $scope.dropped = false;
            }

            function get_items_uid(item) {
                var start = item.indexOf("uid=") + 5;
                var item_uid = item.substring(start, start + 36);
                return item_uid;
            }

            this.container_over = function(item) {
                // console.log(item);
                // var start = item.indexOf("uid=") + 5;
                // var item_uid = item.substring(start, start + 36);
                // console.log(item_uid);

                // $scope.hover_items.push(item_uid);
                $scope.hover_items.push(get_items_uid(item));
                console.log($scope.hover_items);
            }

            this.container_out = function(item) {
                $scope.hover_items.pop();
                console.log($scope.hover_items);

            }

            this.accept_drop = function(container_item) {
                return $scope.dropped;
            }
        }
    }

}).directive('ngDroppable', function($document) {
    return {
        require: '^snLayout',
        restrict: 'EA',
        // transclude: true,
        scope: {
            dropOptions: '=ngDroppable'
        },
        link: function(scope, elem, attr, layoutCtrl) {
            $(elem).droppable({
                helper: 'clone',
                drop: function(event, ui) {
                    layoutCtrl.item_dropped($(ui.draggable).html(), elem);
                    // console.log('ngDroppable::DROPPED: ' + JSON.stringify(scope.dropOptions));
                    // console.log(elem.html());

                    // $compile($(this).html(schema));
                    // var schema = '<p>Item Dropped: ' + $(ui.draggable).html() + '</p>';

                },
                over: function(event, ui) {
                    // console.log('ngDroppable::over: ' + $(ui.draggable).html());
                    console.log('ngDroppable::over: ' + elem.html());
                    // console.log('ngDroppable::over: ' + $(this).html());
                    layoutCtrl.container_over(elem.html());
                },
                out: function(event, ui) {
                    // console.log('ngDroppable::out: ' + $(ui.draggable).html());
                    // Drag_Factory.valid_drop = false;
                    layoutCtrl.container_out(elem.html());

                },
                // accept: '#grid'
                accept: function(dragEl) {
                    // console.log('Accept Drop: ' + layoutCtrl.accept_drop());
                    // console.log($(this).html());
                    return layoutCtrl.accept_drop();

                }
            });
        }
    }
})

angular.module('layoutCreater').directive('snLayouts', function($http) {
    return {
        templateUrl: '/directives/layoutCreater/templates/main.html',
        controller: function($scope) {
            $http.get('/directives/layoutCreater/templates/layout_elements.json').
            success(function(data, status, headers, config) {
                $scope.layout_elements = data;
                console.log('layout_elements');
                console.log($scope.layout_elements);
            }).
            error(function(data, status, headers, config) {});
        }
    };
}).directive('ngDraggable', function($document) {
    return {
        require: '^snLayouts',
        restrict: 'EA',
        scope: {
            dragOptions: '=ngDraggable'
        },
        link: function(scope, elem, attr, layoutCtrl) {
            // $(elem).draggable(scope.dragOptions);
            $(elem).draggable({
                revert: 'invalid',
                // revert: true,
                helper: 'clone',
                // containment: $("#layout_creation_area"),
                stop: function(event, ui) {
                    // console.log('ngDraggable::STOP: ' + JSON.stringify(scope.dragOptions));

                }
            });
        }
    }
})
