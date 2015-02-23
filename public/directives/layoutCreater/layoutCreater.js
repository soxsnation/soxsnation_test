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


angular.module('layoutCreater').directive('snLayout', function($templateCache, $compile, $rootElement, $window, $timeout, $sce) {

    var layout_elements = [{
        name: 'Grid',
        id: 'draggable',
        class: 'layout_grid',
        text: 'This is a grid',
        schema: '<div class="container"><div class="row clearfix"><div class="col-md-4 column">Left Side</div><div class="col-md-8 column">Right Side</div></div></div>',
        options: {

        }
    }, {
        name: 'Paragraph',
        id: 'draggable',
        class: 'layout_paragraph',
        text: 'This is a paragraph',
        schema: '<p>This is a paragraph</p>',
        options: {

        }
    }, {
        name: 'Button',
        id: 'draggable2',
        class: 'btn btn-info layout_button',
        text: 'This is a button',
        schema: '<input type="button" value="CLICK">',
        options: {
            'title': 'Button'
        }
    }, {
        name: 'Single Column',
        id: 'grid',
        class: 'layout_grid',
        text: 'This is a button',
        schema: '<div class="col-md-8 column grid_area2 ui-widget-header ui-droppable" ng-droppable="dropObject2"><div id="drop_div"></div></div>',
        options: {
            'title': 'Single Column'
        }
    }, {
        name: 'Single Column2',
        id: 'grid',
        class: 'layout_grid',
        text: 'This is a button',
        schema: '<div class="col-md-8 column grid_area2"></div>',
        options: {
            'title': 'Single Column2'
        }
    }, {
        name: 'Line Break',
        id: 'linebreak',
        class: 'draggable2',
        schema: '<div><br /></div>',
        options: {
            'title': 'Line Break'
        }
    }]

    var panel_all = '<div class="container"><div class="rowclearfix"><div class="col-md-2 column"><div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements">{{layout_element.name}}</div><p>Left Panel</p></div><divclass="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2">Right Panel</div></div></div>';
    var panel = '<div class="container"><div class="row clearfix">[LEFT][RIGHT]</div></div>'
    var panel_left = '<div class="col-md-2 column">LEFT DIV<div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements"><div class="layout_item" ng-draggable="dragOptions">{{layout_element.name}}</div></div></div>';
    var panel_right = '<div class="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2"><div id="drop_div" uid="GEN_UID"></div></div>';

    var layout_schema = {
        root: {
            id: '',
            layout_type: 'ROOT',
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
            return layout_type;
        } else {
            for (var i = 0; i < schema.children.length; ++i) {
                return layout_type + '.';
            }
        }
    }

    /**
     * Main link function
     * @param  {[type]} scope   [description]
     * @param  {[type]} element [description]
     * @param  {[type]} attrs   [description]
     * @return {[type]}         [description]
     */
    function link(scope, element, attrs) {

        init();

        scope.updateLayout = function(layout, container_item) {
            scope.layout_elements = layout_elements;
            console.log(get_uid());
            console.log('Update layout: ' + layout);
            console.log(container_item.html());

            var item = {
                id: get_uid(),
                layout_type: layout,
                children: []
            };

            layout_schema.root.children.push(item);
            console.log(JSON.stringify(layout_schema));

            var new_html = container_item.html();
            for (var i = 0; i < layout_elements.length; ++i) {
                if (layout_elements[i].name == layout) {
                    new_html = new_html.replace('<div id="drop_div" uid="' + layout_schema.root.id + '"></div>', layout_elements[i].schema + '<div id="drop_div"></div>');
                }
            }

            // console.log(element.html());
            // var new_html = element.html().replace(container_item, layout);
            // console.log('new_html');
            // console.log(new_html);
            container_item.html(new_html);
            $compile(container_item.contents())(scope);

            // console.log(element.html());

        }

        function init() {
            scope.layout_elements = layout_elements;

            create_elements_panel();
        }

        function create_elements_panel() {
            // var container = $templateCache.get('angularChartsTemplate_' + config.legend.position);
            // var container = '<p>This is a paragraph</p>';
            var uid = get_uid();
            layout_schema.root.id = uid;
            var display_panel = panel.replace('[LEFT]', panel_left).replace('[RIGHT]', panel_right).replace('GEN_UID', uid);
            console.log('display_panel: ' + display_panel)
            element.html(display_panel);
            $compile(element.contents())(scope);
        }
    }





    return {
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

            this.item_dropped = function(dropped_item, container_item) {
                console.log('Communication works');
                $scope.updateLayout(dropped_item, container_item);
                // $scope.dropped = false;
            }

            this.accept_drop = function(container_item) {
                return $scope.dropped;
            }
        }
    }

}).directive('ngDraggable', function($document) {
    return {
        require: '^snLayout',
        restrict: 'A',
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
}).directive('ngDroppable', ['$compile', function($compile) {
    return {
        require: '^snLayout',
        restrict: 'A',
        // transclude: true,
        scope: {
            dropOptions: '=ngDroppable'
        },
        link: function(scope, elem, attr, layoutCtrl) {
            $(elem).droppable({
                helper: 'clone',
                drop: function(event, ui) {
                    layoutCtrl.item_dropped($(ui.draggable).html(), $(this));
                    // console.log('ngDroppable::DROPPED: ' + JSON.stringify(scope.dropOptions));
                    console.log(elem.html());

                    // $compile($(this).html(schema));
                    // var schema = '<p>Item Dropped: ' + $(ui.draggable).html() + '</p>';
                    // $(this).html(schema);
                    // $compile($(this))(scope);

                },
                over: function(event, ui) {
                    console.log('ngDroppable::over: ' + $(ui.draggable).html());
                    console.log('ngDroppable::over: ' + elem.html());
                    // Drag_Factory.valid_drop = true;
                },
                out: function(event, ui) {
                    // console.log('ngDroppable::out: ' + $(ui.draggable).html());
                    // Drag_Factory.valid_drop = false;
                },
                // accept: '#grid'
                accept: function(dragEl) {
                    // console.log('ngDroppable::ACCEPT: ' + JSON.stringify(scope.dropOptions));
                    // console.log('ngDroppable::ACCEPT: ' + JSON.stringify(scope.dropOptions));

                    // if (scope.dropOptions.itemCount >= 1) {
                    //     Drag_Factory.drop_accepted = false;
                    //     return false;
                    // } else {
                    //     Drag_Factory.drop_accepted = true;
                    //     // Drag_Factory.itemCount = 1;
                    //     return true;
                    // }
                    console.log('Accept Drop: ' + layoutCtrl.accept_drop());
                    console.log($(this).html());
                    return layoutCtrl.accept_drop();

                }
            });
        }
    }
}])
