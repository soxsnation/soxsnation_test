/* layout_creater.js
 *
 * Author(s):  Andrew Brown
 * Date:       11/11/2014
 *
 */


angular.module('soxsnationApp')
    .directive('layoutCreater', ['$compile', 'Drag_Factory', function($compile, Drag_Factory) {

        var template = function() {
            return '<div class="col-md-8 column grid_area ui-widget-header ui-droppable" ng-droppable="dropObject2"> </div>';
        }

        function update_layout(element, layout_template) {
            // console.log('layoutCreater::update_layout: ' + JSON.stringify(layout_template));
            var layout = '<div>No Layout</div>';
            if (layout_template != undefined && layout_template.hasOwnProperty('schema')) {
                layout = layout_template.schema;
                layout = template;
            }
            // element.html(layout).show();
            // $compile(element.contents());
        }

        var linker = function(scope, element, attr) {
            // console.log('layoutCreater::linker');
            // console.log(scope.created_layout);
            scope.layout = attr.layout;

            var layout = Drag_Factory.layout;

            // scope.$watch('created_layout', function(newValue, oldValue) {
            //     console.log('layoutCreater::created_layout watch trigger');
            //     scope.update_needed = newValue;
            //     update_layout(element, newValue);
            //     // update_layout(element, item_template, prop, value);
            // })

        }

        function watch(scope, element, watch_value) {
            scope.$watch(watch_value, function(newValue, oldValue) {
                console.log('watch::created_layout watch trigger');

                // scope.update_needed = newValue;
                update_layout(element, newValue);
                // update_layout(element, item_template, prop, value);
            })
        }

        return {
            restrict: 'E',
            // transclude: true,
            // link: linker,
            controller: function($scope) {
                var layouts = $scope.layouts = [];
                this.addLayout = function(layout) {
                    console.log('addlayout::' + layout);
                    layouts.push(layout);
                }

                this.watch = watch;
            },
            template: '<div></div>',
            link: function(scope, element) {
                    if (Drag_Factory.valid_drop) {
                        Drag_Factory.valid_drop = false;
                        var html = '<div class="col-md-10 column grid_area ui-droppable" ng-droppable="dropObject2"> </div>';

                        var l = Drag_Factory.get_layout();
                        if (l != '') {
                            html = l;
                        }

                        // console.log('html: ' + JSON.stringify(html));
                        console.log('html: ' + html);

                        // element.append(html);
                        element.html(html).show();
                        $compile(element.contents())(scope);
                    }
                }
                // template: '<div class="col-md-10 column grid_area ui-droppable" ng-droppable="dropObject2" ng-transclude> </div>'
                // template: '<div class="col-md-10 column grid_area ui-droppable" ng-droppable="dropObject2"> </div>'
        };
    }])
    // .directive('layoutArea', ['$compile', 'Drag_Factory', function($compile, Drag_Factory) {

    //     function update_layout_Area(element, layout_template) {
    //         console.log('layoutArea::update_layout_Area');

    //         var l = '<div class="col-md-6 column">Layout Area </div>';
    //         element.html(l).show();
    //         $compile(element.contents());
    //     }

    //     var layout_linker = function(scope, element, attr) {
    //         // console.log('layoutArea::layout_linker');


    //         // scope.$watch('update_needed', function(newValue, oldValue) {
    //         //     console.log('layoutArea::update_needed watch trigger');
    //         //     update_layout_Area(element, newValue);
    //         // })
    //     }

    //     return {
    //         require: '^layoutCreater',
    //         restrict: 'E',
    //         // transclude: true,
    //         // link: layout_linker,
    //         template: '<div>Layout Area</div>',
    //         link: function(scope, element, attrs, layoutCtrl) {
    //             layoutCtrl.watch(scope, element, 'created_layout')
    //             layoutCtrl.addLayout(scope);

    //             element.append(html);
    //             $compile(element.contents())(scope);
    //         },
    //         // template: '<div ng-transclude>Layout Area</div>'
    //         // template: '<div>Layout Area</div>'
    //     }

    // }])
