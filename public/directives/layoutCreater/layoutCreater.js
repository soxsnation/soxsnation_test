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

    var panel = '<div class="container"><div class="rowclearfix"><div class="col-md-2 column"><div class="layout_item_list" data-ng-mouseup="layout_dropped(layout_obj)" data-ng-repeat="layout_element in layout_elements">{{layout_element.name}}</div><p>Left Panel</p></div><divclass="col-md-10 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2">Right Panel</div></div></div>';


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
            element.html(panel);
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

})
