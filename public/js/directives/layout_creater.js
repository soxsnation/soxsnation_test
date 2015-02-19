/* layout_creater.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/11/2014
 *
 */


angular.module('soxsnationApp')
    .directive('layoutCreater', ['$compile', 'Drag_Factory', function($compile, Drag_Factory) {

        function get_layout() {
        	return Drag_Factory.layout;
        }

        function update_layout(element, layout_template) {
        	console.log('update_layout: ' + layout_template);
        	var layout = '<div>No Layout</div>';
        	if (layout_template != undefined && layout_template.hasOwnProperty('schema')) {
        		layout = layout_template.schema;
        	}
        	element.html(layout).show();
            $compile(element.contents());
        }

        var linker = function(scope, element, attr) {
        	console.log('linker');
            scope.layout = attr.layout;
            // var prop = attr.prop;
            // console.log('Link: ' + prop + ' ' + typeid);

            var layout = get_layout();
            

            scope.$watch('created_layout', function(newValue, oldValue) {
            	console.log('created_layout watch trigger');
            	update_layout(element, newValue);
                // update_layout(element, item_template, prop, value);
            })

        }

        return {
            restrict: 'E',
            link: linker,
            controller: function($scope) {

                }
                // scope: {
                // content: '='
                // }
        };

        // return {
        //     restrict: 'E',
        //     transclude: true,
        //     template: get_template(),
        //     controller: function($scope) {
        //         $scope.name = 'Casey';
        //     }
        // }

    }]);