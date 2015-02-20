/* drag.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
    .factory('Drag_Factory', function() {

        var item_layout = {};
        var layout = '';
        var itemCount = 1;
        var valid_drop = true;
        var drop_accepted = false;

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
            schema: '<div class="col-md-8 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2"> </div>',
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
        }];

        function layout_schema(schema_name) {
            for (var i = 0; i < layout_elements.length; ++i) {
                if (layout_elements[i].name == schema_name) {

                    // var schema = '<layout-creater layout="' +JSON.stringify(layout_elements[i].options) + ' "><layout-area>' + layout_elements[i].schema + '</layout-area></layout-creater>'
                    // var schema = '<layout-creater layout="' + JSON.stringify(layout_elements[i].options) + ' ">' + layout_elements[i].schema + '</layout-creater>'
                    var schema = '<div layout="' + JSON.stringify(layout_elements[i].options) + ' ">' + layout_elements[i].schema + '</div>'
                    layout = schema;
                    return schema;
                }
            }
            return 'NOT FOUND';
        }

        function get_layout() {
            // valid_drop = false;
            console.log('get_layout: ' + JSON.stringify(layout));
            var l = layout;

            // layout = '';
            return l;
        }

        var update_layout;

        function layout_dropped(newLayout) {
            // console.log('Drag_Factory::layout_dropped: ' + newLayout);
            layout = newLayout;
            itemCount = itemCount + 1;
            // console.log('Drag_Factory::' + itemCount);
            // valid_drop = true;
        };


        var data = {
            foo: 'Shared service',
            item_layout: item_layout,
            layout: layout,
            layout_elements: layout_elements,
            layout_dropped: layout_dropped,
            itemCount: itemCount,
            valid_drop: valid_drop,
            layout_schema: layout_schema,
            get_layout: get_layout
        };

        return data;
    });

angular.module('soxsnationApp')
    .directive('ngDraggable', function($document, Drag_Factory) {
        return {
            restrict: 'A',
            scope: {
                dragOptions: '=ngDraggable'
            },
            link: function(scope, elem, attr) {
                // $(elem).draggable(scope.dragOptions);
                $(elem).draggable({
                    revert: 'invalid',
                    // revert: true,
                    helper: 'clone',
                    // containment: $("#layout_creation_area"),
                    stop: function(event, ui) {
                        // console.log('ngDraggable::STOP: ' + JSON.stringify(scope.dragOptions));

                        // Drag_Factory.layout_dropped(scope.dragOptions);
                    }
                });
            }
        }
    });

angular.module('soxsnationApp')
    .directive('ngDroppable', ['$compile', 'Drag_Factory', function($compile, Drag_Factory) {
        return {
            restrict: 'A',
            // transclude: true,
            scope: {
                dropOptions: '=ngDroppable'
            },
            link: function(scope, elem, attr) {
                $(elem).droppable({
                    helper: 'clone',
                    drop: function(event, ui) {
                        console.log('ngDroppable::DROPPED: ' + JSON.stringify(scope.dropOptions));
                        // console.log(JSON.stringify());

                        var schema = Drag_Factory.layout_schema($(ui.draggable).html());

                        // elem.html().show();
                        // $compile(elem.contents());

                        // $compile($(this).html(schema));
                        $(this).html(schema);
                        $compile($(this))(scope);

                        // console.log('ngDroppable::Dropped HTML: ' + $(ui.draggable).html());
                        Drag_Factory.layout_dropped($(ui.draggable).html());
                        // scope.dropOptions.itemCount = scope.dropOptions.itemCount + 1;
                        Drag_Factory.valid_drop = true;
                        // Drag_Factory.item_layout['test'] = scope.dropOptions;
                        // alert('Dropped: ' + JSON.stringify(ui.position));
                    },
                    over: function(event, ui) {
                        // console.log('ngDroppable::over: ' + $(ui.draggable).html());
                        Drag_Factory.valid_drop = true;
                    },
                    out: function(event, ui) {
                        // console.log('ngDroppable::out: ' + $(ui.draggable).html());
                        Drag_Factory.valid_drop = false;
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
                        return true;

                    }
                });
            }
        }
    }])
