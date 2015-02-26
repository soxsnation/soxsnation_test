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
    // var panel_right = '<div class="col-md-10 column layout_area" ng-droppable="dropObject2"><div class="layout_element" uid="GEN_UID">[CHILDREN]</div></div>';
    var panel_right = '<div class="col-md-10 column layout_area" ng-droppable="dropObject2"><div class="layout_element" uid="GEN_UID">[CHILDREN]</div></div>';

    var layout_schema = {
        root: {
            uid: '00fdbf6d-0f1b-1444-5160-3cd3eb0d9e51',
            name: 'ROOT',
            schema: {
                uid: '08f4721a-3d14-4310-9afa-e547d9bcbd81',
                name: 'root_layout',
                containers: [{
                    name: 'main',
                    id: '00fdbf6d-0f1b-1444-5160-3cd3eb011111',
                    html: "<div class='col-md-12 column snGrid' ng-droppable=''>[CHILDREN]</div>",
                    children: []
                }]
            }

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

    function link(scope, element, attrs) {

        init();

        function get_layout_element(element_name) {
            for (var i = 0; i < layout_elements.length; ++i) {
                if (layout_elements[i].name == element_name) {
                    var layout_element = jQuery.extend(true, {}, layout_elements[i]);
                    for (var j = 0; j < layout_element.schema.containers.length; ++j) {
                        layout_element.schema.containers[j].id = get_uid();
                    }
                    return layout_element;
                }
            }
        }

        function construct_item_layout(item_schema) {
            var new_html = '';
            console.log('item_schema: ');
            console.log(item_schema);

            layout_element = item_schema; 
            new_html = layout_element.html;

            if (item_schema.schema.hasOwnProperty('containers')) {
                for (var i = 0; i < item_schema.schema.containers.length; ++i) {
                    console.log('Adding Item: ' + item_schema.schema.containers[i].id);
                    var item_html = '';
                    item_html += item_schema.schema.containers[i].html;
                    item_html = item_html.replace('[CHILDREN]', '<div id="drop_div" uid="' + item_schema.schema.containers[i].id + '">' + item_schema.schema.containers[i].id + '[CHILDREN]</div>');
                    for (var j = 0; j < item_schema.schema.containers[i].children.length; ++j) {

                        item_html = add_child_layout(item_html, construct_item_layout(item_schema.schema.containers[i].children[j]));                        
                    }
                    new_html = new_html.replace('[CONTAINERS]', item_html + '[CONTAINERS]');
                }
                new_html = new_html.replace('[CONTAINERS]', '');
            } else {
                console.log('No Container: ' + item_schema.schema)
            }
            new_html = new_html.replace('[CHILDREN]', '');
            // console.log('Child HTML');
            // console.log(new_html);
            return new_html;
        }

        function add_child_layout(html, child_html) {
            child_html = child_html.replace('[CHILDREN]', '');
            return html.replace('[CHILDREN]', child_html + '[CHILDREN]');
        }

        function construct_generated_layout() {
            console.log('construct_generated_layout: ');

            console.log(JSON.stringify(layout_schema.root.schema.containers[0]));
            var display_panel = panel_right.replace('GEN_UID', layout_schema.root.schema.containers[0].id);

            for (var i = 0; i < layout_schema.root.schema.containers[0].children.length; ++i) {
                display_panel = add_child_layout(display_panel, construct_item_layout(layout_schema.root.schema.containers[0].children[i]))
            }

            // console.log('display_panel');
            // console.log(display_panel);
            display_panel = display_panel.replace('[CHILDREN]', '');
            element.html(display_panel);
            $compile(element.contents())(scope);
        }

        function add_child_schema(layout, uid, child_schema) {
            console.log('add_child_schema: ' + layout.name);
            console.log(uid);
            console.log(layout);
            if (layout.schema.hasOwnProperty('containers')) {
                for (var i = 0; i < layout.schema.containers.length; ++i) {
                    if (uid == layout.schema.containers[i].id) {
                        console.log('FOUND container for child_schema: ' + JSON.stringify(layout.schema.containers[i]));
                        layout.schema.containers[i].children.push(child_schema);
                        console.log('Layout with child: ' + JSON.stringify(layout.schema))
                        return layout;
                    }
                }

                for (var i = 0; i < layout.schema.containers.length; ++i) {
                    if (layout.schema.containers[i].hasOwnProperty('children')) {
                        for (var j = 0; j < layout.schema.containers[i].children.length; ++j) {
                            add_child_schema(layout.schema.containers[i].children[j], uid, child_schema);
                        }
                    }
                }
            }

            // console.log('add_child_schema::END');
            // return schema;
        }

        scope.updateLayout = function(layout, item_uid) {
            scope.layout_elements = layout_elements;
            // console.log('Add layout: ' + layout);
            // console.log(item_uid);

            add_child_schema(layout_schema.root, item_uid, get_layout_element(layout));
            // console.log('Current Schema');
            // console.log(layout_schema.root);
            construct_generated_layout();

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

            // layout_schema.root.uid = get_uid();
            // layout_schema.root.schema.containers[0].id = get_uid();
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
                if ($scope.hover_items.length > 0) {
                    $scope.updateLayout(dropped_item, $scope.hover_items.pop());
                    $scope.hover_items = [];
                }
                // $scope.dropped = false;
            }

            $scope.parse_item_uid = function(item) {
                console.log('$scope.parse_item_uid: ' + item);
                var start = item.indexOf("uid=") + 5;
                var item_uid = item.substring(start, start + 36);
                return item_uid;
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
                $scope.hover_items.push($scope.parse_item_uid(item));
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
                    // console.log('ngDroppable::over: ' + elem.html());
                    layoutCtrl.container_over(elem.html());
                },
                out: function(event, ui) {
                    // console.log('ngDroppable::out: ' + $(ui.draggable).html());
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

            $scope.submit_layout = function() {
                console.log('$scope.submit_layout');

            }
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
