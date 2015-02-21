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
    }]

    var panel_all = '<div class="container"><div class="rowclearfix"><div class="col-md-2 column"><div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements">{{layout_element.name}}</div><p>Left Panel</p></div><divclass="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2">Right Panel</div></div></div>';
    var panel = '<div class="container"><div class="row clearfix">[LEFT][RIGHT]</div></div>'
    var panel_left = '<div class="col-md-2 column">LEFT DIV<div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements"><div class="layout_item" ng-draggable="dragOptions">{{layout_element.name}}</div></div></div>';
    var panel_right = '<div class="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2">RIGHT DIV</div>';

    /**
     * Main link function
     * @param  {[type]} scope   [description]
     * @param  {[type]} element [description]
     * @param  {[type]} attrs   [description]
     * @return {[type]}         [description]
     */
    function link(scope, element, attrs) {

        init();



        function init() {
            scope.layout_elements = layout_elements;

            create_elements_panel();
        }

        function create_elements_panel() {
            // var container = $templateCache.get('angularChartsTemplate_' + config.legend.position);
            // var container = '<p>This is a paragraph</p>';
            var display_panel = panel.replace('[LEFT]', panel_left).replace('[RIGHT]', panel_right);
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
        }
    }

}).directive('ngDraggable', function($document) {
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

                }
            });
        }
    }
}).directive('ngDroppable', ['$compile', function($compile) {
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

                    // var schema = Drag_Factory.layout_schema($(ui.draggable).html());

                    // elem.html().show();
                    // $compile(elem.contents());

                    // $compile($(this).html(schema));
                    var schema = '<p>Item Dropped: ' + $(ui.draggable).html() + '</p>';
                    $(this).html(schema);
                    $compile($(this))(scope);

                    // console.log('ngDroppable::Dropped HTML: ' + $(ui.draggable).html());
                    // Drag_Factory.layout_dropped($(ui.draggable).html());
                    // scope.dropOptions.itemCount = scope.dropOptions.itemCount + 1;
                    // Drag_Factory.valid_drop = true;
                    // Drag_Factory.item_layout['test'] = scope.dropOptions;
                    // alert('Dropped: ' + JSON.stringify(ui.position));
                },
                over: function(event, ui) {
                    // console.log('ngDroppable::over: ' + $(ui.draggable).html());
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
                    return true;

                }
            });
        }
    }
}])
